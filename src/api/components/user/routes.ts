import { Router } from 'express';

import { UserController } from './user.controller';
import { TokenMiddleware } from '../../middleware/auth.middleware';

export class UserRoutes {
	private readonly controller: UserController = new UserController();
	readonly router: Router = Router();
	tokenMiddleware: TokenMiddleware = new TokenMiddleware();

	constructor() {
		this.initRoutes();
	}

	private initRoutes(): void {
		this.router.post('/', this.controller.createUser);
		this.router.route('/:id').get(this.controller.readUser).delete(this.controller.deleteUser);
		this.router.route('/sign-in').post(this.controller.login);
		this.router.get('/', this.tokenMiddleware.use, this.controller.getClients);

	}
}
