const Menu = require('../models/Menu');

// Registrar un nuevo platillo
const registrarPlatillo = async (req, res) => {
  try {
    const nuevoPlatillo = new Menu(req.body);
    const platilloGuardado = await nuevoPlatillo.save();
    res.status(201).json({ success: true, data: platilloGuardado });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Obtener todos los platillos (con soporte para filtrar por req.query.categoria)
const obtenerPlatillos = async (req, res) => {
  try {
    const { categoria } = req.query;
    let filtro = {};

    if (categoria) {
      filtro.categoria = categoria.toLowerCase();
    }
    
    const platillos = await Menu.find(filtro);
    res.status(200).json({ success: true, count: platillos.length, data: platillos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener platillos filtrando por req.params.categoria
const obtenerPlatillosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const platillos = await Menu.find({ categoria: categoria.toLowerCase() });
    res.status(200).json({ success: true, count: platillos.length, data: platillos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  registrarPlatillo, 
  obtenerPlatillos, 
  obtenerPlatillosPorCategoria 
};