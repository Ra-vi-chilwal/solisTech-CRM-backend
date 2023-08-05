const { addCompany, getCompany } = require("./controller");
const { checkToken} = require('../middleware');
const companyRouter = require("express").Router();
companyRouter.post("/add",checkToken, addCompany);
companyRouter.get("/get",checkToken, getCompany);
module.exports = companyRouter;