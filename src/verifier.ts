import { createRemoteJWKSet, jwtVerify, type JWTVerifyResult } from 'jose';

export interface VerifyOptions {
  issuer: string;
  audience: string;
  algorithms?: string[];
  clockTolerance?: string | number; // Handles slight time drift between servers
}

/**
 * Returns a validation function that maintains an internal JWKS cache.
 */
export function createVerifier(jwksUri: string, defaults: VerifyOptions) {
  // RemoteJWKSet automatically handles caching and rotation based on 'kid'
  const JWKS = createRemoteJWKSet(new URL(jwksUri));

  return async (token: string, overrideOptions?: Partial<VerifyOptions>): Promise<JWTVerifyResult> => {
    const options = { ...defaults, ...overrideOptions };

    return await jwtVerify(token, JWKS, {
      issuer: options.issuer,
      audience: options.audience,
      algorithms: options.algorithms || ['RS256'],
      clockTolerance: options.clockTolerance || '5s' 
    });
  };
}