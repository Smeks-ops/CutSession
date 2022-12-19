import { Request } from 'express';
import { IUser } from '../../api/components/user/user.dto';
import { IMerchant } from '../../api/components/merchants/merchant.dto';


export interface IRequest extends Request {
  user: IUser | IMerchant;
  query: any;
}
