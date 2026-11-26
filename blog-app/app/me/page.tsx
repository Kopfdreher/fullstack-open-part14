import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { readingList, users } from "@/db/schema"
import { markAsRead } from "@/app/actions/blogs"

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

  const items = await db.query.readingList.findMany({
    where: eq(readingList.userId, user.id),
    with: {
      blog: true,
    },
  })

  const unreadItems = items.filter((item) => !item.read)
  const readItems = items.filter((item) => item.read)

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

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Reading List</h2>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Unread</h3>
          {unreadItems.length === 0 ? (
            <p className="text-sm text-gray-500">No unread blogs.</p>
          ) : (
            <ul className="space-y-2">
              {unreadItems.map((item) => (
                <li
                  key={item.id}
                  className="border rounded p-3 flex items-center justify-between gap-2"
                >
                  <Link
                    href={`/blogs/${item.blog.id}`}
                    className="hover:underline"
                  >
                    {item.blog.title} by {item.blog.author}
                  </Link>
                  <form action={markAsRead}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 cursor-pointer shrink-0"
                    >
                      mark as read
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Read</h3>
          {readItems.length === 0 ? (
            <p className="text-sm text-gray-500">No read blogs.</p>
          ) : (
            <ul className="space-y-2">
              {readItems.map((item) => (
                <li key={item.id} className="border rounded p-3">
                  <Link
                    href={`/blogs/${item.blog.id}`}
                    className="hover:underline"
                  >
                    {item.blog.title} by {item.blog.author}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
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
