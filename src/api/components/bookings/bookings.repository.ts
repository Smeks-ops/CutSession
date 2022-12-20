import { pool } from '../../../config/db';
import Logger from '../../../config/logger';

import { IBookings, CreateBookingDTO } from './bookings.dto';

export class BookingsRepository {
	readAll(): Promise<IBookings[]> {
		return new Promise((resolve, reject) => {
			pool.query<IBookings>('SELECT * FROM bookings', (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch users!');
				} else resolve(res.rows);
			});
		});
	}

	readAllByCity(city: string): Promise<IBookings[]> {
		return new Promise((resolve, reject) => {
			pool.query<IBookings>(
				'SELECT * FROM bookings INNER JOIN sessions ON sessions.id = bookings.session_id INNER JOIN merchants ON merchants.id = sessions.merchant_id AND merchants.cityofoperation = $1',
				[city],
				(err, res) => {
					if (err) {
						Logger.error(err.message);
						reject('Failed to fetch bookings!');
					} else resolve(res.rows);
				}
			);
		});
	}

	readAllByMerchantID(merchantId: string): Promise<IBookings[]> {
		return new Promise((resolve, reject) => {
			pool.query<IBookings>('SELECT * FROM bookings WHERE session_id = $1', [merchantId], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch bookings!');
				} else resolve(res.rows);
			});
		});
	}

	readBySessionId(sessionId: number): Promise<IBookings> {
		return new Promise((resolve, reject) => {
			pool.query<IBookings>('SELECT * FROM bookings WHERE session_id = $1', [sessionId], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch bookings!');
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	readByID(bookingId: string): Promise<IBookings> {
		return new Promise((resolve, reject) => {
			pool.query<IBookings>('SELECT * FROM bookings WHERE id = $1', [bookingId], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch session!');
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	readByEmail(email: string): Promise<IBookings> {
		return new Promise((resolve, reject) => {
			pool.query<IBookings>('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch user!');
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	create(booking: CreateBookingDTO, user_id, bookingRef, startsat, endsat): Promise<IBookings> {
		return new Promise((resolve, reject) => {
			pool.query(
				'INSERT INTO bookings (user_id, date, notes, session_id, title, bookingRef, startsat, endsat ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
				[user_id, booking.date, booking.notes, booking.sessionId, booking.title, bookingRef, startsat, endsat],
				(err, res) => {
					if (err) {
						Logger.error(err.message);
						reject('Failed to create booking!');
					} else resolve(res.rowCount ? res.rows[0] : undefined);
				}
			);
		});
	}

	delete(userID: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			pool.query<IBookings>('DELETE FROM bookings WHERE id = $1', [userID], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to delete booking!');
				} else resolve(res.rowCount > 0);
			});
		});
	}
}
