import { Router } from 'express';

import { BookingController } from './bookings.controller';
import { TokenMiddleware } from '../../middleware/auth.middleware';

export class BookingRoutes {
	private readonly controller: BookingController = new BookingController();
	readonly router: Router = Router();
	tokenMiddleware: TokenMiddleware = new TokenMiddleware();

	constructor() {
		this.initRoutes();
	}

	private initRoutes(): void {
		this.router.post('/', this.tokenMiddleware.use, this.controller.createBooking);
	}
}
