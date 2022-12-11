import { Request } from 'express';
import { UtilityService } from '../../../services/utility';

export interface IMerchant {
	id: number;
	name: string;
	email: string;
	cityOfOperation: string;
	username: string;
	password: string;
	phoneNumber: string;
	metadata: object;
	role: string;
	created_at: Date;
}

export class MerchantDTO {
	name: string;
	email: string;
	cityOfOperation: string;
	username: string;
	password: string;
	phoneNumber: string;

	constructor(name: string, email: string, cityOfOperation: string, username: string, password: string, phoneNumber: string) {
		this.email = email;
		this.username = username;
		this.password = password;
		this.name = name;
		this.cityOfOperation = cityOfOperation;
		this.phoneNumber = phoneNumber;
	}

	static fromRequest(req: Request) {
		if (!UtilityService.hasProperties(req, ['name', 'email', 'cityOfOperation', 'username', 'password', 'phoneNumber'])) return undefined;
		return new MerchantDTO(req.body.name, req.body.email, req.body.cityOfOperation, req.body.username, req.body.password, req.body.phoneNumber);
	}

	isValid() {
		const check = UtilityService.isValidEmail(this.email) && this.username.length > 0;
		if (check === true) {
			return {
				check: true,
				message: 'Valid',
			}
		}
		return {
			check,
			message: 'Invalid email or username',
		}
	}
}