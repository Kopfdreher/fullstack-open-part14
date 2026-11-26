"use client"

import { useActionState } from "react"
import { createBlog, type CreateBlogState } from "../../actions/blogs"

const NewBlog = () => {
  const initialState: CreateBlogState = {}
  const [state, formAction] = useActionState(createBlog, initialState)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create a new blog</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Title
            <input
              type="text"
              name="title"
              defaultValue={state.values?.title}
              required
              className="mt-1 block w-full border rounded px-3 py-2"
            />
            {state.errors?.title && (
              <p className="text-red-600 text-sm mt-1">{state.errors.title}</p>
            )}
          </label>
        </div>
        <div>
          <label className="block font-medium mb-1">
            Author
            <input
              type="text"
              name="author"
              defaultValue={state.values?.author}
              required
              className="mt-1 block w-full border rounded px-3 py-2"
            />
            {state.errors?.author && (
              <p className="text-red-600 text-sm mt-1">{state.errors.author}</p>
            )}
          </label>
        </div>
        <div>
          <label className="block font-medium mb-1">
            URL
            <input
              type="text"
              name="url"
              defaultValue={state.values?.url}
              required
              className="mt-1 block w-full border rounded px-3 py-2"
            />
            {state.errors?.url && (
              <p className="text-red-600 text-sm mt-1">{state.errors.url}</p>
            )}
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default NewBlog
