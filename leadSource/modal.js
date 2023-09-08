const mongoose = require("mongoose");
const LeadSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        date: { type: String},
        description: { type: String, required: true },
        email: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        leadOwner: { type: String, required: true },
        leadSource: { type: String, required: true },
        leadStatus: { type: String, required: true },
        phone: { type: String, required: true },
        readytoRunBusiness: { type: String },
        servicesEnquired: { type: String },
        state: { type: String, required: true },
        time: { type: String, required: true },
        whatisyourbudget: { type: String },
        assignedUser: { type: Array },
        userAssociated: { type: String },
        currentStatus: { type: String, default: null },
        // this data for expire :
        dropAt: { type: Date, default: null },
        leadDropAt: { type: Date, default: null },
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
        reminderCall: { type: Date },
        meetingHighlight:{type: String},
        meetingdate:{type: Date},
        meetingType:{type: String},
        meetingHost:{type: String},
        followUp :{type:String},
        //for Traffic Lighting
 
        isShow: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
        // expireAt: { type: Date, default: Date.now, expires: 60 },
        // extendedExpireAt: { type: Date, default: null},


        //leadHistory
        // user: { type: String },
        // createTime: { type: String },
        // stage: { type: String },
        // status: { type: String },
        // updatedBy: { type: String },
        // leadStatus: { type: String },
        // leadSource: { type: String },
        // updatedFields: { type: Array },
        // updatebyuser:{type: String},
        // updatedbyDate:{type:String}
    },
    { collection: "leads", timestamps: true }
);
const Leads = mongoose.model("leads", LeadSchema);
module.exports = { Leads, LeadSchema };

