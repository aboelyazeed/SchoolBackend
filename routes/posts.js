const router = require("express").Router();
const Post = require("../models/Post")
const moment = require("moment");
const User = require("../models/User");

//create a post
router.post("/" , async( req, res )=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//update a post
router.put("/:id" , async( req, res )=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("The Post Has been Updated")
        }
        else{
            res.status(403).json("You can Update Only Your Post")
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

//delete a post 
router.delete("/:id" , async( req, res )=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json("The Post Has been Deleted")
        }
        else{
            res.status(403).json("You can Delete Only Your Post")
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

//like + dislike  a post
router.put (  "/:id/like" , async( req, res )=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("The Post Has been Liked")
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("The Post Has been Disliked")        
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})   
//get a post 
router.get("/:id" , async(req , res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//get all posts (followings)
router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId }); // checks if he friend ? then take it's post inside your timeline
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

/*
  //posts in an updated last 2 days and in a random way with each other 
  router.get("/timeline/all", async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // تأكد من وجود seenPosts
        user.seenPosts = user.seenPosts || [];
        const twoDaysAgo = moment().subtract(2, "days").toDate();

        // اجلب المنشورات غير المشاهدة من آخر يومين
        let unseenPosts = await Post.find({
            _id: { $nin: user.seenPosts }, // استثناء المنشورات التي شاهدها
            createdAt: { $gte: twoDaysAgo }, // المنشورات من آخر يومين
        });

        // إذا شاهد المستخدم كل المنشورات، اجلب منشورات أخرى
        if (unseenPosts.length === 0) {
            const allPosts = await Post.find().sort({ createdAt: -1 }); // جميع المنشورات
            unseenPosts = allPosts; // إعادة تعبئة المنشورات
            user.seenPosts = []; // إعادة تعيين قائمة المنشورات المشاهدة
        }

        // ترتيب المنشورات بشكل عشوائي
        const shuffledPosts = unseenPosts.sort(() => Math.random() - 0.5);

        // تحديث قائمة المنشورات المشاهدة للمستخدم
        user.seenPosts = user.seenPosts.concat(shuffledPosts.map((post) => post._id));
        await user.save();

        // إرسال المنشورات
        res.status(200).json(shuffledPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

*/

module.exports = router