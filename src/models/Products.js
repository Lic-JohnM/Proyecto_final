const mongoose = require("mongoose");
const Counter = require("./Counter");


const getNextSequenceValue = async (sequenceName) => {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
};


const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  available: Boolean,
});

// Middleware de Mongoose para asignar el ID antes de guardar
productSchema.pre("save", async function (next) {
  if (this.isNew) { // Solo si es un nuevo documento
    this.id = await getNextSequenceValue("productId");
  }
  next();
});
module.exports = mongoose.model("Product", productSchema);
