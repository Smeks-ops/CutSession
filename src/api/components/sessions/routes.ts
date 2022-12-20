import { Router } from 'express';

import { SessionController } from './sessions.controller';
import { TokenMiddleware } from '../../middleware/auth.middleware';

export class SessionRoutes {
	private readonly controller: SessionController = new SessionController();
	readonly router: Router = Router();
	tokenMiddleware: TokenMiddleware = new TokenMiddleware();

	constructor() {
		this.initRoutes();
	}

	private initRoutes(): void {
		this.router.post('/', this.tokenMiddleware.use, this.controller.createSession);
		this.router.get('/:merchantId', this.tokenMiddleware.use,this.controller.readSessions);
	}
}
