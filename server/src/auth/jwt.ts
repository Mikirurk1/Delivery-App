import jwt from 'jsonwebtoken';

type JwtPayload = {
  sub: string;
  role: 'user';
};

export type AuthUser = {
  id: string;
  role: 'user';
};

const JWT_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error('JWT_SECRET env variable is required');
  }
  return secret;
}

export function issueAuthToken(): { token: string; expiresAt: Date } {
  const payload: JwtPayload = {
    sub: `guest_${Date.now()}`,
    role: 'user',
  };

  const token = jwt.sign(payload, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  });

  return {
    token,
    expiresAt: new Date(Date.now() + JWT_EXPIRES_IN_SECONDS * 1000),
  };
}

export function readAuthUserFromAuthorizationHeader(
  authorization: string | undefined,
): AuthUser | null {
  if (!authorization) return null;
  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer' || !token) return null;

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (!decoded || typeof decoded !== 'object') return null;

    const payload = decoded as Partial<JwtPayload>;
    if (typeof payload.sub !== 'string' || payload.role !== 'user') {
      return null;
    }

    return {
      id: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
