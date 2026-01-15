import mongoose from 'mongoose';
export const connectDB = async()=>{
  try{
   const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
}

const conn = await mongoose.connect(mongoUri);

  }
  catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`)
  } else {
    console.error("Unknown error occurred")
  }
  process.exit(1)
}

}

