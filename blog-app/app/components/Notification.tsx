"use client"

import { useNotification } from "./NotificationContext"

export default function Notification() {
  const { message, type } = useNotification()

  if (!message) return null

  const bgClass = type === "success" ? "bg-green-600" : "bg-red-600"

  return (
    <div data-testid="notification" className={`${bgClass} text-white px-4 py-2.5 mb-2.5 rounded`}>
      {message}
    </div>
  )
}
