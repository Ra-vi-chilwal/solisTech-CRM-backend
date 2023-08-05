const { Leads } = require("./modal");
const { Users } = require("../Auth/model");
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
          });
          res.status(200).json({
            code: "SUCCESS",
            data: result,
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
  //   getCustomLeads: async (req, res) => {
  //     try {
  //       // if (req?.user?.role?.slug == "superadmin" || req?.user?.role?.slug == "admin") {
  //       //     try {
  //       //         const leads = await Leads.find({});
  //       //         return res.status(200).json({
  //       //             code: "FETCHED",
  //       //             data: leads,
  //       //         });
  //       //     } catch (error) {

  //       //         return res.status(200).json({
  //       //             code: "FETCHED",
  //       //             data: error,
  //       //         });
  //       //     }

  //       // } else {
  //       const leads = await Leads.find({});
  //       const userPromises = leads.map(async (element) => {
  //         const userAssociated = element.assignedUser.some(
  //           (ele) => ele.id == req.user._id && ele.status == true
  //         );
  //         return { lead: element, userAssociated };
  //       });
  //       const allUsers = await Promise.all(userPromises);
  //       const filteredUsers = allUsers.filter(
  //         (userObj) => userObj.userAssociated
  //       );

  //       cron.schedule("* * * * *", () => {
  //         console.log("running a task every minute");
  //       });
  //       console.log(filteredUsers[0].lead.isShow, "llllop");
  //       if (filteredUsers[0].lead.isShow == "PENDING") {
  //         cron.schedule("* * * * *", () => {
  //           console.log("sj");
  //           Leads.findByIdAndUpdate(
  //             "64c09e5506bad13c70e098c1", { $set: { "assignedUser.$[elem1].status": false, "assignedUser.$[elem2].status": true, },},
  //             {
  //               new: true,

  //             }
  //             )

  //             .then((updatedLead,err) => {
  //               if (updatedLead) {
  //                 console.log("Lead updated successfully:", updatedLead);
  //               } else {
  //                 console.log("Lead not found.");
  //               }
  //             })
  //             .catch((error) => {
  //               console.error("Error updating lead:", error);
  //             });
  //         });
  //       }

  //       return res.status(200).json({
  //         code: "FETCHED",
  //         data: filteredUsers,
  //       });
  //       // }
  //     } catch (error) {
  //       console.log(error);
  //       return res.status(500).json({
  //         code: "ERROROCCURRED",
  //         data: error.message,
  //       });
  //     }
  //   },

  getCustomLeads: async (req, res) => {
    if (req?.user?.role?.slug == "superadmin" || req?.user?.role?.slug == "admin") {
      try {
        const leads = await Leads.find({});
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
        const leads = await Leads.find({ company: req.user.company });
        const currentDate = new Date();
        const updatePromises = leads.map(async (element) => {
          const assignedUser = element.assignedUser.find((ele) => ele.id == req.user._id);
  
          if (assignedUser && (assignedUser.managerstatus || assignedUser.leadstatus)) {
            if (assignedUser.key === "M1") {
              if (element.isShow === "PENDING" && element.dropAt === null) {
                const newDropAtDate = new Date(element.updatedAt);
                newDropAtDate.setHours(newDropAtDate.getHours() + 1);
                return Leads.findByIdAndUpdate(element._id, {
                  $set: { dropAt: newDropAtDate },
                });
              }
            } else if (assignedUser.key === "M2") {
              if (element.isShow === "PENDING" && element.dropAt <= currentDate) {
                const secondDropAtDate = new Date(element.dropAt);
                secondDropAtDate.setHours(secondDropAtDate.getHours() + 1);
                return Leads.findByIdAndUpdate(element._id, {
                  $set: {
                    dropAt: secondDropAtDate,
                    "assignedUser.$[elem1].managerstatus": false,
                    "assignedUser.$[elem2].managerstatus": true,
                  },
                }, { new: true });
              }
            } else if (assignedUser.key === "L1") {
              if (element.isShow === "ACCEPTED" && element.leadDropAt == null) {
                const newDropAtDate = new Date(element.updatedAt);
                newDropAtDate.setHours(newDropAtDate.getHours() + 1);
                return Leads.findByIdAndUpdate(element._id, {
                  $set: { leadDropAt: newDropAtDate },
                });
              }
            } else if (assignedUser.key === "L2") {
              if (element.isShow === "ACCEPTED" && element.leadDropAt <= currentDate) {
                const secondDropAtDate = new Date(element.leadDropAt);
                secondDropAtDate.setHours(secondDropAtDate.getHours() + 1);
                return Leads.findByIdAndUpdate(element._id, {
                  $set: {
                    leadDropAt: secondDropAtDate,
                    "assignedUser.$[elem1].leadstatus": false,
                    "assignedUser.$[elem2].leadstatus": true,
                  },
                });
              }
            }
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
  console.log("sdk")
  },
};
