import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected with database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    db.connections[0].readyState;
    console.log("db connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export default dbConnect;
