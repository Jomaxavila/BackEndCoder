export default class CustomError {
	constructor({ name = "Error", cause, message, code = 1 }) {
	  const error = new Error(message);
	  error.name = name;
	  error.code = code;
	  this.error = error;
	  this.cause = cause;
	}
  
	get name() {
	  return this.error.name;
	}
  
	get code() {
	  return this.error.code;
	}
  
	get message() {
	  return this.error.message;
	}
  }
  