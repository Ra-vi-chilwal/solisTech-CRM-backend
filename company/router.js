const { addCompany, getCompany } = require("./controller");
// const { checkToken} = require('../s');
const companyRouter = require("express").Router();
companyRouter.post("/add", addCompany);
companyRouter.get("/get", getCompany);
module.exports = companyRouter;