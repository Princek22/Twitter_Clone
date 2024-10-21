import express from "express";
import { createTweet,deleteTweet,likeOrDislike, getAllTweet, getFollowingTweet } from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.route("/create").post(isAuthenticated,createTweet);
router.route("/delete/:id").delete(isAuthenticated,deleteTweet);
router.route("/like/:id").put(isAuthenticated,likeOrDislike);
router.route("/alltweets/:id").get(isAuthenticated,getAllTweet);
router.route("/followingtweets/:id").get(isAuthenticated,getFollowingTweet);

export default router;