const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.changelogEntry.upsert({
    where: {
      id: "seed-0-1-0-dev-project-planning"
    },
    update: {
      version: "0.1.0-dev",
      type: "PLANNING",
      module: "Project",
      title: "Project rebuild planning started",
      description:
        "Initial pentrunoi.ro rebuild plan created with Docker-ready development setup, repair tracking, admin dashboard, legal pack, uploads, backups and changelog module.",
      status: "DONE"
    },
    create: {
      id: "seed-0-1-0-dev-project-planning",
      version: "0.1.0-dev",
      type: "PLANNING",
      module: "Project",
      title: "Project rebuild planning started",
      description:
        "Initial pentrunoi.ro rebuild plan created with Docker-ready development setup, repair tracking, admin dashboard, legal pack, uploads, backups and changelog module.",
      status: "DONE"
    }
  });

  await prisma.changelogEntry.upsert({
    where: {
      id: "seed-0-1-0-dev-scaffold"
    },
    update: {
      version: "0.1.0-dev",
      type: "FEATURE",
      module: "Scaffold",
      title: "Initial scaffold created",
      description:
        "Created Next.js App Router scaffold with TypeScript, Tailwind CSS, Prisma, PostgreSQL configuration, Docker files, uploads strategy, backup scripts and documentation.",
      status: "DONE"
    },
    create: {
      id: "seed-0-1-0-dev-scaffold",
      version: "0.1.0-dev",
      type: "FEATURE",
      module: "Scaffold",
      title: "Initial scaffold created",
      description:
        "Created Next.js App Router scaffold with TypeScript, Tailwind CSS, Prisma, PostgreSQL configuration, Docker files, uploads strategy, backup scripts and documentation.",
      status: "DONE"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
