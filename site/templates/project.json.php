<?php

echo json_encode([
    'title' => (string) $page -> title(),
    'tags' => $page -> tags() -> split(),
    'mainImage' => $page -> mainImage() -> isNotEmpty()
        ? srcs( $page -> mainImage() -> toFile() )
        : null,
    'credits' => $page -> credits() -> toStructure(),
    'body' => $page -> body() -> kirbytext()
]);