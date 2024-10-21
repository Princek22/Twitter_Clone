import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({
    path:"../config/.env"
})

const databaseConnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDb connected ")
    }).catch((err)=>{
     console.log(err)
    })
}

export default databaseConnection;
