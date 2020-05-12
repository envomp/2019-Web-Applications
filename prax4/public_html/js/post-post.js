function postPost(parentPostId, userId, content) {
    var request = new XMLHttpRequest();
    request.open("POST", "api/post-post.api.php?postId=" + parentPostId + "&userId=" + userId + "&content=" + content, false);
    request.send();
    location.reload();
}