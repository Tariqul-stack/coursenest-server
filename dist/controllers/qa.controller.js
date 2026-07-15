import { QAPost, QAAnswer } from '../models/QAPost';
export const getPosts = async (req, res) => {
    try {
        const { search, tag, status, page = 1, limit = 10 } = req.query;
        const query = {};
        if (search)
            query.title = { $regex: search, $options: 'i' };
        if (tag)
            query.tags = { $in: [tag] };
        if (status)
            query.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const [posts, total] = await Promise.all([
            QAPost.find(query)
                .populate('author', 'name avatar role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            QAPost.countDocuments(query),
        ]);
        res.status(200).json({
            success: true,
            posts,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const getPost = async (req, res) => {
    try {
        const post = await QAPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('author', 'name avatar role');
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const answers = await QAAnswer.find({ post: req.params.id })
            .populate('author', 'name avatar role')
            .sort({ isAccepted: -1, createdAt: 1 });
        res.status(200).json({ success: true, post, answers });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const createPost = async (req, res) => {
    try {
        const { title, description, tags, courseId } = req.body;
        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required' });
            return;
        }
        const post = await QAPost.create({
            author: req.user?.id,
            title,
            description,
            tags: tags || [],
            course: courseId || undefined,
        });
        await post.populate('author', 'name avatar role');
        res.status(201).json({ success: true, post });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const deletePost = async (req, res) => {
    try {
        const post = await QAPost.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        if (post.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        await post.deleteOne();
        await QAAnswer.deleteMany({ post: req.params.id });
        res.status(200).json({ success: true, message: 'Post deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const createAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            res.status(400).json({ message: 'Content is required' });
            return;
        }
        const answer = await QAAnswer.create({
            post: req.params.id,
            author: req.user?.id,
            authorRole: req.user?.role,
            content,
        });
        await answer.populate('author', 'name avatar role');
        res.status(201).json({ success: true, answer });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const acceptAnswer = async (req, res) => {
    try {
        const post = await QAPost.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        if (post.author.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Only post author can accept answers' });
            return;
        }
        await QAAnswer.updateMany({ post: req.params.id }, { isAccepted: false });
        const answer = await QAAnswer.findByIdAndUpdate(req.params.answerId, { isAccepted: true }, { new: true });
        post.status = 'resolved';
        await post.save();
        res.status(200).json({ success: true, answer });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const deleteAnswer = async (req, res) => {
    try {
        const answer = await QAAnswer.findById(req.params.answerId);
        if (!answer) {
            res.status(404).json({ message: 'Answer not found' });
            return;
        }
        if (answer.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        await answer.deleteOne();
        res.status(200).json({ success: true, message: 'Answer deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
