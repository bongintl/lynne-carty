<?php

echo json_encode([
    'title' => (string) $page -> title(),
    'type' => (string) $page -> intendedTemplate(),
    'tags' => $page -> tags() -> split(),
    'mainImage' => $page -> mainImage() -> isNotEmpty()
        ? srcs( $page -> mainImage() -> toFile() )
        : null,
    'bio' => (string) $page -> bio() -> kirbytext(),
    'resume' => $page -> resume() -> yaml(),
    'contact' => (string) $page -> contact() -> kirbytext(),
]);