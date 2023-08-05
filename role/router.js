const { addRole, getRole } = require("./controller");
const { checkToken} = require('../middleware');
const RoleRouter = require("express").Router();
RoleRouter.post("/add",checkToken, addRole);
RoleRouter.get("/get",checkToken, getRole);
module.exports = RoleRouter;