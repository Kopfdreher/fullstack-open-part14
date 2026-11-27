"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { markAsRead } from "@/app/actions/blogs"

interface UserProfile {
  name: string
  username: string
  token: string | null
}

interface ReadingListItem {
  id: number
  read: boolean
  blog: {
    id: number
    title: string
    author: string
  }
}

export default function MePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [items, setItems] = useState<ReadingListItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/me/profile", { cache: "no-store" })
    if (res.status === 401) {
      router.replace("/login")
      return
    }
    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
      setItems(data.items)
    }
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  async function handleGenerateToken(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/me/profile", { method: "POST" })
    if (res.status === 401) {
      router.replace("/login")
      return
    }
    if (res.ok) {
      const data = await res.json()
      setUser((prev) => (prev ? { ...prev, token: data.token } : prev))
    }
  }

  async function handleMarkAsRead(formData: FormData) {
    await markAsRead(formData)
    await fetchProfile()
  }

  if (loading || !user) {
    return <div className="max-w-xl mx-auto p-6">Loading...</div>
  }

  const unreadItems = items.filter((item) => !item.read)
  const readItems = items.filter((item) => item.read)

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Page</h1>

      <section data-testid="user-profile" className="space-y-1">
        <p data-testid="user-name">
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p data-testid="user-username">
          <span className="font-semibold">Username:</span> {user.username}
        </p>
      </section>

      <section data-testid="api-token-section" className="space-y-3">
        <h2 className="text-lg font-semibold">API Token</h2>
        {user.token ? (
          <p data-testid="token-display" className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
            <span data-testid="api-token">{user.token}</span>
          </p>
        ) : (
          <p data-testid="no-token-message" className="text-gray-600 dark:text-gray-400">
            No token has been generated yet.
          </p>
        )}

        <form onSubmit={handleGenerateToken}>
          <button
            type="submit"
            data-testid="generate-token-button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Generate new token
          </button>
        </form>
      </section>

      <section data-testid="reading-list-section" className="space-y-4">
        <h2 className="text-lg font-semibold">Reading List</h2>

        <div data-testid="unread-section" className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Unread</h3>
          {unreadItems.length === 0 ? (
            <p data-testid={readItems.length === 0 ? "empty-reading-list" : "no-unread-blogs"} className="text-sm text-gray-500">No unread blogs.</p>
          ) : (
            <ul className="space-y-2">
              {unreadItems.map((item) => (
                <li
                  key={item.id}
                  className="border rounded p-3 flex items-center justify-between gap-2"
                >
                  <Link
                    href={`/blogs/${item.blog.id}`}
                    className="hover:underline"
                  >
                    {item.blog.title} by {item.blog.author}
                  </Link>
                  <form action={handleMarkAsRead}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      data-testid={`mark-read-${item.id}`}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 cursor-pointer shrink-0"
                    >
                      mark as read
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div data-testid="read-section" className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Read</h3>
          {readItems.length === 0 ? (
            <p className="text-sm text-gray-500">No read blogs.</p>
          ) : (
            <ul className="space-y-2">
              {readItems.map((item) => (
                <li key={item.id} className="border rounded p-3">
                  <Link
                    href={`/blogs/${item.blog.id}`}
                    className="hover:underline"
                  >
                    {item.blog.title} by {item.blog.author}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
