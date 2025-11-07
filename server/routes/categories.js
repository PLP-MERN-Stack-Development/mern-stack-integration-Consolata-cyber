const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort('name');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create category (admin only)
router.post('/',
    auth,
    [
        body('name').trim().notEmpty().withMessage('Category name is required'),
        body('description').optional().trim()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const category = new Category({
                name: req.body.name,
                description: req.body.description
            });

            const savedCategory = await category.save();
            res.status(201).json(savedCategory);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Category already exists' });
            }
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;