import { Router } from "express"
import { getProfile, getUsers } from "./controller.js";
import { authUser } from "../../core/middlewares/authUser.js";

const router = Router();

router.get('/', getUsers);
router.get('/profile', authUser, getProfile);

export default router;