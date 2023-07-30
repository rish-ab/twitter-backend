const Post = require("../models/Post");

exports.createPost = (req, res, next) => {
    const protocol = req.protocol;
    const url = req.get('host');
    const post = new Post({
        title: req.body.title,
        post: req.body.post,
        image: protocol + "://" + url + "/images/" + req.file.filename,
        userId: req.userInfo.userId
    });

    post.save()
        .then((result) => {
            res.status(200).json({
                msg: 1,
                posts: post,
                url: url
            })
        })
        .catch((err) => {
            res.status(422).json({
                error: err
            });
        });
}

exports.getAllPosts = (req, res, next) => {
    Post.find()
        .then((result) => {
            res.status(200).json({
                posts: result
            });
        })
        .catch((err) => {
            console.log(`Error while fetching Posts ${err}`);
        })


};

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, userId: req.userInfo.userId })
        .then((result) => {
            res.status(200).json({
                msg: `${req.params.id} has been deleted successfully`,
            });
        })
        .catch((err) => {
            res.status(422).json({
                msg: -1,
                error: err
            });
        });
};

exports.updatePost = (req, res, next) => {
    let imageUrl = req.body.image;
    if (req.file) {
        const protocol = req.protocol;
        const url = req.get('host');
        imageUrl = protocol + "://" + url + "/images/" + req.file.filename;
    }
    let post = {
        title: req.body.title,
        post: req.body.post,
        image: imageUrl
    };
    Post.updateOne({ _id: req.params.id, userId: req.userInfo.userId }, post)
        .then((result) => {
            if (result.nModified === 1) {
                res.status(200).json({
                    msg: `${req.params.id} has been Updated successfully`,
                    post: result
                });
            } else {
                res.status(401).json({
                    msg: -1,
                    content: 'You do not have acecss to the post'
                });
            }

        })
        .catch((err) => {
            res.status(422).json({
                msg: -1,
                error: err
            });
        });
};