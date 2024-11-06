const express = require("express");
const { 
  createCart, 
  getAllCarts, 
  getCartById, 
  deleteProductFromCart, 
  updateCartProducts, 
  updateProductQuantity, 
  deleteAllProductsFromCart 
} = require("../controllers/cartController");

const router = express.Router();

// Ruta para crear un carrito
router.post("/", createCart);

// Ruta para obtener todos los carritos
router.get("/", getAllCarts);

// Ruta para obtener un carrito por su ID
router.get("/:cid", getCartById);

// Ruta para eliminar un producto del carrito
router.delete("/:cid/products/:pid", deleteProductFromCart);

// Ruta para actualizar todos los productos del carrito
router.put("/:cid", updateCartProducts);

// Ruta para actualizar la cantidad de un producto específico
router.put("/:cid/products/:pid", updateProductQuantity);

// Ruta para eliminar todos los productos del carrito
router.delete("/:cid", deleteAllProductsFromCart);


const Product = require('../models/Products');
const Cart = require('../models/Cart');

// Ruta para mostrar todos los productos
router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Cambia esto por la cantidad de productos por página
    const products = await Product.find().skip((page - 1) * limit).limit(limit);
    const totalProducts = await Product.countDocuments();
    
    res.render('index', {
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        hasNextPage: limit * page < totalProducts,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
    });
});

// Ruta para mostrar un producto específico
router.get('/products/:pid', async (req, res) => {
    const product = await Product.findById(req.params.pid);
    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }
    res.render('product', { product });
});

// Ruta para mostrar un carrito específico
router.get('/carts/:cid', async (req, res) => {
    const cart = await Cart.findOne({ id: req.params.cid }).populate('products.productId');
    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }
    const totalPrice = cart.products.reduce((total, p) => total + (p.productId.price * p.quantity), 0);
    res.render('cart', { cart, totalPrice });
});


module.exports = router;
