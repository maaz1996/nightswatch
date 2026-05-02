// Simplified generator snippet
export const generateToken = async (payload: object, privateKey: CryptoKey, options: { kid: string }) => {
  const header = btoa(JSON.stringify({ alg: 'RS256', kid: options.kid })).replace(/=/g, '');
  const body = btoa(JSON.stringify(payload)).replace(/=/g, '');
  const data = new TextEncoder().encode(`${header}.${body}`);

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    data
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return `${header}.${body}.${sigB64}`;
};