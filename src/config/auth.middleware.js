const auth = (role) => {
  return (req, res, next) => {
    if (role.includes("PUBLIC")) {
      return next();
    }
    
    if (!req.user) {
      return res.status(401).send({ status: "error", error: "No autenticado" });
    }

    if (!role.includes(req.user.role.toUpperCase())) {
      return res.status(403).send({ status: "error", error: "Acceso prohibido" });
    }
    next();
  };
};

export default auth;