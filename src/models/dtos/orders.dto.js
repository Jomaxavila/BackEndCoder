export class SaveOrderDTO {
	constructor(payload) {
	  this.userId = payload.userId;
	  this.products = payload.products;
	  
	}
  }
  