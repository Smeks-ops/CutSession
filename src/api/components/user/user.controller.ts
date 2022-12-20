import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UserDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { MerchantRepository } from '../merchants/merchant.repository';
import bcrypt from 'bcryptjs';
import { IRequest } from '../../../services/auth/auth.types';

export class UserController {
	private readonly repo: UserRepository = new UserRepository();
	private readonly merchantRepo: MerchantRepository = new MerchantRepository();

	@bind
	async getClients(req: IRequest, res: Response, next: NextFunction) {
		try {
			const { type, limit, offset } = req.query;
			if (type === 'MERCHANT') {
				const merchants = await this.merchantRepo.paginatedReadAll(limit, offset);
				if (!merchants) return res.status(404).json({ message: 'Merchants not found' });
				return res.status(200).json({ data: merchants, message: 'Merchants fetched successfully' });
			}
			const users = await this.repo.paginatedReadAll(limit, offset);
			if (!users) return res.status(404).json({ message: 'Users not found' });
			return res.status(200).json({ data: users, message: 'Users fetched successfully' });
		} catch (err) {
			return next(err);
		}
	}

	@bind
	async readUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			if (isNaN(+id)) return res.sendStatus(400);

			const user = await this.repo.readByID(+id);
			if (!user) return res.sendStatus(404);

			return res.json(user);
		} catch (err) {
			return next(err);
		}
	}

	@bind
	async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = UserDTO.fromRequest(req);

			if (dto === undefined || dto.isValid().check === false) {
				return res.status(400).json({ message: dto.isValid().message });
			}

			const existingUser = await this.repo.readByEmailOrUsername(dto.email, dto.username);
			if (existingUser !== undefined) return res.status(409).json({ message: 'User already exists' });

			const user = await this.repo.create(dto);

			return res.status(201).json({ user, message: 'User created successfully' });
		} catch (err) {
			console.log(err);
			return next(err);
		}
	}

	@bind
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password, accessType } = req.body;

			if (accessType === undefined) return res.status(400).json({ message: 'Access type required' });

			if (accessType === 'USER') {
				if (username === undefined || password === undefined) {
					return res.status(400).json({ message: 'Username and password required' });
				}

				const user = await this.repo.readByUsername(username);
				if (!user) return res.status(404).json({ message: 'User not found' });

				const isMatch = await bcrypt.compare(req.body.password, user.password);
				if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

				const token = await this.repo.signJWT(user.email, JSON.stringify(user.id));

				return res.status(200).json({ user, token });
			} else if (accessType === 'MERCHANT') {
				if (username === undefined || password === undefined) {
					return res.status(400).json({ message: 'Username and password required' });
				}

				const merchant = await this.merchantRepo.readByUsername(username);
				if (!merchant) return res.status(404).json({ message: 'User not found' });

				const isMatch = await bcrypt.compare(req.body.password, merchant.password);
				if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

				const token = await this.merchantRepo.signJWT(merchant.email, JSON.stringify(merchant.id));

				return res.status(200).json({ merchant, token });
			}
		} catch (err) {
			console.log(err);
			return next(err);
		}
	}

	@bind
	async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			if (isNaN(+id)) return res.sendStatus(400);

			const user = await this.repo.readByID(+id);
			if (!user) return res.sendStatus(404);

			await this.repo.delete(+id);

			return res.sendStatus(204);
		} catch (err) {
			return next(err);
		}
	}
}
