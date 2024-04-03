import path from "path";
import { Router } from "express"
import { auth } from "../../core/middlewares/auth.js";
import { changeUserRole, deleteUserById, followOrUnfollowUser, getProfile, getUsers, modifyProfile, postsFromUser } from "./controller.js";
import { verifySuperAdmin } from "../../core/middlewares/isSuperAdmin.js";
import multer from "multer";

const avatarsStorage = multer.diskStorage({
    destination: "./public/img_avatars",
    filename: function (req, file, cb) {
        // Define the file name format
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const multerUpload = multer({ storage: avatarsStorage });

const router = Router();

router.get('/', auth, verifySuperAdmin, getUsers);
router.get('/profile', auth, getProfile);
router.get('/posts/:userId', auth, postsFromUser);
router.put('/:id/role', auth, verifySuperAdmin, changeUserRole);
router.put('/profile', auth, multerUpload.single('avatar'), modifyProfile);
router.put('/follow/:id', auth, followOrUnfollowUser);
router.delete('/:id', auth, verifySuperAdmin, deleteUserById);

export default router;