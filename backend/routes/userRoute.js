import express from "express";
import { Register, login, logout,bookmark,getMyProfile , getOtherProfile, follow, unfollow} from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/bookmark/:id").put(isAuthenticated,bookmark);
router.route("/profile/:id").get(isAuthenticated,getMyProfile);
router.route("/otheruser/:id").get(isAuthenticated,getOtherProfile);
router.route("/follow/:id").post(isAuthenticated,follow);
router.route("/unfollow/:id").post(isAuthenticated,unfollow);

export default router;
