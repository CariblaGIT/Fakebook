import { Router } from "express"
import { allPosts, deletePost, giveOrRemoveLikePost, makingPost, myPosts, postById, postsFromUser, updatePost } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";

const router = Router();

router.post('/', auth, makingPost);
router.get('/', auth, allPosts);
router.get('/:id', auth, postById);
router.get('/own', auth, myPosts);
router.get('/users/:userId', auth, postsFromUser);
router.put('/', auth, updatePost);
router.put('/like/:id', auth, giveOrRemoveLikePost);
router.delete('/:id', auth, deletePost);

export default router;