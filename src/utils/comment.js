class CommentUtils {
  buildCommentTree(data, parent_id = "null") {
    const tree = [];
    for (const item of data) {
      if (item.parentCommentId === parent_id) {
        const children = this.buildCommentTree(data, item._id.toString());
        if (children.length > 0) {
          item.replies = children;
        }
        tree.push(item);
      }
    }
    return tree;
  }
}

module.exports = new CommentUtils();
