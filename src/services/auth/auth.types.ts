import { Request } from 'express';
import { IUser } from '../../api/components/user/user.dto';


export interface IRequest extends Request {
  user: IUser;
  query: any;
}
