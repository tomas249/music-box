const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const connectDB = async (gridfs) => {
  // await mongoose.connect(DB_CONNECT, {
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false,
  // });

  Grid.mongo = mongoose.mongo;
  const conn = mongoose.createConnection(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  // console.log(`MongoDB connected: ${conn.connection.host}`);
  return gridfs(conn.db);
};

module.exports = connectDB;
