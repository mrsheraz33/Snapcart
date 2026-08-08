import mongoose from "mongoose";


type IGeoLocation = {
  type: "Point";
  coordinates: [number, number]; 
}

interface Iuser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string
  location?:IGeoLocation
}

const userSchema = new mongoose.Schema<Iuser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "deliveryBoy", "admin"],
      default: "user",
    },
    image:{
      type:String
    },
     location: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point',
    },
    coordinates: {
      type: [Number], 
      default:[0,0]
    },
  },
  },
  { timestamps: true },
);

userSchema.index({location : "2dsphere"})
const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User