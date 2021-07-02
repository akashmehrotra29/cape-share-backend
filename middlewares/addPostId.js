const addPostId = (req, res, next) => {
  try {
    console.log({ req });
    req.postId = req.params.postId;
    next();
  } catch (error) {
    console.log(error);
  }
};
