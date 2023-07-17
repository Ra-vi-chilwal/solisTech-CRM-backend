const { addRole, getRole } = require("./controller");
// const { checkToken} = require('../s');
const RoleRouter = require("express").Router();
RoleRouter.post("/add", addRole);
RoleRouter.post("/get", getRole);
module.exports = RoleRouter;