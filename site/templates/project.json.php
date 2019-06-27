<?php

echo json_encode([
    'title' => (string) $page -> title(),
    'tags' => $page -> tags() -> split(),
    'thumbnail' => (string) $page -> thumbnail() -> toFile() -> url(),
    'files' => array_values( $page -> files() -> toArray() ),
    'next' => $page -> hasNextListed()
        ? (string) $page -> nextListed() -> url() . '.json'
        : null,
    'prev' => $page -> hasPrevListed()
        ? (string) $page -> prevListed() -> url() . '.json'
        : null
]);