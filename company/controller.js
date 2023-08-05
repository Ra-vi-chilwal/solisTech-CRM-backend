const { Company } = require("./model");

module.exports = {
  addCompany: async (req, res) => {
   const userData = req.body;
   console.log(userData)
    try {
    
      const existingUser = await Company.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(200).json({
          code: "DUPLICATION",
          message: "Company  already exists.",
        });
      }
      const result = await Company.create({...userData,companyLogo:req.file.filename});
      res.status(200).json({
        code: "SUCCESS",
        data: result,
      });
    } catch (error) {
      console.error("Error adding Company:", error);
      res.status(500).json({
        code: "ERROR",
        message: "An error occurred while adding the Company.",
      });
    }
  },

  //--------------------GET DEPARTMENT----------------------------------
  getCompany: async (req, res) => {
    try {
      await Company.find({}).then((result, err) => {
        if (result) {
          return res.status(200).json({
            code: "FETCHED",
            data: result,
          });
        } else {
          return res.status(400).json({
            code: "ERROR",
            data: err,
          });
        }
      });
    } catch (err) {
      console.log("err");
    }
  },
};
