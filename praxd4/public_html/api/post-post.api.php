<?php

define("WEBPAGE_CONTEXT", "ajax");

set_include_path(implode(PATH_SEPARATOR, array(
    __DIR__,
    __DIR__ . "/../../resources"
)));

require_once("global.inc.php");

if (!is_logged_in()) {
    exit;
}

$post_id = isset($_GET['postId']) ? (int)$_GET['postId'] : 0;
$user_id = isset($_GET['userId']) ? (int)$_GET['userId'] : 0;
$content = isset($_GET['content']) ? $_GET['content'] : '';

if ($post_id && $user_id && $content != '') {
    $query = "INSERT INTO `posts_185787_envomp`
		  (`user_id`, `parent_id`, `content`)
		  VALUES ('" . $db->real_escape_string($user_id) . "',
		      '" . $db->real_escape_string($post_id) . "',
		      '" . $db->real_escape_string($content) . "')";
    $results = $db->query($query);
    if ($results) {
        echo json_encode(true);
        exit;
    }
}

echo json_encode(false);
