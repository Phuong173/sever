const express = require('express');
const route = express.Router();

const postController = require('../app/controller/PostController');

const upload = require('../app/util/upload_file');
//bài viết
route.get('/getpost/:id_user',postController.getPosts);

route.get('/getall',postController.index);

route.post('/addPost',upload.single('file'),postController.AddPost);

route.delete('/delete/:id',postController.Delete);
//like
route.post('/likePost',postController.LikePost);

route.delete('/UnLikePost/:id_user/:id_post',postController.UnLikePost);

route.get('/getAllLike/:id_post',postController.GetAllLike);

//comment tung
route.get('/getCommentByIdPost',postController.getCommentByIdPost);

route.post('/comment', postController.addComment);

route.patch('/comment/:id', postController.updateContent);

route.delete('/comment/:id', postController.deleteComment);

//comment phuong
route.get('/getCommentByIdPostt',postController.getCommentByIdPostt);

route.get('/getAllcommentt/:id_post',postController.getAllCommentt);

route.post('/commentt', postController.addCommentt);

route.patch('/commentt/:id', postController.updateContentt);

route.delete('/commentt/delete/:id', postController.deleteCommentt);

module.exports = route; 

// const express = require('express');
// const route = express.Router();
// const upload = require('../util/upload_file');
// const postController = require('../controllers/PostController');
// route.get('/getpost/:id_user',postController.getPosts);
// route.post('/addPost',upload.single('img_file'),postController.AddPost);
// route.delete('/delete/:id',postController.Delete);
// module.exports = route;