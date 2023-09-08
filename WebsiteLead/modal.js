const mongoose = require("mongoose");
const websiteLeadSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        firstName:{type:String,required:true},
        lastName:{type:String,required:true},
        phone:{type:String,required:true},
        email:{type:String,required:true},
        message:{type:String,required:true},
        Source:{type:String,default:"website",required:true}
    },
    {collection: "websiteLead", timestamps: true}
);
const WebsiteLead = mongoose.model("websiteLead", websiteLeadSchema);
module.exports = { WebsiteLead, websiteLeadSchema };