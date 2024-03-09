import { Router } from "express"
import { makingPost } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";

const router = Router();

router.post('/', auth, makingPost);

export default router;