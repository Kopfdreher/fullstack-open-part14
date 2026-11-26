import Link from "next/link"
import { getBlogs } from "../services/blogs"

export const instant = false

const Blogs = async ({
  searchParams
}: {
    searchParams: Promise<{ filter?: string }>
  }) => {
  const { filter } = await searchParams
  const allBlogs = await getBlogs()
  const blogs = filter
    ? allBlogs.filter(b => b.title.toLowerCase().includes(filter.toLowerCase()))
    : allBlogs
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>
      <div className="mb-4">
        <form method="GET" action="/blogs" className="flex gap-2">
          <input
            type="text"
            name="filter"
            defaultValue={filter ?? ""}
            className="border rounded px-3 py-1 flex-1"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            search
          </button>
        </form>
      </div>
      <ul className="space-y-2">
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((b) => (
            <li key={b.id} className="border rounded p-3 hover:bg-gray-50">
              <Link
                href={`/blogs/${b.id}`}
                className="text-blue-600 hover:underline"
              >
                {b.title}
              </Link>{" "}
              by {b.author} | {b.likes} likes
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Blogs
