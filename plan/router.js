const Router = require('express').Router();
const { checkToken } = require('../middleware');
const { getPlan, addPlan } = require('./controller');
Router.get("/get",checkToken, getPlan);
Router.post("/add",checkToken, addPlan);
module.exports = Router;