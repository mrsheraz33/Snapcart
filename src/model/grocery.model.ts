import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const grocerySchema = new mongoose.Schema<IGrocery>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Meat & Seafood",
        "Bakery & Bread",
        "Beverages",
        "Snacks & Sweets",
        "Pantry & Staples",
        "Frozen Foods",
        "Organic & Health",
        "Personal Care",
      ],
      required: true,
    },
    price: {
      type: String,
      required: true,
      enum: ["Kg", "Gram", "Liter", "Ml", "Piece", "Pack"],
    },
    unit: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema)
export default Grocery