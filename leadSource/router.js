const Router = require('express').Router();
const {checkToken} = require("../middleware");
const {getCustomLeads,addCustomLeads,updateStatus,getLeadHistroy} = require('./controller')
const leadRouter = require("express").Router();
// leadRouter.post('/buttonClick/add',checkToken,sourceLighting);
leadRouter.post('/add',checkToken,addCustomLeads);
 leadRouter.get('/get',checkToken,getCustomLeads);
 leadRouter.get('/get-lead-history/:id',checkToken,getLeadHistroy);
 leadRouter.post('/update/:id',checkToken,updateStatus);
module.exports = leadRouter;