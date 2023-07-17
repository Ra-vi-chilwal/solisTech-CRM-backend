const { Plan } = require("./model");

module.exports = {
  addPlan:  async (req, res) => { 
        try {
            const userData = req.body;
            const existingUser = await Plan.findOne({ planName: userData.planName });
            if (existingUser) {
              return res.status(200).json({
                code: 'DUPLICATION',
                message: 'Plan  already exists.',
              });
            }
            const result = await Plan.create(userData);
            res.status(200).json({
              code: 'SUCCESS',
              data: result, 
            });
          } catch (error) {
            console.error('Error adding plan:', error);
            res.status(500).json({
              code: 'ERROR',
              message: 'An error occurred while adding the plan.',
            });
          }
  },

  //--------------------GET DEPARTMENT----------------------------------
  getPlan: async (req, res) => {
    try {
        await Plan.find({}).then((err, result) => {
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
    
    
       
    }catch(err){
console.log("err")
    }
},
}
