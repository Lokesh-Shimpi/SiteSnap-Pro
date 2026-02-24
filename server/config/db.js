const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error("______________________________________________________");
        console.error("🚨 MONGODB CONNECTION FAILED");
        console.error("Please ensure MongoDB is running locally on port 27017");
        console.error("OR Docker Desktop is running (we'll try to use it)");
        console.error("OR update .env with a valid MONGO_URI");
        console.error("______________________________________________________");
    }
};
module.exports = connectDB;
