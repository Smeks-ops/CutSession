import * as fs from 'fs';
import { createHash, timingSafeEqual } from 'crypto';
import { Response, NextFunction } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../helpers/auth.helper';
import { UserRepository } from '../components/user/user.repository';

import { IRequest } from '../../services/auth/auth.types';
import { Middleware } from 'express-validator/src/base';
import { userInfo } from 'os';
import { bind } from 'decko';

export class TokenMiddleware {
	private readonly repo: UserRepository = new UserRepository();

	@bind
	async use(req: IRequest, res: Response, next: NextFunction) {
		const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

		const { decoded, expired } = verifyJwt(accessToken, process.env.JWT_SECRET);

		if (!accessToken || decoded === null) return res.status(401).json({ message: 'Invalid auth credentials' });

		if (decoded && expired === true) return res.status(401).json({ message: 'Token expired' });

		const user = await this.repo.readByEmail(decoded.email);

		if (!user) return res.status(404).json({ message: 'User not found' });

		req.user = user;

		return next();
	}
}
