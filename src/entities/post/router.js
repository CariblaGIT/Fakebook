import path from "path";
import { Router } from "express"
import { allPosts, deleteComment, deletePost, getTimeline, giveOrRemoveLikePost, makingCommentIntoPost, makingPost, myPosts, postById, updatePost } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";
import multer from "multer";

const postsStorage = multer.diskStorage({
    destination: "./public/img_posts",
    filename: function (req, file, cb) {
        // Define the file name format
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const multerUpload = multer({ storage: postsStorage });

const router = Router();

router.get('/', auth, allPosts);
router.get('/own', auth, myPosts);
router.get('/timeline', auth, getTimeline);
router.get('/:id', auth, postById);
router.post('/', auth, multerUpload.array('post', 9), makingPost);
router.put('/', auth, updatePost);
router.put('/comment/:id', auth, makingCommentIntoPost);
router.put('/like/:id', auth, giveOrRemoveLikePost);
router.delete('/:id', auth, deletePost);
router.delete('/:postId/comment/:id', auth, deleteComment);

export default router;