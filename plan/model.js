const mongoose = require("mongoose");
const planSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    planName: { type: String,required: true  },
    price: { type: Number,required: true  },
    Duration: { type: Number,required: true  },
  },
  { collection: "plan", timestamps: true }
);
const Plan = mongoose.model("Plan", planSchema);
module.exports = { Plan, planSchema };