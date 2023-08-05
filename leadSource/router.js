const Router = require('express').Router();
const {checkToken} = require("../middleware");
const {getCustomLeads,addCustomLeads,updateStatus} = require('./controller')
const leadRouter = require("express").Router();
// leadRouter.post('/buttonClick/add',checkToken,sourceLighting);
leadRouter.post('/add',checkToken,addCustomLeads);
 leadRouter.get('/get',checkToken,getCustomLeads);
 leadRouter.get('/updateisShow/:id',checkToken,updateStatus);

module.exports = leadRouter;