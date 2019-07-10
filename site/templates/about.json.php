<?php

echo json_encode([
    'title' => (string) $page -> title(),
    'type' => (string) $page -> intendedTemplate(),
    'tags' => $page -> tags() -> split(),
    'mainImage' => $page -> mainImage() -> isNotEmpty()
        ? srcs( $page -> mainImage() -> toFile() )
        : null,
    'body' => (string) $page -> body() -> kirbytext(),
    'resume' => $page -> resume() -> toStructure(),
    'links' => $page -> links() -> toStructure(),
    'additionalImages' => array_values(
        $page -> content() -> get('images') -> toFiles() -> map( 'srcs' ) -> data
    )
]);