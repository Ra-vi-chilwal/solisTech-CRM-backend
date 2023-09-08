const WebsiteLeadRouter = require("express").Router();
const {addWebsiteLead,getWebsiteLead,UpdateWebsiteLead} = require("./controller")
WebsiteLeadRouter.get("/get",getWebsiteLead)
WebsiteLeadRouter.post("/add",addWebsiteLead)
WebsiteLeadRouter.post("/update/:id",UpdateWebsiteLead)
module.exports = WebsiteLeadRouter;
