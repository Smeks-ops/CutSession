import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UserDTO } from './user.dto';
import { UserRepository } from './user.repository';

export class UserController {
	private readonly repo: UserRepository = new UserRepository();

	@bind
	async readUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await this.repo.readAll();
			return res.json(users);
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
			if (existingUser !== undefined)
				return res.status(409).json({ message: 'User already exists' });

			const user = await this.repo.create(dto);

			return res.status(201).json(user);
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
