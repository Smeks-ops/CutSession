import { Request } from 'express';
import { UtilityService } from '../../../services/utility';

export interface ISessions {
	id: number;
	merchantId: number;
	startsat: string;
	endsat: string;
	type: string;
}

export class CreateSessionsDTO {
	startsAt: string;
	endsAt: string;
	type: string;

	constructor(startsAt: string, endsAt: string, type: string) {
		this.startsAt = startsAt;
		this.endsAt = endsAt;
		this.type = type;
	}

	static fromRequest(req: Request) {
		if (!UtilityService.hasProperties(req, ['startsAt', 'endsAt', 'type'])) return undefined;
		return new CreateSessionsDTO(req.body.startsAt, req.body.endsAt, req.body.type);
	}

	/* isValid() {
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
	} */
}
