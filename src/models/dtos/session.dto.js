export class SessionResponseDTO {
	constructor(sessionData) {
	  const sessionObject = JSON.parse(sessionData.session);
	  const user = sessionObject.user || {};
	  this.first_name = user.name ? user.name.split(" ")[0] : null;
	  this.last_name = user.name ? user.name.split(" ")[1] : null;
	  this.email = user.email;
	  this.expires = sessionData.expires;
	  const expiresDate = new Date(this.expires);
	  // Sumar 3 horas porque estamos en argentina
	  expiresDate.setTime(expiresDate.getTime() + 3 * 60 * 60 * 1000);
	  this.expires = expiresDate.toISOString();
	}
  }