import { notFound } from "next/navigation"
import { getBlogById } from "../../services/blogs"
import { addBlogLike } from "../../actions/blogs"

export const instant = false

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const blog = await getBlogById(Number(id))

  if (!blog) notFound()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {blog.title} <span className="font-normal text-gray-600">by {blog.author}</span>
      </h2>
      <div className="border rounded p-4 flex items-center justify-between">
        <p className="text-lg">likes: {blog.likes}</p>
        <form action={addBlogLike}>
          <input type="hidden" name="id" value={blog.id} />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
          >
            add like
          </button>
        </form>
      </div>
    </div>
  )
}

export default BlogPage
