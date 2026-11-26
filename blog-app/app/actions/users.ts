"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

interface input {
    username: string
    name: string
    password: string
    passwordConfirm: string
}

export interface RegisterUserState {
  errors?: Partial<input>
  values?: input
}

export const registerUser = async (
  prevState: RegisterUserState,
  formData: FormData
): Promise<RegisterUserState> => {
  const username = (formData.get("username") as string)?.trim() ?? ""
  const name = (formData.get("name") as string)?.trim() ?? ""
  const password = formData.get("password") as string ?? ""
  const passwordConfirm = formData.get("passwordConfirm") as string ?? ""
  const values = { username, name, password, passwordConfirm }
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username))

  const errors: Partial<input> = {}
  const errorString = "must be at least 4 characters"
  if (!username || username.length < 4) errors.username = "username " + errorString
  if (!password || password.length < 4) errors.password = "password " + errorString
  if (!passwordConfirm || password !== passwordConfirm) {
    errors.passwordConfirm = "passwords do not match"
  }
  if (existingUser.length > 0) errors.username = "username already exists"

  if (Object.keys(errors).length > 0) return { errors, values }

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  redirect("/login")
}
