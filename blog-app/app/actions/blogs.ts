"use server"

import { redirect } from "next/navigation"
import { addBlog, addLike } from "../services/blogs"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

interface input {
    title: string
    author: string
    url: string
}

export interface CreateBlogState {
  errors?: Partial<input>
  values?: input
}

export const createBlog = async (
  prevState: CreateBlogState,
  formData: FormData
): Promise<CreateBlogState> => {
  const session = await auth()
  if (!session) redirect("/login")

  const title = formData.get("title") as string ?? ""
  const author = formData.get("author") as string ?? ""
  const url = formData.get("url") as string ?? ""
  const values = { title, author, url }

  const errors: Partial<input> = { title: "", author: "", url: "" }
  const errorString = "must be at least 5 characters"
  if (!title || title.length < 5) errors.title = "title " + errorString
  if (!author || author.length < 5) errors.author = "author " + errorString
  if (!url || url.length < 5) errors.url = "url " + errorString

  if (Object.keys(errors).length > 0) return { errors, values }

  await addBlog(title, author, url)

  revalidatePath("/blogs")
  redirect("/blogs")
}

export const addBlogLike = async (formData: FormData) => {
  const id = Number(formData.get("id"))
  await addLike(id)
  revalidatePath(`/blogs/${id}`)
  revalidatePath("/blogs")
}
