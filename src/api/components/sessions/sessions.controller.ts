import { bind } from 'decko';
import { NextFunction, Response } from 'express';

import { CreateSessionsDTO } from './sessions.dto';
import { SessionRepository } from './sessions.repository';
import { MerchantRepository } from '../merchants/merchant.repository';
import { IRequest } from '../../../services/auth/auth.types';

export class SessionController {
	private readonly repo: SessionRepository = new SessionRepository();
	private readonly merchantRepo: MerchantRepository = new MerchantRepository();

	@bind
	async readSessions(req: IRequest, res: Response, next: NextFunction) {
		try {
			const { merchantId } = req.params;
			const sessions = await this.repo.readAllByMerchantID(merchantId);
			return res.status(200).json({ message: 'Sessions fetched successfully', sessions });
		} catch (err) {
			return next(err);
		}
	}

	@bind
	async createSession(req: IRequest, res: Response, next: NextFunction) {
		try {
			if (req.user.role !== 'merchant') return res.status(400).json({ message: 'Invalid request' });
			const dto = CreateSessionsDTO.fromRequest(req);

			if (!dto) return res.status(400).json({ message: 'Invalid request' });

			const merchant = await this.merchantRepo.readByID(req.user.id);
			if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
			const merchantId = JSON.stringify(merchant.id);

			if (dto.type === 'WeekDay') {
				const begin = 9;
				const end = 20;
				const startTime = parseInt(dto.startsAt.split(':')[0]);
				const endTime = parseInt(dto.endsAt.split(':')[0]);

				if (startTime < begin || endTime > end || startTime >= endTime) {
					return res.status(400).json({ message: 'Invalid time slot' });
				}

				const timeParts = dto.startsAt.split(':');
				const endTimeParts = dto.endsAt.split(':');
				const startTimeInMinutes = Number(timeParts[0]) * 60 + Number(timeParts[1]);
				const endTimeInMinutes = Number(endTimeParts[0]) * 60 + Number(endTimeParts[1]);

				const timeSlot = endTimeInMinutes - startTimeInMinutes;

				if (timeSlot === 45 || timeSlot === 60 || timeSlot === 90) {
					const existingSession = await this.repo.readAllByMerchantID(merchantId);
					if (existingSession.length > 0) {
						for (const value of existingSession) {
							if (
								(value.type === 'WeekDay' && value.startsat === dto.startsAt) ||
								(value.endsat === dto.endsAt && value.type === 'WeekDay')
							) {
								return res
									.status(400)
									.json({ message: 'Time slot unavailable, kindly pick another time slot for your session' });
							}
						}
					}
				} else {
					return res.status(400).json({ message: 'Time slots can only be of 45, 60 or 90 minutes' });
				}
			}

			if (dto.type === 'Weekend') {
				const begin = 10;
				const end = 22;
				const startTime = parseInt(dto.startsAt.split(':')[0]);
				const endTime = parseInt(dto.endsAt.split(':')[0]);

				if (startTime < begin || endTime > end || startTime >= endTime) {
					return res.status(400).json({ message: 'Invalid time slot' });
				}
				const timeParts = dto.startsAt.split(':');
				const endTimeParts = dto.endsAt.split(':');
				const startTimeInMinutes = Number(timeParts[0]) * 60 + Number(timeParts[1]);
				const endTimeInMinutes = Number(endTimeParts[0]) * 60 + Number(endTimeParts[1]);

				const timeSlot = endTimeInMinutes - startTimeInMinutes;

				if (timeSlot === 45 || timeSlot === 60 || timeSlot === 90) {
					const existingSession = await this.repo.readAllByMerchantID(merchantId);
					for (const value of existingSession) {
						if (
							(value.type === 'Weekend' && value.startsat === dto.startsAt) ||
							(value.endsat === dto.endsAt && value.type === 'Weekend')
						) {
							return res
								.status(400)
								.json({ message: 'Time slot unavailable, kindly pick another time slot for your session' });
						}
					}
				} else {
					return res.status(400).json({ message: 'Time slots can only be of 45, 60 or 90 minutes' });
				}
			}
			const session = await this.repo.create(dto, merchant.id);

			return res.status(201).json({ session, message: 'session created successfully' });
		} catch (err) {
			console.log(err);
			return next(err);
		}
	}
}
