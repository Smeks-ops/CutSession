import * as jwt from 'jsonwebtoken';



export function verifyJwt(token: string, hashKey: string) {
    // const publicKey = Buffer.from(keys[keyName], 'base64').toString('ascii');
  
    try {
      const decoded: any = jwt.verify(token, hashKey);
  
      return { valid: true, expired: false, decoded };
    } catch (error: any) {
      return { valid: false, expired: true, decoded: null };
    }
  }