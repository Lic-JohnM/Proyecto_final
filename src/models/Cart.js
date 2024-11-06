const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Campo para el ID autoincrementado
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
