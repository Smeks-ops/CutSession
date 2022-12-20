import * as jwt from 'jsonwebtoken';



export function verifyJwt(token: string, hashKey: string) {
  
    try {
      const decoded: any = jwt.verify(token, hashKey);
  
      return { valid: true, expired: false, decoded };
    } catch (error: any) {
      return { valid: false, expired: true, decoded: null };
    }
  }