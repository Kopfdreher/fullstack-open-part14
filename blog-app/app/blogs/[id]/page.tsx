import { notFound } from "next/navigation"
import { and, eq } from "drizzle-orm"
import { getBlogById } from "../../services/blogs"
import { getCurrentUser } from "../../services/session"
import { addBlogLike, addToReadingList } from "../../actions/blogs"
import { db } from "@/db"
import { readingList } from "@/db/schema"
import type { Metadata } from "next"

export const instant = false

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> => {
  const { id } = await params
  const blog = await getBlogById(Number(id))
  return {
    title: blog ? blog.title : "Blog not found",
  }
}

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const blog = await getBlogById(Number(id))

  if (!blog) notFound()

  const currentUser = await getCurrentUser()
  const canAddToReadingList =
    currentUser !== undefined &&
    currentUser !== null &&
    blog.userId !== currentUser.id

  const alreadyInReadingList =
    currentUser && canAddToReadingList
      ? Boolean(
          await db.query.readingList.findFirst({
            where: and(
              eq(readingList.userId, currentUser.id),
              eq(readingList.blogId, blog.id)
            ),
          })
        )
      : false

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">
        {blog.title} <span className="font-normal text-gray-600">by {blog.author}</span>
      </h2>
      <div className="border rounded p-4 flex items-center justify-between">
        <p className="text-lg">likes: {blog.likes}</p>
        <div className="flex items-center gap-2">
          <form action={addBlogLike}>
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 cursor-pointer"
            >
              add like
            </button>
          </form>
          {canAddToReadingList && !alreadyInReadingList && (
            <form action={addToReadingList}>
              <input type="hidden" name="blogId" value={blog.id} />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 cursor-pointer"
              >
                add to reading list
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogPage
