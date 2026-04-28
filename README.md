Here is the entire, raw `README.md` content in a single block. You can copy everything below this line and paste it directly into your file.

```markdown
# nightswatch 🛡️

A lightweight, functional, and environment-agnostic library for JWT generation and JWKS-based verification. Built on top of `jose`, designed for Node.js, Edge Functions, and the browser.

## Features
* **Purely Functional:** No classes, no side-effects, just predictable functions.
* **JWKS Support:** Automatic public key fetching, caching, and rotation.
* **Security First:** Defaults to `RS256` and includes clock-drift tolerance.
* **Universal:** Works seamlessly in Node.js, Cloudflare Workers, Vercel Edge, and Browsers.

---

## Installation

```bash
npm install @maaz4/nightswatch
```

---

## Core Functions & Usage

### 1. `generateToken`
Generates a signed JWT. This function automatically embeds the `kid` (Key ID) into the header, which is a mandatory requirement for the verifier to resolve keys from a JWKS set.

```typescript
import { generateToken } from '@maaz4/nightswatch';

const payload = { 
  user_id: 'user_01', 
  permissions: ['read:users'] 
};

// Use a PEM string or a JWK object
const privateKey = process.env.PRIVATE_KEY; 

const token = await generateToken(payload, privateKey, {
  issuer: 'nightswatch-auth',
  audience: 'api-gateway',
  expiration: '1h',
  kid: 'key-2026-v1', // Important: This must match a 'kid' in your JWKS
  alg: 'RS256'
});
```

### 2. `createVerifier`
This is a higher-order function that returns a stateless verifier. It manages an internal cache for JWKS public keys and handles rotation logic invisibly.

```typescript
import { createVerifier } from '@maaz4/nightswatch';

// Initialize once at the start of your application
const verify = createVerifier('[https://your-domain.com/.well-known/jwks.json](https://your-domain.com/.well-known/jwks.json)', {
  issuer: 'nightswatch-auth',
  audience: 'api-gateway'
});

// Example: Use in an API request
try {
  const { payload } = await verify(incomingToken);
  console.log('Authorized Access:', payload.user_id);
} catch (err) {
  console.error('Security Check Failed:', err.message);
}
```

### 3. `isJWK`
A helper utility to determine if a key is a JSON Web Key (JWK) object or a standard PEM string.

---

## API Reference

### `generateToken(payload, privateKey, options)`
| Option | Type | Description |
| :--- | :--- | :--- |
| `payload` | `object` | Custom claims to include in the token. |
| `privateKey` | `string \| object` | The private key (PEM or JWK). |
| `options.kid` | `string` | The Key ID to be placed in the header. |
| `options.expiration` | `string \| number` | Expiration (e.g., '2h', '7d'). |
| `options.alg` | `string` | Default is `RS256`. |

### `createVerifier(jwksUri, defaults)`
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `jwksUri` | `string` | Public URL for your JWKS endpoint. |
| `defaults.issuer` | `string` | The 'iss' claim that must be present. |
| `defaults.audience` | `string` | The 'aud' claim that must be present. |
| `defaults.clockTolerance` | `string \| number` | Grace period for time drift (default: '5s'). |

---

## Security: Key Rotation Logic
**nightswatch** ensures high availability during security events:
1. **Lazy Fetch:** Public keys are only fetched on the first request.
2. **Internal Cache:** Keys are cached in-memory for speed.
3. **On-Demand Rotation:** If a token arrives with a `kid` that isn't in the cache, the library immediately refreshes the JWKS from your URI to check for newly rotated keys before rejecting the token.

---

## License
MIT
```