import { SignJWT, type JWTPayload } from 'jose';
import { importKey } from './utils';

export interface SignOptions {
  issuer: string;
  audience: string;
  expiration: string | number;
  kid: string;
  alg?: string;
}

/**
 * Functional generator to sign a custom JWT.
 */
export async function generateToken(
  payload: JWTPayload,
  privateKey: string | object,
  options: SignOptions
): Promise<string> {
  const alg = options.alg || 'RS256';
  const key = await importKey(privateKey, alg, true);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg, kid: options.kid })
    .setIssuedAt()
    .setIssuer(options.issuer)
    .setAudience(options.audience)
    .setExpirationTime(options.expiration)
    .sign(key);
}