const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all posts with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate('author', 'username')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments();

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('category', 'name')
            .populate('comments.user', 'username');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create post
router.post('/',
    auth,
    upload.single('featuredImage'),
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('content').trim().notEmpty().withMessage('Content is required'),
        body('category').optional().isMongoId().withMessage('Invalid category ID')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const post = new Post({
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                author: req.user.id,
                featuredImage: req.file ? `/uploads/${req.file.filename}` : ''
            });

            const savedPost = await post.save();
            await savedPost.populate('author', 'username');
            await savedPost.populate('category', 'name');

            res.status(201).json(savedPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Update post
router.put('/:id',
    auth,
    upload.single('featuredImage'),
    [
        body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
        body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
        body('category').optional().isMongoId().withMessage('Invalid category ID')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.author.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this post' });
            }

            const updateData = {
                title: req.body.title || post.title,
                content: req.body.content || post.content,
                category: req.body.category || post.category
            };

            if (req.file) {
                updateData.featuredImage = `/uploads/${req.file.filename}`;
            }

            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            ).populate('author', 'username')
             .populate('category', 'name');

            res.json(updatedPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Delete post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.remove();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add comment to post
router.post('/:id/comments',
    auth,
    [
        body('text').trim().notEmpty().withMessage('Comment text is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            post.comments.unshift({
                user: req.user.id,
                text: req.body.text
            });

            await post.save();
            await post.populate('comments.user', 'username');

            res.json(post.comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;