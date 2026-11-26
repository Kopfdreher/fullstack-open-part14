import { Suspense } from "react"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"

async function MeContent() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  })

  if (!user) {
    redirect("/login")
  }

  async function generateToken() {
    "use server"
    const currentSession = await auth()
    if (!currentSession?.user?.email) {
      redirect("/login")
    }

    const token = crypto.randomUUID()
    await db
      .update(users)
      .set({ token })
      .where(eq(users.username, currentSession.user.email))

    revalidatePath("/me")
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Page</h1>

      <section className="space-y-1">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Username:</span> {user.username}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">API Token</h2>
        {user.token ? (
          <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
            {user.token}
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No token has been generated yet.
          </p>
        )}

        <form action={generateToken}>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Generate new token
          </button>
        </form>
      </section>
    </main>
  )
}

export default function MePage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto p-6">Loading...</div>}>
      <MeContent />
    </Suspense>
  )
}
