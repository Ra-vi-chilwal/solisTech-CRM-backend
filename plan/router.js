const Router = require('express').Router();
const { checkToken } = require('../middleware');
const { getPlan, addPlan } = require('./controller');
Router.get("/get", getPlan);
Router.post("/add", addPlan);
module.exports = Router;