import { Router } from "express"
import { makingPost, myPosts } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";

const router = Router();

router.post('/', auth, makingPost);
router.get('/own', auth, myPosts);

export default router;