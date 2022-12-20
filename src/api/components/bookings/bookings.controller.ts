import { bind } from 'decko';
import { NextFunction, Response } from 'express';
import { CreateBookingDTO } from './bookings.dto';
import { BookingsRepository } from './bookings.repository';
import { IRequest } from '../../../services/auth/auth.types';
import { SessionRepository } from '../sessions/sessions.repository';

export class BookingController {
	private readonly repo: BookingsRepository = new BookingsRepository();
	private readonly sessionRepo: SessionRepository = new SessionRepository();

	@bind
	async readBookingsByCity(req: IRequest, res: Response, next: NextFunction) {
		try {
			const { city } = req.params;
			const bookings = await this.repo.readAllByCity(city);
			return res.status(200).json({ message: 'Bookings fetched successfully', data: bookings });
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

			return res.status(201).json({ data: booking, message: 'booking created successfully' });
		} catch (err) {
			console.log(err);
			return next(err);
		}
	}
}
