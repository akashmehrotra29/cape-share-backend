const verifyPostId = (req, res, next) => {
  req.postId = req.params.postId;
  next();
};
