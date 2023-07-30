exports.createUser = (req, res, next) => {
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