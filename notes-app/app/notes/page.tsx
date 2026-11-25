import Link from "next/link"
import { getNotes } from "../services/notes"

export const instant = false

const Notes = async ({
  searchParams,
}: {
  searchParams: Promise<{ important?: string }>
  }) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  const notes = await getNotes(showImportant)
  return (
    <div>
      <h2>Notes</h2>
      <div>
        <Link href={showImportant ? "/notes" : "/notes?important=true"}>
          {showImportant ? "show all" : "show important only"}
        </Link>
      </div>
      <ul>
        {notes.map(n => (
        <li key={n.id}>
            <Link href={`/notes/${n.id}`}>{n.content}</Link>
            {n.important && <strong> (important)</strong>}
        </li>
        ))}
      </ul>
    </div>
  )
}

export default Notes
