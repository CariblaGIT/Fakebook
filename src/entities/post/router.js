import { Router } from "express"
import { allPosts, makingPost, myPosts, postById } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";

const router = Router();

router.post('/', auth, makingPost);
router.get('/', auth, allPosts);
router.get('/:id', auth, postById);
router.get('/own', auth, myPosts);

export default router;