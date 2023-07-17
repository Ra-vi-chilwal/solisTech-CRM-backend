const { register, login } = require("./controller");
// const { checkToken} = require('../s');
const AuthRouter = require("express").Router();
AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
// AuthRouter.get("/get", getuser);
// AuthRouter.delete("/delete/:id", DeleteUser);

// AuthRouter.put("/edit/:id", EditUser);8
//AuthRouter.post("/changepassword",checkToken, changePassword);
module.exports = AuthRouter;