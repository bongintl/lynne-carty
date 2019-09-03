<?php

echo json_encode([
    'title' => (string) $page -> title(),
    'type' => (string) $page -> intendedTemplate(),
    'tags' => $page -> tags() -> split(),
    'mainImage' => $page -> mainImage() -> isNotEmpty()
        ? srcs( $page -> mainImage() -> toFile() )
        : null,
    'video' => (string) $page -> video(),
    'autoplay' => (bool) $page -> autoplay(),
    'credits' => $page -> credits() -> yaml(),
    'body' => (string) $page -> body() -> kirbytext(),
    'additionalImages' => array_values(
        $page -> content() -> get('images') -> toFiles() -> map( 'srcs' ) -> data
    )
]);