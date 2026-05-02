# Project Decisions v0.1

Project: `pentrunoi-service-platform`

## Locked decisions

- Start with a development version first.
- Keep the project Docker-ready from the first step.
- The project must be easy to back up and move to a new Docker environment later.
- Public tracking route: `/status`.
- Initial upload storage: local `/uploads`.
- Main/admin email: `gianig@gmail.com`.
- Public email: `contact@pentrunoi.ro`.
- Forms are the main contact method.
- No phone CTA on marketing pages.
- Customer registration is not required at launch.
- Customers track repair/request status with a unique tracking ID.
- Versioning starts with `0.1.0-dev` and later production `1.0.0`.

## Working model

- ChatGPT: architect, reviewer, report writer, changelog controller.
- Claude: limited code generator, one small task at a time.

## First priority

Build a clean scaffold with Docker, PostgreSQL, Next.js, Prisma, Tailwind, local uploads, backup scripts, and changelog support.
