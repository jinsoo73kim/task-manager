import "server-only";
import crypto from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/password";
import { findUserByUsername } from "@/repositories/user.repository";
import {
  createSession,
  deleteSessionByTokenHash,
  extendSession,
  findSessionWithUserByTokenHash,
} from "@/repositories/session.repository";

// Must match the literal in proxy.ts — kept duplicated there on purpose so
// proxy.ts never imports this module (which pulls in Prisma/bcrypt/next-headers).
const SESSION_COOKIE_NAME = "session_token";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h — the DB-side sliding TTL, the real authority
const COOKIE_CEILING_MS = 30 * 24 * 60 * 60 * 1000; // 30d — cookie's own outer bound

export type AuthenticatedUser = {
  id: string;
  username: string;
  displayName: string;
  role: "admin" | "member";
  mustChangePassword: boolean;
};

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function login(
  username: string,
  password: string
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await findUserByUsername(username);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { success: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await createSession({ userId: user.id, tokenHash: hashToken(token), expiresAt });

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_CEILING_MS / 1000,
  });

  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSessionByTokenHash(hashToken(token));
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Read-only from a cookie standpoint (never calls cookies().set()/.delete()),
// so this is safe to call from Server Components, not just Server Actions.
export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await findSessionWithUserByTokenHash(hashToken(token));
  if (!session || session.expiresAt.getTime() < Date.now()) return null;

  // Sliding extension: every authenticated access pushes expiry 24h further out.
  await extendSession(session.id, new Date(Date.now() + SESSION_TTL_MS));

  const { user } = session;
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role as "admin" | "member",
    mustChangePassword: user.mustChangePassword,
  };
});

// The authoritative gate. Every protected Server Component/Server Action must call this.
export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
