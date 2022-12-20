import { Response, NextFunction } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../helpers/auth.helper';
import { UserRepository } from '../components/user/user.repository';

import { IRequest } from '../../services/auth/auth.types';
import { bind } from 'decko';
import { MerchantRepository } from '../components/merchants/merchant.repository';

export class TokenMiddleware {
	private readonly repo: UserRepository = new UserRepository();
	private readonly merchantRepo: MerchantRepository = new MerchantRepository();

	@bind
	async use(req: IRequest, res: Response, next: NextFunction) {
		const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

		const { decoded, expired } = verifyJwt(accessToken, process.env.JWT_SECRET);

		if (!accessToken || decoded === null) return res.status(401).json({ message: 'Invalid auth credentials' });

		if (decoded && expired === true) return res.status(401).json({ message: 'Token expired' });

		if (decoded.role === 'MERCHANT') {
			const merchant = await this.merchantRepo.readByEmail(decoded.email);

			if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

			req.user = merchant;
			return next();
		}

		const user = await this.repo.readByEmail(decoded.email);

		if (!user) return res.status(404).json({ message: 'User not found' });

		req.user = user;

		return next();
	}
}
