import { pool } from '../../../config/db';
import Logger from '../../../config/logger';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { IMerchant, MerchantDTO } from './merchant.dto';

export class MerchantRepository {
	readAll(): Promise<IMerchant[]> {
		return new Promise((resolve, reject) => {
			pool.query<IMerchant>('SELECT * FROM merchants', (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch merchants!');
				} else resolve(res.rows);
			});
		});
	}

	readByID(merchantID: number): Promise<IMerchant> {
		return new Promise((resolve, reject) => {
			pool.query<IMerchant>('SELECT * FROM merchants WHERE id = $1', [merchantID], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch user!');
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	readByEmailOrUsername(email: string, username: string): Promise<IMerchant> {
		return new Promise((resolve, reject) => {
			pool.query<IMerchant>('SELECT * FROM merchants WHERE email = $1 OR username = $2', [email, username], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch user!');
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	readByUsername(username: string): Promise<IMerchant> {
		return new Promise((resolve, reject) => {
			pool.query<IMerchant>('SELECT * FROM merchants WHERE username = $1', [username], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch user!');
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	readByEmail(email: string): Promise<IMerchant> {
		return new Promise((resolve, reject) => {
			pool.query<IMerchant>('SELECT * FROM merchants WHERE email = $1', [email], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to fetch user!');
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	signJWT(email: string, merchantId: string): Promise<string> {
		return new Promise((resolve, reject) => {
			jwt.sign({ id: merchantId, email: email, role: "MERCHANT" }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to sign JWT!');
				} else resolve(token);
			});
		});
	}

	create(merchant: MerchantDTO): Promise<IMerchant> {
		return new Promise((resolve, reject) => {
			const salt = bcrypt.genSaltSync(10);
			const hashedPassword = bcrypt.hashSync(merchant.password, salt);
			pool.query(
				'INSERT INTO merchants (email, username, name, cityOfOperation, password, phoneNumber ) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
				[merchant.email, merchant.username, merchant.name, merchant.cityOfOperation, hashedPassword, merchant.phoneNumber],
				(err, res) => {
					if (err) {
						Logger.error(err.message);
						reject('Failed to create merchant!');
					} else resolve(res.rowCount ? res.rows[0] : undefined);
				}
			);
		});
	}

	delete(merchantId: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			pool.query<IMerchant>('DELETE FROM merchants WHERE id = $1', [merchantId], (err, res) => {
				if (err) {
					Logger.error(err.message);
					reject('Failed to delete merchant!');
				} else resolve(res.rowCount > 0);
			});
		});
	}
}
