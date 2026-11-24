# Full Stack Open — Part 14

Solutions for [Full Stack Open, part 14: Next.js](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs).

Parts 0–5: [fullstack-open-part00-05](https://github.com/Kopfdreher/fullstack-open-part00-05). Part 11: [fullstack-open-part11](https://github.com/Kopfdreher/fullstack-open-part11).

Unlike earlier parts built as a Single-Page Application with a separate Node/Express backend, this part builds full-stack applications with **Next.js** and **React Server Components (RSC)**.

A Next.js App Router app with shared layouts and file-based routing. Server Components handle server-side rendering and data fetching, while Server Actions replace traditional REST endpoints for mutations, with caching, revalidation, and streaming UI via React `Suspense`. **Drizzle ORM** with **PostgreSQL** (on Vercel Postgres) replaces MongoDB/Sequelize for type-safe schemas, migrations, relational joins, and SQL-builder queries. Authentication uses **NextAuth** with credentials and JWT sessions to protect routes and Server Actions. Forms use React's `useActionState` for validation, React Context for notifications, and **Tailwind CSS** for styling, alongside traditional API routes/tokens and deployment to **Vercel**.

| Directory | What it covers |
| --- | --- |
| `.` | Next.js App Router, Server Actions, Drizzle/Postgres, NextAuth, and Vercel deployment |

If you're looking for a video walkthrough covering the same core stack (Next.js App Router, Server Actions, and Auth.js), check out this [Next.js 14 Full Stack App Tutorial](https://www.youtube.com/watch?v=vCOSTG10Y4o).
