const { default: mongoose } = require("mongoose");

const dbConniction = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  });
  // .catch((err) => {
  //   console.error(`Database Error: ${err}`);
  //   process.exit(1);
  // });
};

module.exports = dbConniction;
