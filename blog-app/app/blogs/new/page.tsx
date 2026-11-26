"use client"

import { useActionState } from "react"
import { createBlog, type CreateBlogState } from "../../actions/blogs"

const NewBlog = () => {
  const initialState: CreateBlogState = {}
  const [state, formAction] = useActionState(createBlog, initialState)

  return (
    <div>
      <h2>Create a new blog</h2>
      <form action={formAction}>
        <div>
          <label>
            Title
            <input
              type="text"
              name="title"
              defaultValue={state.values?.title}
              required />
            {state.errors?.title && <p style={{ color: "red" }}>{state.errors.title}</p>}
          </label>
        </div>
        <div>
          <label>
            Author
            <input
              type="text"
              name="author"
              defaultValue={state.values?.author}
              required />
            {state.errors?.author && <p style={{ color: "red" }}>{state.errors.author}</p>}
          </label>
        </div>
        <div>
          <label>
            URL
            <input
              type="text"
              name="url"
              defaultValue={state.values?.url}
              required />
            {state.errors?.url && <p style={{ color: "red" }}>{state.errors.url}</p>}
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlog
