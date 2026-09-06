import { prisma } from "@/lib/prisma";

export type Role = "admin" | "member";
export type UserStatus = "pending" | "active" | "disabled";

export function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export function createUser(data: {
  username: string;
  passwordHash: string;
  displayName: string;
  role: Role;
  status: UserStatus;
  mustChangePassword: boolean;
}) {
  return prisma.user.create({ data });
}
