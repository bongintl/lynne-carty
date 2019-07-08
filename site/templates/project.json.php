<?php

echo json_encode([
    'title' => (string) $page -> title(),
    'type' => (string) $page -> intendedTemplate(),
    'tags' => $page -> tags() -> split(),
    'mainImage' => $page -> mainImage() -> isNotEmpty()
        ? srcs( $page -> mainImage() -> toFile() )
        : null,
    'credits' => $page -> credits() -> toStructure(),
    'body' => (string) $page -> body() -> kirbytext()
]);