import { Request } from 'express';
import { UtilityService } from '../../../services/utility';

export interface IUser {
	id: number;
	name: string;
	dob: string;
	email: string;
	cityOfResidence: string;
	username: string;
	password: string;
	phoneNumber: string;
	metadata: object;
	role: string;
	createdAt: Date;
}

export class UserDTO {
	name: string;
	dob: string;
	email: string;
	cityOfResidence: string;
	username: string;
	password: string;
	phoneNumber: string;

	constructor(name: string, dob: string, email: string, cityOfResidence: string, username: string, password: string, phoneNumber: string) {
		this.email = email;
		this.username = username;
		this.password = password;
		this.name = name;
		this.dob = dob;
		this.cityOfResidence = cityOfResidence;
		this.phoneNumber = phoneNumber;
	}

	static fromRequest(req: Request) {
		if (!UtilityService.hasProperties(req, ['name', 'dob', 'email', 'cityOfResidence', 'username', 'password', 'phoneNumber'])) return undefined;
		return new UserDTO(req.body.name, req.body.dob, req.body.email, req.body.cityOfResidence, req.body.username, req.body.password, req.body.phoneNumber);
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