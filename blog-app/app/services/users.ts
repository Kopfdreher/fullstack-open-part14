import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users } from "../../db/schema"

export const getUsers = async () => {
  return db.query.users.findMany()
}

export const getUserbyId = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  })
}

export const getUserWithBlogs = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: { blogs: true },
  })
}

export const getUsernameWithBlogs = async (username: string) => {
  return db.query.users.findFirst({
    where: eq(users.username, username),
    with: { blogs: true },
  })
}
