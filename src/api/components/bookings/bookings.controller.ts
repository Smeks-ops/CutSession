import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { CreateBookingDTO } from './bookings.dto';
import { BookingsRepository } from './bookings.repository';
import { MerchantRepository } from '../merchants/merchant.repository';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../user/user.repository';
import { IRequest } from '../../../services/auth/auth.types';
import { SessionRepository } from '../sessions/sessions.repository';

export class BookingController {
	private readonly repo: BookingsRepository = new BookingsRepository();
	private readonly merchantRepo: MerchantRepository = new MerchantRepository();
	private readonly userRepo: UserRepository = new UserRepository();
	private readonly sessionRepo: SessionRepository = new SessionRepository();

	@bind
	async readBookings(req: IRequest, res: Response, next: NextFunction) {
		try {
			

			const bookings = await this.repo.readAll();
			return res.json(bookings);
		} catch (err) {
			return next(err);
		}
	}

	@bind
	async createBooking(req: IRequest, res: Response, next: NextFunction) {
		try {
			const dto = CreateBookingDTO.fromRequest(req);

			if (!dto) return res.status(400).json({ message: 'Invalid request' });

			const session = await this.sessionRepo.readByID(dto.sessionId);
			if (!session) return res.status(404).json({ message: 'Session not found' });

			const bookingExists = await this.repo.readBySessionId(dto.sessionId);
			if (bookingExists && bookingExists.date === dto.date)
				return res.status(400).json({ message: 'Session already booked, kindly book another session' });

			let result = ' ';
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			const charactersLength = characters.length;
			for (let i = 0; i < 6; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			const bookingRef = result;

			const booking = await this.repo.create(dto, req.user.id, bookingRef, session.startsat, session.endsat);

			return res.status(201).json({ booking, message: 'booking created successfully' });
		} catch (err) {
			console.log(err);
			return next(err);
		}
	}

	/* @bind
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
	} */
}
