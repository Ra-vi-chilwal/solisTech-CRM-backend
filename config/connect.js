const mongoose = require("mongoose");
module.exports = function () {
  mongoose.connect(
    `mongodb+srv://ravindarsingh:Develop%401234@cluster0.b75cz0s.mongodb.net/dev`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  mongoose.connection.on("connected", () => {
    console.log("db connected");
  });
};
