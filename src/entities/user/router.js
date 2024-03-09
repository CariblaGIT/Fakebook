import { Router } from "express"
import { getProfile, getUsers } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";

const router = Router();

router.get('/', getUsers);
router.get('/profile', auth, getProfile);

export default router;