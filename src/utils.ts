import { importJWK, importPKCS8 } from 'jose';

// Define the type locally if the export is being stubborn, 
// or simply use 'any' for the utility return type since jose 
// handles the internal typing.
export type KeyInput = string | object;

export const isJWK = (key: any): boolean => 
  typeof key === 'object' && key.kty !== undefined;

/**
 * Imports a string (PEM/PKCS8) or JWK into a format used for crypto operations.
 */
export async function importKey(key: KeyInput, alg: string, isPrivate: boolean): Promise<any> {
  if (isJWK(key)) {
    return await importJWK(key as any, alg);
  }
  
  if (typeof key === 'string') {
    const cleanKey = key.replace(/\\n/g, '\n');
    return isPrivate 
      ? await importPKCS8(cleanKey, alg) 
      : await importPKCS8(cleanKey, alg); 
  }
  
  throw new Error('Nightswatch: Invalid key format. Provide a PEM string or JWK.');
}