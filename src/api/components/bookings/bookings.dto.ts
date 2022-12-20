import { Request } from 'express';
import { UtilityService } from '../../../services/utility';

export interface IBookings {
	id: number;
	bookingRef: string;
	startsat: string;
	endsat: string;
	sessionId: number;
	date: string;
	userId: number;
	notes: string;
	title: string;
}

export class CreateBookingDTO {
	sessionId: number;
	date: string;
	notes: string;
	title: string;

	constructor(sessionId: number, date: string, notes: string, title: string) {
		this.sessionId = sessionId;
		this.date = date;
		this.notes = notes;
		this.title = title;
	}

	static fromRequest(req: Request) {
		if (!UtilityService.hasProperties(req, ['sessionId', 'date', 'notes', 'title'])) return undefined;
		return new CreateBookingDTO(req.body.sessionId, req.body.date, req.body.notes, req.body.title);
	}
}
