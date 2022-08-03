import mongoose from "mongoose";
import AnalyticsModel from "~~/server/db/Analytics";

export default defineEventHandler(async (event) => {
    try{
        const secrets = useRuntimeConfig().secretVariables;
        await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database');

        let analyticsDocument = await AnalyticsModel.findOne({}).exec();
            
        if (!analyticsDocument){
            const insertAnalytics = await AnalyticsModel.create({});
            analyticsDocument = insertAnalytics;
        }
        await mongoose.connection.close();
        return {
            success: true,
            ...analyticsDocument.toObject()
        };
    } catch (exception) {
        throw createError({statusCode: 500, message: exception, data: {success: false}})
    }  
})