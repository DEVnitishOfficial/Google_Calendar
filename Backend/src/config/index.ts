
import dotenv from 'dotenv'

type ServerConfig = {
    PORT:number
    MONGO_URI:string
}
function loadEnv(){
    dotenv.config()
}

loadEnv()

export const serverConfig:ServerConfig = {
    PORT: Number(process.env.PORT) || 3002,
    MONGO_URI: process.env.MONGO_URI || ""
}