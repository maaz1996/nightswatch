// Helper: Convert Base64URL to Uint8Array
export const decodeBase64Url = (base64url: string): Uint8Array => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const bin = atob(base64 + '='.repeat(padLen));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

// Helper: Convert JWK to CryptoKey
export const importJWK = async (jwk: JsonWebKey): Promise<CryptoKey> => {
  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
};

export const isJWK = (key: any): boolean => {
  return typeof key === 'object' && key !== null && 'kty' in key;
};