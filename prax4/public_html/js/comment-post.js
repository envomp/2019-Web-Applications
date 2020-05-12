function commentPost(postId, userId, comment) {
    var request = new XMLHttpRequest();
    request.open("POST", "api/comment-post.api.php?postId=" + postId + "&userId=" + userId + "&comment=" + comment, false);
    request.send();
    location.reload();
}