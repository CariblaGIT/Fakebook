import { Router } from "express"
import { auth } from "../../core/middlewares/auth.js";
import { changeUserRole, deleteUserById, followOrUnfollowUser, getProfile, getUsers, modifyProfile, postsFromUser } from "./controller.js";
import { verifySuperAdmin } from "../../core/middlewares/isSuperAdmin.js";

const router = Router();

router.get('/', auth, verifySuperAdmin, getUsers);
router.get('/profile', auth, getProfile);
router.get('/posts/:userId', auth, postsFromUser);
router.put('/:id/role', auth, verifySuperAdmin, changeUserRole);
router.put('/profile', auth, modifyProfile);
router.put('/follow/:id', auth, followOrUnfollowUser);
router.delete('/:id', auth, verifySuperAdmin, deleteUserById);

export default router;