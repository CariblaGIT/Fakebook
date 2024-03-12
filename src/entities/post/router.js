import { Router } from "express"
import { allPosts, deletePost, giveOrRemoveLikePost, makingPost, myPosts, postById, updatePost } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";

const router = Router();

router.get('/', auth, allPosts);
router.get('/own', auth, myPosts);
router.get('/:id', auth, postById);
router.post('/', auth, makingPost);
router.put('/', auth, updatePost);
router.put('/like/:id', auth, giveOrRemoveLikePost);
router.delete('/:id', auth, deletePost);

export default router;