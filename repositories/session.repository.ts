import { prisma } from "@/lib/prisma";

export function createSession(data: { userId: string; tokenHash: string; expiresAt: Date }) {
  return prisma.session.create({ data });
}

export function findSessionWithUserByTokenHash(tokenHash: string) {
  return prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
}

export function extendSession(id: string, expiresAt: Date) {
  return prisma.session.update({ where: { id }, data: { expiresAt } });
}

export function deleteSessionByTokenHash(tokenHash: string) {
  // deleteMany (not delete): no-throw if the row is already gone (double-logout race safety)
  return prisma.session.deleteMany({ where: { tokenHash } });
}
