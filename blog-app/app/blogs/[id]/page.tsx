import { notFound } from "next/navigation"
import { getBlogById } from "../../services/blogs"
import { addBlogLike } from "../../actions/blogs"

export const instant = false

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const blog = await getBlogById(Number(id))

  if (!blog) notFound()

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <p>likes: {blog.likes}</p>
      <form action={addBlogLike}>
        <input type="hidden" name="id" value={blog.id} />
        <button type="submit">add like</button>
      </form>
    </div>
  )
}

export default BlogPage
