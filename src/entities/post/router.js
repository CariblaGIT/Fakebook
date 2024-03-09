import { Router } from "express"
import { allPosts, deletePost, makingPost, myPosts, postById, updatePost } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";

const router = Router();

router.post('/', auth, makingPost);
router.get('/', auth, allPosts);
router.get('/:id', auth, postById);
router.get('/own', auth, myPosts);
router.put('/', auth, updatePost);
router.delete('/:id', auth, deletePost);

export default router;