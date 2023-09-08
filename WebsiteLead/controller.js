const { WebsiteLead } = require("./modal");
module.exports = {
  addWebsiteLead: async (req, res) => {
    try {
      const webLead = req.body;
      const existingWebLead = await WebsiteLead.findOne({
        email: webLead.email,
      });
      if (existingWebLead) {
        return res.status(200).json({
          code: "DUPLICATION",
          message: " already exists.",
        });
      }
      const result = await WebsiteLead.create(webLead);
      res.status(200).json({
        code: "SUCCESS",
        data: result,
      });
    } catch (error) {
      console.error("Error adding plan:", error);
      res.status(500).json({
        code: "ERROR",
        message: "An error occurred while adding the plan.",
      });
    }
  },
  //--------------GET WEBSITELEAD---------------
  getWebsiteLead: async (req, res) => {
    try {
      await WebsiteLead.find({}).then((result, err) => {
        if (result) {
          return res.status(200).json({
            code: "FETCHED",
            data: result
          })
        }

        else {
          return res.status(400).json({
            code: "ERROR",
            data: err
          })
        }
      })
    } catch (err) {
      console.log("err")
    }
  },
  //--------------GET WEBSITELEAD---------------
  getWebsiteLead: async (req, res) => {
    try {
      await WebsiteLead.find({}).then((result, err) => {
        if (result) {
          return res.status(200).json({
            code: "FETCHED",
            data: result
          })
        }

        else {
          return res.status(400).json({
            code: "ERROR",
            data: err
          })
        }
      })
    } catch (err) {
      console.log("err")
    }
  },
    UpdateWebsiteLead: async (req, res) => {
    
    try {
      await WebsiteLead.findByIdAndUpdate({ _id: req.params.id },{...req.body},{ new: true }).then((result, err) => {
   console.log(result,'ADASHJDSGDAJSD')
        if (!result) {
          return res.status(404).json({ message: 'Lead not found' });
        } 
        return res.status(200).json({
          code: "UPDATED",
          data: result,
        });
      })
    } catch (error) {
      return res.status(400).json({
        code: "ERROR",
        data: error
      })
    }
  }
};
