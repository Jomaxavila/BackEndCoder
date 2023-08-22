

const SECRET_KEY = "top_secret_07"

const auth = (role)=>{
	return async(req, res, next)=>{
		if(!req.user){
			return res.status(401).json({error:"No authenticated"})
		}
		if(req.user.role !==role){
			return res.status(403).json({error:"Access Denied"})
		}
		next();
	}
}

export default auth;