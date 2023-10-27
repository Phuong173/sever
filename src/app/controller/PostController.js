const fs = require('fs');
const Post = require('../models/Post');
const api_url = require('../util/Api_url');
const interaction_data = require('../models/Interactions');
const moment = require('moment');
const multer = require('multer');

const Comment = require('../models/comment');
const responses = require("../../config/responses");
const CommentUtils = require('../../utils/comment');

class PostController {

    async index(req, res) {
        try{
          const posts = await Post.find({});
          res.json(posts);
        } catch (err) {
          console.error("Error fetching net_wors:", err);
          res.status(500).send("Internal Server Error");
        }
      }

    getPosts(req, res, next) {
        const _id = req.params.id_user;
        Post.find({ _id_author: _id })
            .populate('_id_author', 'name avatar')
            .then(result => {
                const posts = result.map((post) => {
                    return {
                        _id:post._id,
                        title: post.title,
                        img_post: post.img,
                        content: post.content,
                        _id_author: post._id_author,
                    };
                });
                res.status(200).send({ message: 'Lấy bài viết thành công', posts });
            })
    }

    // async  AddPost(req, res, next )  {
    //     try {
    //         const { _id_author, title, content, video, likes, comments } = req.body;
    //         const time = moment(req.body.time, 'DD/MM/YYYY').toDate();

    //         const imgFiles = req.files; // Lấy danh sách tệp ảnh từ request
    //         const imgPaths = imgFiles.map(file => file.path); // Lưu đường dẫn của các tệp ảnh
    //         const newPost = new Post({
    //             _id_author,
    //             title,
    //             content,
    //             time,
    //             img: imgPaths, // Lưu đường dẫn của các tệp ảnh vào trường 'img'
    //             video,
    //             likes,
    //             comments,
    //         });

    //         await newPost.save();

    //         res.status(201).json({ message: 'Thêm bài viết thành công' });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Lỗi server' });
    //     }
    // }


    AddPost(req, res, next) {
        console.log(req.body);
        // return;
        fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
            const link = '/uploads/' + req.file.originalname;
            const url = api_url.API_URL + link;
            const data = {
                _id_author: req.body._id_author,
                title: req.body.title,
                img: url,
            }
            const post = new Post(data);
            post.save()
                .then(() => res.status(200).send({ message: 'Thêm thành công', }));
        })
    }

    Delete(req, res, next) {
        const _id = req.params.id;
        Post.delete({ _id: _id })
            .then(() => res.status(200).send({ message: 'Xóa thành công', }));
    }
    //like
    LikePost(req, res, next) {
      const data = {
          _id_user: req.body._id_user,
          _id_post: req.body._id_post,
          action: "like",
          note: req.body.note
      }
      const interaction = new interaction_data(data);
      interaction.save()
          .then(() => res.status(200).send({ message: 'like thành công' }))
          .catch(err => {
              res.status(404).send(err);
          })
  }

  UnLikePost(req, res, next) {
      const _id_post = req.params.id_post;
      const _id_user = req.params.id_user;
      interaction_data.findOneAndDelete({ _id_post: _id_post, _id_user: _id_user, action: "like" })
          .then((result) => {
              res.status(200).send({ message: 'un like thành công', })
          })
          .catch((error) => {
              // Xử lý lỗi nếu có
              next(error);
          });
  }

  GetAllLike(req, res, next) {
      const _id_post = req.params.id_post;
      interaction_data
          .find({ _id_post: _id_post, action: "like" })
          .populate('_id_user', 'name avatar')
          .then((result) => {
              const user_comment_and_note = result.map((comment) => {
                  return {
                      name_user: comment._id_user.name,
                      avatar: comment._id_user.avatar,
                  };
              });
              res.status(200).send(user_comment_and_note);
          })
          .catch((error) => {
              // Xử lý lỗi nếu có
              next(error);
          });
  }
  //comment tung
    // [POST] /post/comment
    async addComment(req, res) {
      try {
        const comment = new Comment(req.body);
        await comment.save();
        return res.status(200).json(responses.success200(comment));
      } catch (err) {
        return res.status(500).json(responses.error500(err));
      }
    }

    // [GET] /post/getCommentByIdPost
    async getCommentByIdPost(req, res) {
        try {
          const comments = await Comment.find({ postId: req.query.id }).lean();
    
          if (comments.length == 0) {
            return res.status(200).json(responses.success200([]));
          }
    
          const result =
            comments.length >= 2
              ? CommentUtils.buildCommentTree(comments)
              : comments;
          return res.status(200).json(responses.success200(result));
        } catch (err) {
          return res.status(500).json(responses.error500(err));
        }
      }

    // [PATCH] post/comment/:id
    async updateContent(req, res) {
      try {
        const updatedComment = await Comment.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { new: true }
        );
  
        if (!updatedComment) {
          return res.status(404).json(responses.error404("comment not found"));
        }
  
        return res.status(200).json(responses.success200(updatedComment));
      } catch (err) {
        return res.status(500).json(responses.error500(err));
      }
    }

    // [DELETE] /post/comment/:id
    async deleteComment(req, res) {
      try {
        const result = await Comment.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
          return res.status(404).json(responses.error404("comment not found"));
        }
        return res.status(204).end();
      } catch (err) {
        return res.status(500).json(responses.error500(err, null));
      }
    }

    //comment phuong
    // [POST] /post/comment
    async addCommentt(req, res) {
      try {
        const data = {
          _id_user: req.body._id_user,
          _id_post: req.body._id_post,
          parentCommentId: req.body.parentCommentId || null,
          action: "comment",
          note: req.body.note
      }
        const comment = new interaction_data(data);
        await comment.save();
        return res.status(200).json(responses.success200(comment));
      } catch (err) {
        return res.status(500).json(responses.error500(err));
      }
    }

    // [GET] /post/getCommentByIdPost
    async getCommentByIdPostt(req, res) {
        try {
          const comments = await interaction_data.find({ postId: req.query.id }).lean();
    
          if (comments.length == 0) {
            return res.status(200).json(responses.success200([]));
          }
    
          const result =
            comments.length >= 2
              ? CommentUtils.buildCommentTree(comments)
              : comments;
          return res.status(200).json(responses.success200(result));
        } catch (err) {
          return res.status(500).json(responses.error500(err));
        }
      }
      getAllCommentt(req, res, next) {
        const _id_post = req.params.id_post;
        interaction_data
            .find({ _id_post: _id_post, action: "comment" })
            .populate('_id_user', 'name avatar')
            .then((result) => {
                const user_comment_and_note = result.map((comment) => {
                    return {
                        name_user: comment._id_user.name,
                        avatar: comment._id_user.avatar,
                        note: comment.note
                    };
                });
                res.status(200).send(user_comment_and_note);
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                next(error);
            });
    }
    // [PATCH] post/comment/:id
    async updateContentt(req, res) {
      try {
        const updatedComment = await interaction_data.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { new: true }
        );
  
        if (!updatedComment) {
          return res.status(404).json(responses.error404("comment not found"));
        }
  
        return res.status(200).json(responses.success200(updatedComment));
      } catch (err) {
        return res.status(500).json(responses.error500(err));
      }
    }

    // [DELETE] /post/comment/:id
    async deleteCommentt(req, res) {
      try {
        const _id_post = req.params.id_post;
        const _id_user = req.params.id_user;
        post_data.findOne({ _id: _id_post, _id_author: _id_user })
            .then(result => {
                console.log(result);
                if (result === null) {
                    interaction_data.findOneAndDelete({ _id_post: _id_post, _id_user: _id_user, action: "comment" })
                        .then((result) => {
                            res.status(200).send({ message: 'xóa comment thành công', })
                        })
                        .catch((error) => {
                            // Xử lý lỗi nếu có
                            next(error);
                        });
                } else {
                    interaction_data.findOneAndDelete({ _id_post: _id_post, action: "comment" })
                        .then((result) => {
                            res.status(200).send({ message: 'xóa comment thành công', })
                        })
                        .catch((error) => {
                            // Xử lý lỗi nếu có
                            next(error);
                        });
                }
            })
      } catch (err) {
        return res.status(500).json(responses.error500(err, null));
      }
    }
}

module.exports = new PostController;


// const fs = require('fs');
// const post_data = require('../models/Post');
// const api_url = require('../util/Api_url');
// const user_data = require('../models/User')
// class PostController {
//     getPosts(req, res, next) {
//         const _id = req.params.id_user;
//         post_data.find({ _id_author: _id })
//             .populate('_id_author', 'name avatar')
//             .then(result => {
//                 const posts = result.map((post) => {
//                     return {
//                         _id:post._id,
//                         title: post.title,
//                         img_post: post.img,
//                         content: post.content,
//                         _id_author: post._id_author,
//                     };
//                 });
//                 res.status(200).send({ message: 'Lấy bài viết thành công', posts });
//             })
//     }

//     AddPost(req, res, next) {
//         res.json(req.body);
//         fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
//             const link = '/uploads/' + req.file.originalname;
//             const url = api_url.API_URL + link;
//             const data = {
//                 _id_author: req.body._id_author,
//                 title: req.body.title,
//                 img: url,
//             }
//             const post = new post_data(data);
//             post.save()
//                 .then(() => res.status(200).send({ message: 'Thêm thành công', }));
//         })
//     }

//     Delete(req, res, next) {
//         const _id = req.params.id;
//         post_data.delete({ _id: _id })
//             .then(() => res.status(200).send({ message: 'Xóa thành công', }));
//     }




// }

// module.exports = new PostController;


