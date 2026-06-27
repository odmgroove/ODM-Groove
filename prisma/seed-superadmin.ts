import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ALL_PERMISSIONS = JSON.stringify([
  "view:kitchen","view:bar","create:orders","manage:inventory",
  "view:analytics","manage:staff","view:shifts","manage:rooms",
  "manage:events","manage:blog","manage:gallery","manage:faqs",
  "view:bookings","manage:ai"
]);

async function createAdmin(email: string, name: string, password: string, isSuperAdmin: boolean) {
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log("⚠️  Already exists:", email);
    return;
  }
  const hashed = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({
    data: { email, name, password: hashed, isSuperAdmin, permissions: ALL_PERMISSIONS },
  });
  console.log("✅ Created:", email);
}

async function main() {
  // Super Admin (hidden from all other staff)
  await createAdmin("hatykuxordik@gmail.com", "Super Admin", "1", true);

  // ODM Groove Admin — enter the password below
  await createAdmin("odmgroove@gmail.com", "ODM Groove Admin", "$Odmgroove2024$", true);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
