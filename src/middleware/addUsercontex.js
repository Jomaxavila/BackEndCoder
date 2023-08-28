
function addUserToContext(req, res, next) {
	res.locals.user = req.session.user;
	next();
  }
  
  export default addUserToContext;
  