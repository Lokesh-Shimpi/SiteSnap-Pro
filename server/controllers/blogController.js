const Blog = require('../models/Blog');
exports.getBlogs = async (req, res) => {
    try {
        const { sort } = req.query; 
        if (sort === 'mostLiked') {
            const blogs = await Blog.aggregate([
                {
                    $addFields: { likesCount: { $size: "$likes" } }
                },
                { $sort: { likesCount: -1, createdAt: -1 } },
            ]);
            await Blog.populate(blogs, { path: "author", select: "username" });
            return res.json(blogs);
        }
        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        const blogs = await Blog.find().sort(sortOption).populate('author', 'username');
        res.json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const blog = await Blog.create({ title, content, author: req.user.id });
        await blog.populate('author', 'username');
        res.status(201).json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this blog' });
        }
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        await blog.save();
        await blog.populate('author', 'username');
        res.json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this blog' });
        }
        await blog.deleteOne();
        res.json({ message: 'Blog removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        const userId = req.user.id;
        const hasLikedIndex = blog.likes.indexOf(userId);
        if (hasLikedIndex !== -1) {
            blog.likes.splice(hasLikedIndex, 1);
        } else {
            blog.likes.push(userId);
        }
        await blog.save();
        await blog.populate('author', 'username');
        res.json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
