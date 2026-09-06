import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";
import { findUserByUsername, createUser } from "../repositories/user.repository";

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error("ADMIN_USERNAME / ADMIN_PASSWORD must be set to run the seed.");
  }

  if (await findUserByUsername(username)) {
    console.log(`Admin user "${username}" already exists — skipping.`);
    return;
  }

  await createUser({
    username,
    passwordHash: await hashPassword(password),
    displayName: username,
    role: "admin",
    status: "active",
    mustChangePassword: false,
  });
  console.log(`Admin user "${username}" created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
