const { Leads } = require("./modal");
const { Users } = require("../Auth/model");
const { LeadHistory } = require("../history/model")
var cron = require("node-cron");
// const { ObjectId } = require('mongodb');
module.exports = {
  addCustomLeads: async (req, res) => {
    try {
      const existsCompany = await Leads.find({ company: req.user.company._id });
      if (existsCompany) {
        const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
        try {
          const userData = req.body;

          const result = await Leads.create({
            ...userData,
            expireAt: oneHourFromNow,
            // user: `${req.user.firstName} ${req.user.lastName}`,
            // progressBar:"phase-1"
          });

          const leadHistory = await LeadHistory.create({ createdByUser:`${req.user.firstName} ${req.user.lastName}`, company: req.user.company, progressBar: "phase-1", fieldType: 'lead created', company: req.user.company, lead: result._id })
          res.status(200).json({
            code: "SUCCESS",
            data: result,
            leadHistory: leadHistory
          });
        } catch (err) {
          return res.status(200).json({
            code: "ERROROCCURED",
            message: err,
          });
        }
      } else {
        return res.status(200).json({
          code: "ERROROCCURED",
          message: "unauthorized company",
        });
      }
    } catch (error) {
      return res.status(200).json({
        code: "ERROROCCURED",
        message: error,
      });
    }
  },
  getCustomLeads: async (req, res) => {
    if (req?.user?.role?.slug == "superadmin" || req?.user?.role?.slug == "admin") {
      try {
        const leads = await Leads.find({})
        console.log(leads)
        return res.status(200).json({
          code: "FETCHED",
          data: leads,
        });
      } catch (error) {
        return res.status(500).json({
          code: "ERROR",
          message: "Internal Server Error",
        });
      }
    } else {
      try {
        const leads = await Leads.find({ company: req.user.company })
        const currentDate = new Date();
        const updatePromises = leads.map(async (element) => {
          const assignedUser = element.assignedUser.find((ele) => ele.id == req.user._id);
          if (assignedUser && assignedUser.managerstatus || assignedUser && assignedUser.leadstatus || element.dropAt <= currentDate) {
            if (element.isShow === "PENDING" && element.dropAt === null) {
              const newDropAtDate = new Date(element.updatedAt);
              newDropAtDate.setHours(newDropAtDate.getHours() + 1);
              return Leads.findByIdAndUpdate(element._id, {
                $set: {
                  dropAt: newDropAtDate,
                  currentStatus: "stage-1"
                },
              }, { new: true });
            }
            else if (element.currentStatus == "stage-1" && element.isShow === "PENDING" && element.dropAt <= currentDate) {

              const secondDropAtDate = new Date(element.dropAt);
              secondDropAtDate.setHours(secondDropAtDate.getHours() + 1);
              return Leads.findByIdAndUpdate(element._id, {
                $set: {
                  dropAt: secondDropAtDate,
                  "assignedUser.$[elem1].managerstatus": false,
                  "assignedUser.$[elem2].managerstatus": true,
                  currentStatus: "stage-2"
                },
              }, {
                arrayFilters: [
                  { "elem1.id": element.assignedUser[0].id },
                  { "elem2.id": element.assignedUser[1].id },
                ],
                new: true,
              });
            } else if (element.currentStatus == "stage-2" && element.isShow == "PENDING" && element.dropAt <= currentDate) {
              return Leads.findByIdAndUpdate(element._id, {
                $set: {
                  isShow: "REJECTED"
                },
              }, { new: true });
            }
            else if (element.isShow === "ACCEPTED" && element.leadDropAt == null) {
              const newDropAtDate = new Date(element.updatedAt);
              newDropAtDate.setHours(newDropAtDate.getHours() + 1);
              return Leads.findByIdAndUpdate(element._id, {
                $set: { leadDropAt: newDropAtDate },
              });
            }
            else if (element.isShow === "ACCEPTED" && element.leadDropAt <= currentDate) {
              const secondDropAtDate = new Date(element.leadDropAt);
              secondDropAtDate.setHours(secondDropAtDate.getHours() + 1);
              return Leads.findByIdAndUpdate(element._id, {
                $set: {
                  leadDropAt: secondDropAtDate,
                  "assignedUser.$[elem1].leadstatus": false,
                  "assignedUser.$[elem2].leadstatus": true,
                },
              }, {
                arrayFilters: [
                  { "elem1.id": element.assignedUser[0].id },
                  { "elem2.id": element.assignedUser[1].id },
                ],
                new: true,
              });
            }
            else {
              console.log("else")
            }
            return element
          }
        });
        const updateResults = await Promise.all(updatePromises);
        const filteredUsers = updateResults.filter((result) => result !== undefined);
        return res.status(200).json({
          code: "FETCHED",
          data: filteredUsers,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "ERROR", message: "Internal Server Error" });
      }
    }
  },
  updateStatus: async (req, res) => {
    try {
      const incomingData = req.body; // Assuming you're using Express.js
      const existingDataArray = await Leads.find({ _id: req.params.id });

      if (existingDataArray.length === 0) {
        // Handle the case where the record is not found
      } else {
        const existingData = existingDataArray[0]; // Assuming you're interested in the first object
        const updatedFields = {};
        for (const field in incomingData) {
          if (incomingData[field] !== existingData[field]) {
            updatedFields[field] = incomingData[field];
          }
        }
        const updatedLead = await Leads.findByIdAndUpdate({
          _id: req.params.id,
          company: req.user.company
        }, { ...req.body })
        const UpdatedleadHistory = await LeadHistory.create({ fieldType: 'lead updated', updatedByUser: `${req.user.firstName} ${req.user.lastName}`, updatedFields: updatedFields, company: req.user.company, lead: req.params.id })
        if (!updatedLead) {
          return res.status(404).json({ message: 'Lead not found' });
        }
        return res.status(200).json({
          code: "UPDATED",
          data: updatedLead,
          result: UpdatedleadHistory,
        });
      }
      ///
    } catch (error) {
      console.error('Error updating lead:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  UpdateStatus: async (req, res) => {
    try {
      const UpdateStatus = await Leads.findByIdAndUpdate(
        { _id: req.body.id, company: req.user.company },
        { new: true }
      );

      if (!UpdateStatus) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      return res.status(200).json({
        code: "UPDATED",
        data: UpdateStatus,
      });
    } catch (error) {
      return res.status(200).json({
        code: "ERROROCCURRED",
        data: error,
      });
    }
  },
  getLeadHistroy: async (req, res) => {
    try {
      if (req?.user?.role?.slug == "superadmin" || req?.user?.role?.slug == "admin") {
        await LeadHistory.find({ lead: req.params.id }).then((result, err) => {
          console.log(err)
          if (result) {
            return res.status(200).json({
              code: "FETCHED",
              data: result
            })
          }
        })
      } else {
        await LeadHistory.find({ company: req.user.company, lead: req.params.id }).then((result, err) => {
          if (result) {
            return res.status(200).json({
              code: "FETCHED",
              data: result
            })
          }
        })
      }
    } catch (error) {
      return res.status(500).json({
        code: "FETCHED",
        data: error
      })
    }
  }
};

