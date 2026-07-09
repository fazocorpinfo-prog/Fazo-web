import { jwtVerify, SignJWT } from "jose";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export const SESSION_COOKIE = "fazo_admin";

export type SessionPayload = { sub: string; role: string };

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return { sub: String(payload.sub), role: String(payload.role) };
  } catch {
    return null;
  }
}
