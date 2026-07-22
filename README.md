# Neotrix Motion

The independent source for the Neotrix Motion portfolio and studio operations site.

## Application

- React, Vite, and TypeScript
- React Router, Tailwind CSS, Framer Motion, and shadcn/ui
- Supabase-compatible authentication, PostgreSQL data, realtime updates, and object storage
- OpenAI Sites hosting with the custom domain `motion.neotrix.asia`

## Local development

Copy `.env.example` to `.env` and provide the URL, project ID, and publishable key for the site's backend. Then run:

```sh
npm install
npm run dev
```

Validation commands:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Data and security

Database migrations are stored in `supabase/migrations`. The public catalog, administrator tools, inquiries, client logos, job openings, site settings, authentication, timeline records, and project image uploads use the configured Supabase-compatible backend. Administrator authorization is enforced with database row-level security, not only in the browser interface.

Local environment files are intentionally excluded from source control.
