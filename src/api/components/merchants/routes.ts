import { Router } from 'express';

import { MerchantController } from './merchant.controller';

export class MerchantRoutes {
	private readonly controller: MerchantController = new MerchantController();
	readonly router: Router = Router();

	constructor() {
		this.initRoutes();
	}

	private initRoutes(): void {
		this.router.route('/').get(this.controller.readMerchants).post(this.controller.createMerchant);
		this.router.route('/:id').get(this.controller.readMerchant).delete(this.controller.deleteMerchant);
	}
}
