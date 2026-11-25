import Link from "next/link"
import { getBlogs } from "../services/blogs"

export const instant = false

const Blogs = async ({
  searchParams
}: {
    searchParams: Promise<{ filter?: string }>
  }) => {
  const { filter } = await searchParams
  const allBlogs = getBlogs()
  const blogs = filter
    ? allBlogs.filter(b => b.title.toLowerCase().includes(filter.toLowerCase()))
    : allBlogs
  return (
    <div>
      <h2>Blogs</h2>
      <div>
        <form method="GET" action="/blogs">
          <input type="text" name="filter" defaultValue={filter ?? ''} />
          <button type="submit">
            search
          </button>
        </form>
      </div>
      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(b => (
          <li key={b.id}>
            <Link href={`/blogs/${b.id}`}>{b.title}</Link> by {b.author} | {b.likes} likes
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs
