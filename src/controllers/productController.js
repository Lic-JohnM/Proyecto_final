const Product = require("../models/Products.js");

// Función para obtener todos los productos con paginación y filtros
const getProducts = async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const filter = query ? { $or: [{ category: query }, { available: query }] } : {};

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
  };

  try {
    const products = await Product.paginate(filter, options);
    res.json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? page - 1 : null,
      nextPage: products.hasNextPage ? page + 1 : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}` : null,
      nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Función para crear un nuevo producto
const createProducts = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || !stock) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    const newProduct = new Product({ name, price, category, stock });
    await newProduct.save();

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Función para obtener un producto por su ID
const getProductById = async (req, res) => {
  try {
    const { pid } = req.params; // Obtener el id del parámetro de la URL
    const product = await Product.findOne({ id: pid });

    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Función para actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params; // Obtener el id del producto desde los parámetros de la URL

    // Convertir `pid` a número si es necesario, ya que tu campo `id` es numérico
    const numericId = parseInt(pid, 10);

    // Verificar que `numericId` sea un número válido
    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: "ID de producto no válido" });
    }

    // Obtener los datos de actualización del cuerpo de la solicitud
    const updateData = req.body;

    // Actualizar el producto en la base de datos utilizando el campo `id` numérico
    const updatedProduct = await Product.findOneAndUpdate({ id: numericId }, updateData, {
      new: true, // Retorna el documento actualizado
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Función para eliminar un producto por su id personalizado
const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params; // Obtener el id del producto desde los parámetros de la URL

    // Convertir `pid` a número si es necesario, ya que tu campo `id` es numérico
    const numericId = parseInt(pid, 10);

    // Verificar que `numericId` sea un número válido
    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: "ID de producto no válido" });
    }

    // Buscar y eliminar el producto en la base de datos utilizando el campo `id` numérico
    const deletedProduct = await Product.findOneAndDelete({ id: numericId });

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.status(200).json({ success: true, message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Exportar las funciones
module.exports = { getProducts, createProducts, getProductById,updateProduct ,deleteProduct};
