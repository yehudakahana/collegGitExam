import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://yk3222145:lZcnjdtahz6MrVT8@cluster0.21bgr.mongodb.net/CollegeExam?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
};

export default connectDB;
