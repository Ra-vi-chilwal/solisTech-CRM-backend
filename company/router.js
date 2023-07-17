const { addCompany, getCompany } = require("./controller");
// const { checkToken} = require('../s');
const companyRouter = require("express").Router();
companyRouter.post("/add", addCompany);
companyRouter.post("/get", getCompany);
module.exports = companyRouter;