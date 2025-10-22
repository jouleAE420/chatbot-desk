import mongoose from "mongoose";

interface MongoConnectionOptions {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {
    static async connect(options: MongoConnectionOptions) {
        const { mongoUrl, dbName } = options;

        try {

            await mongoose.connect(mongoUrl, { dbName: dbName });
            console.log("Mongo connected");
        } catch (error) {
            console.log("Database Connection error");
            throw error;
        }
    }
}
