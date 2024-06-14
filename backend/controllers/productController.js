
const express = require('express');
const router = express.Router();
const productService = require('../service/productService');

// GET /api/categories/:categoryName/products
// GET /api/categories/:categoryName/products
router.get('/categories/:categoryName/products', async (req, res) => {
    const { categoryName } = req.params;
    let { top = 10, minPrice = 0, maxPrice = 10000, page = 1, limit = 10, sort } = req.query;

    let n = parseInt(top);
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Invalid value for n' });
    }

    let l = parseInt(limit);
    if (isNaN(l) || l <= 0) {
        return res.status(400).json({ error: 'Invalid value for limit' });
    }

    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
    
        const products = await productService.fetchProducts(categoryName, {
            limit: parseInt(limit),
            offset: offset,
            minPrice,
            maxPrice,
            sort
        });
    
        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: products ? products.length : 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/categories/:categoryName/products/:productId
router.get('/categories/:categoryName/products/:productId', async (req, res) => {
    const { categoryName, productId } = req.params;

    try {
        const product = await productService.fetchProductById(categoryName, productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
