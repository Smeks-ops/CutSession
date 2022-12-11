import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { MerchantDTO } from './merchant.dto';
import { MerchantRepository } from './merchant.repository';

export class MerchantController {
	private readonly repo: MerchantRepository = new MerchantRepository();

	@bind
	async readMerchants(req: Request, res: Response, next: NextFunction) {
		try {
			const merchants = await this.repo.readAll();
			return res.json(merchants);
		} catch (err) {
			return next(err);
		}
	}

	@bind
	async readMerchant(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			if (isNaN(+id)) return res.sendStatus(400);

			const merchant = await this.repo.readByID(+id);
			if (!merchant) return res.sendStatus(404);

			return res.json(merchant);
		} catch (err) {
			return next(err);
		}
	}

	@bind
	async createMerchant(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = MerchantDTO.fromRequest(req);

			if (dto === undefined || dto.isValid().check === false) {
				return res.status(400).json({ message: dto.isValid().message });
			}

			const existingMerchant = await this.repo.readByEmailOrUsername(dto.email, dto.username);
			if (existingMerchant !== undefined) return res.status(409).json({ message: 'merchant already exists' });

			const merchant = await this.repo.create(dto);

			if (merchant === undefined) {
				return res.status(500).json({ message: 'merchant not created' });
			}

			return res.status(201).json({ merchant, message: 'merchant created successfully' });
		} catch (err) {
			console.log(err);
			return next(err);
		}
	}

	@bind
	async deleteMerchant(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			if (isNaN(+id)) return res.sendStatus(400);

			const merchant = await this.repo.readByID(+id);
			if (!merchant) return res.sendStatus(404);

			await this.repo.delete(+id);

			return res.sendStatus(204);
		} catch (err) {
			return next(err);
		}
	}
}
