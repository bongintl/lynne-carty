<?php

echo json_encode([
    'title' => (string) $page -> title(),
    'files' => array_values( $page -> files() -> toArray() ),
    'next' => $page -> hasNextListed()
        ? (string) $page -> nextListed() -> url()
        : null,
    'prev' => $page -> hasPrevListed()
        ? (string) $page -> prevListed() -> url()
        : null
]);