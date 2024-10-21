import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"

export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res
        .status(401)
        .json({ message: "all fields are required  ", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "Email already exist ", success: false });
    }

    const hashedPassword = await bcryptjs.hash(password, 16);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


export const login = async(req,res) =>{
  try {
     const {email,password} = req.body;
     if(!email || !password){
      return res
      .status(401)
      .json({ message: "all fields are required  ", success: false });
     }
     const user = await User.findOne({email});
     if(!user){
      return res
      .status(401)
      .json({ message: "User does not exist with this email  ", success: false });
     }

     const isMatch = await bcryptjs.compare(password,user.password);
     if(!isMatch){
      return res
      .status(401)
      .json({ message: "Incorrect email or password ", success: false });
     }

     const token = await jwt.sign({ id: user._id }, process.env.TOKEN_SECRET,{expiresIn:"1d"});
     return res.status(201).cookie("token",token,{expiresIn:"1d",httpOnly:true}).json({
       message:`Welcome back ${user.name}`,
       user,
       success:true
     })

     
     
  } catch (error) {
    console.log(error)
  }
}


export const logout = (req,res) =>{
  return res.cookie("token","",{expiresIn:new Date(Date.now())}).json({
    message:"User logged out successfully",
    success:true
  })
}

export const bookmark = async(req,res) => {
  try {
    const loggedInUserId  = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUserId);
    if(user.bookmark.includes(tweetId)){
        await User.findByIdAndUpdate(loggedInUserId,{$pull:{bookmark:tweetId}});
        return res.status(200).json({
            message:"Removed from bookmark"
        })
    }else{
        await User.findByIdAndUpdate(loggedInUserId,{$push:{bookmark:tweetId}});
        return res.status(201).json({
            message:"Saved from bookmark"
        })
    }
} catch (error) {
    console.log(error)
}
}

export const getMyProfile = async(req,res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user
    })
  } catch (error) {
    console.log(error)
  }
}

export const getOtherProfile = async(req,res) => {
  try {
    const {id} = req.params;
    const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
    if(!otherUsers){
    return res.status(401).json({
      message:"Currently do not have users"
    })}
    return res.status(200).json({
     otherUsers
    })
  } catch (error) {
    console.log(error)
  }
}


export const follow = async(req,res) => {
  try {
    const loggedInUserId = req.body.id;
    const userID = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userID);
    if(!user.followers.includes(loggedInUserId)){
      await user.updateOne({$push:{followers:loggedInUserId}});
      await loggedInUser.updateOne({$push:{following:userID}});
    }else{
      return res.status(400).json({
        message:`User already followed to ${user.name}`
       }) 
    }

    return res.status(200).json({
      message:`${loggedInUser.name} just follow to ${user.name}`,
      success:true
     })
  } catch (error) {
    console.log(error)
  }
}

export const unfollow = async(req,res) => {
  try {
    const loggedInUserId = req.body.id;
    const userID = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userID );
    if(loggedInUser.following.includes(userID)){
      await user.updateOne({$pull:{followers:loggedInUserId}});
      await loggedInUser.updateOne({$pull:{following:userID}});
    }else{
      return res.status(400).json({
        message:`User has not followed yet`
       }) 
    }

    return res.status(200).json({
      message:`${loggedInUser.name}  unfollow to ${user.name}`,
      success:true
     })
  } catch (error) {
    console.log(error)
  }
}