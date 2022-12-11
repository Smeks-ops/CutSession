import { pool } from '../../../config/db';
import Logger from '../../../config/logger';
import bcrypt from 'bcryptjs';

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