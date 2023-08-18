const mongoose = require("mongoose");
const leadHistorySchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        createdByUser: { type: String },
        createTime: { type: String },
        progressBar:{type:String},
        stage: { type: String },
        status:{type:String},
        updatedByUser :{type:String},
        updatedFields :{type:Array},
        updateByTime : {type:String},
        lead:{ type: mongoose.Schema.Types.ObjectId,required: true },
        fieldType:{ type: String, enum: ['lead created','lead updated'], default: null },
        // firstMeeting:{type:String},
        // meetingType:{type:String},
        company:{ type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    },
    { collection: "leadHistory", timestamp: true }
);
const LeadHistory = mongoose.model("LeadHistory", leadHistorySchema);
module.exports = { LeadHistory, leadHistorySchema }