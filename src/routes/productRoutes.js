const express = require("express");
const { getProducts, getProductById, createProducts, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();
const Product = require("../models/Products.js");

// Ruta para obtener un producto específico por su id
router.get("/:id", async (req, res) => {
  try {
    // Convertir el id de la URL a un número
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).send("ID de producto inválido");
    }
    
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("productDetails", { product });
  } catch (error) {
    console.error("Error al cargar el producto:", error);
    res.status(500).send("Error al cargar el producto");
  }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/*
// Ruta para obtener todos los productos (GET) con paginación y filtrado
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { category: query } : {}; // Filtra por categoría si hay query

    // Configuración del paginado y ordenamiento
    const options = {
      limit: parseInt(limit),
      skip: (page - 1) * limit,
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}
    };

    const products = await Product.find(filter, null, options);
    const totalProducts = await Product.countDocuments(filter);
    
    // Cálculo de páginas
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page: parseInt(page),
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products/?limit=${limit}&page=${page - 1}` : null,
      nextLink: hasNextPage ? `/api/products/?limit=${limit}&page=${page + 1}` : null
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

*/
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query, available, lang = "es" } = req.query;

    const filter = {};
    
    if (query) {
      // Buscar la categoría según el idioma
      const categoryField = lang === "es" ? "category_es" : "category_en";
      filter[categoryField] = { $regex: new RegExp(query, "i") }; // Insensible a mayúsculas/minúsculas
    }

    if (available !== undefined) {
      filter.available = available === "true"; // Convertir a booleano
    }

    const options = {
      limit: parseInt(limit, 10),
      skip: (page - 1) * limit,
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}
    };

    const products = await Product.find(filter, null, options);
    res.render("index", { products });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    res.status(500).send("Error al cargar los productos");
  }
});

module.exports = router;
