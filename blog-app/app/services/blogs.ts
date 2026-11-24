const blogs = [
  {
    "id": 1,
    "title": "Getting Started with Next.js App Router",
    "author": "Sarah Jenkins",
    "url": "https://example.com/blogs/nextjs-app-router",
    "likes": 42
  },
  {
    "id": 2,
    "title": "Understanding React Server Components",
    "author": "David Chen",
    "url": "https://example.com/blogs/react-server-components",
    "likes": 85
  },
  {
    "id": 3,
    "title": "CSS Grid vs. Flexbox: When to Use Which",
    "author": "Elena Rodriguez",
    "url": "https://example.com/blogs/css-grid-vs-flexbox",
    "likes": 64
  },
  {
    "id": 4,
    "title": "Mastering TypeScript Generics",
    "author": "Marcus Vance",
    "url": "https://example.com/blogs/typescript-generics",
    "likes": 119
  }
]

let nextId = 5

export const getBlogs = () => {
  return blogs
}

export const addBlog = (title: string, author: string, url: string) => {
  blogs.push({ id: nextId++, title, author, url, likes: 0 })
}
