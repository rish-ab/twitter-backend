const express = require('express');
const app = express.Router();

const AuthenticateRequest = require('../middlewares/Authenticate');
const PostController = require('../controllers/posts');
const uploadFile = require('../middlewares/File');



// route for saving post
app.post("",
    AuthenticateRequest,
    uploadFile,
    PostController.createPost
);

// route for getting all the posts 
app.get("",
    PostController.getAllPosts
);


// route for deleting post 
app.delete("/:id",
    AuthenticateRequest,
    PostController.deletePost
);


// route for updating post 

app.put("/:id",
    AuthenticateRequest,
    uploadFile,
    PostController.updatePost
);

module.exports = app;   
