This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment and Security

Copy `.env.example` to `.env.local` and configure `DATABASE_URL` plus a unique `NEXTAUTH_SECRET` of at least 32 characters. Generate a secret with `openssl rand -base64 48`. The server validates both values during startup.

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` to enable project map pins. Restrict the browser key to the site’s HTTP referrers and the Google Maps JavaScript API. Project pins require latitude and longitude in the project admin form.

After pulling project schema changes, sync PostgreSQL with `npx prisma db push` and regenerate the Prisma client with `npx prisma generate`. When applying the separate spare-parts catalog for the first time, run `npx prisma db execute --file prisma/migrations/20261013_separate_spare_parts/migration.sql` after `db push` and before regenerating the Prisma client to move existing spare-part records out of the elevator-products table while preserving their IDs and images.

Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 16 characters before running `node prisma/seed.mjs`. Do not commit environment files or use example values in production. Rotate any credentials that have previously been exposed.

Administrator page middleware verifies the signed session. Admin API handlers also validate the session against the current administrator record in PostgreSQL; every `/api/admin` data endpoint requires authentication.

## Verification

```bash
npm run lint
npm run build
npm run test:smoke
```

The smoke tests require a successful production build and exercise unauthenticated admin API and page requests. GitHub Actions runs lint, build, and these tests on pushes and pull requests to `main`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
