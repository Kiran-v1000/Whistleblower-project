import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "ethics.officer@utthunga.com" },
    update: {},
    create: {
      name: "Ethics Officer",
      email: "ethics.officer@utthunga.com",
      passwordHash,
      role: "ETHICS_OFFICER",
    },
  });
  console.log("Seeded ethics officer: ethics.officer@utthunga.com / Admin@123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
