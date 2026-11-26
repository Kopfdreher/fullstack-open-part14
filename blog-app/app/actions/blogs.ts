"use server"

import { redirect } from "next/navigation"
import { addBlog, addLike } from "../services/blogs"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { readingList } from "@/db/schema"
import { getCurrentUser } from "../services/session"

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

  const errors: Partial<input> = {}
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

export const addToReadingList = async (formData: FormData) => {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const blogId = Number(formData.get("blogId"))
  const existing = await db.query.readingList.findFirst({
    where: and(eq(readingList.userId, user.id), eq(readingList.blogId, blogId)),
  })

  if (!existing) {
    await db.insert(readingList).values({
      userId: user.id,
      blogId,
    })
  }

  revalidatePath(`/blogs/${blogId}`)
  revalidatePath("/me")
}

export const markAsRead = async (formData: FormData) => {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const id = Number(formData.get("id"))
  await db
    .update(readingList)
    .set({ read: true })
    .where(and(eq(readingList.id, id), eq(readingList.userId, user.id)))

  revalidatePath("/me")
}
