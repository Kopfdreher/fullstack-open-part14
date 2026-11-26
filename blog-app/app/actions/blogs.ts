"use server"

import { redirect } from "next/navigation"
import { addBlog, addLike } from "../services/blogs"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export const createBlog = async (
  prevState: { error: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) redirect("/login")

  const title = formData.get("title") as string
  if (!title || title.length < 5) return { error: "title too short" }
  const author = formData.get("author") as string
  if (!author || author.length < 5) return { error: "author too short" }
  const url = formData.get("url") as string
  if (!url || url.length < 5) return { error: "url too short" }
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
