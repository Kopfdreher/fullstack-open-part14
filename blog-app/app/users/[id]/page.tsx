import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserWithBlogs } from "../../services/users"

export const instant = false

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const user = await getUserWithBlogs(Number(id))

  if (!user) notFound()

  return (
    <div>
      <h2>{user.name}</h2>
      <p>User: {user.username}</p>
      <h3>Blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
            by {blog.author} | {blog.likes} Likes
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserPage
