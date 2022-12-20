import { pool } from '../../../config/db';
import Logger from '../../../config/logger';

import { ISessions, CreateSessionsDTO } from './sessions.dto';

export class SessionRepository {
	readAll(): Promise<ISessions[]> {
		return new Promise((resolve, reject) => {
			pool.query<ISessions>('SELECT * FROM sessions', (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch sessions!');
				} else resolve(res.rows);
			});
		});
	}

	readAllByMerchantID(merchantId: string): Promise<ISessions[]> {
		return new Promise((resolve, reject) => {
			pool.query<ISessions>('SELECT * FROM sessions WHERE merchant_id = $1', [merchantId], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch sessions!');
				} else resolve(res.rows);
			});
		});
	}

	readByID(sessionId: number): Promise<ISessions> {
		return new Promise((resolve, reject) => {
			pool.query<ISessions>('SELECT * FROM sessions WHERE id = $1', [sessionId], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch session!');
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	create(session: CreateSessionsDTO, merchant_id): Promise<ISessions> {
		return new Promise((resolve, reject) => {
			pool.query(
				'INSERT INTO sessions (merchant_id, startsAt, endsAt, type ) VALUES($1, $2, $3, $4) RETURNING *',
				[merchant_id, session.startsAt, session.endsAt, session.type],
				(err, res) => {
					if (err) {
						Logger.error(err.message);
						reject('Failed to create session!');
					} else resolve(res.rowCount ? res.rows[0] : undefined);
				}
			);
		});
	}

	delete(userID: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			pool.query<ISessions>('DELETE FROM sessions WHERE id = $1', [userID], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to delete sessions!');
				} else resolve(res.rowCount > 0);
			});
		});
	}
}
