import { decodeBase64Url, importJWK } from "./utils.js";

export const createVerifier = (
  jwksUri: string,
  options: { issuer: string; audience: string },
) => {
  let jwksCache: any = null;

  return async (token: string) => {
    const [headerB64, payloadB64, signatureB64] = token.split(".");

    // 1. Fetch JWKS if not cached
    if (!jwksCache) {
      const res = await fetch(jwksUri);
      jwksCache = await res.json();
    }

    // 2. Decode header to find 'kid'
    const header = JSON.parse(
      atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")),
    );
    const jwk = jwksCache.keys.find((k: any) => k.kid === header.kid);
    if (!jwk) throw new Error("Key ID not found");

    // 3. Verify Signature
    const publicKey = await importJWK(jwk);
    const isValid = await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      publicKey,
      decodeBase64Url(signatureB64) as Uint8Array<ArrayBuffer>, // Cast the signature
      new TextEncoder().encode(
        `${headerB64}.${payloadB64}`,
      ) as Uint8Array<ArrayBuffer>, // Cast the data
    );

    if (!isValid) throw new Error("Invalid signature");

    // 4. Manual Claim Validation
    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (payload.iss !== options.issuer) throw new Error("Invalid issuer");
    if (payload.exp < Date.now() / 1000) throw new Error("Token expired");

    return { payload };
  };
};
