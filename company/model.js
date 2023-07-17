const mongoose = require("mongoose");
const companySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String,required: true  },
    PurchasedOn :{type:Date,required: true },
    companyLogo:{type:String}
  },
  { collection: "company", timestamps: true }
);
const Company = mongoose.model("Company", companySchema);
module.exports = { Company, companySchema };
