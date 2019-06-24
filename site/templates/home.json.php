<?php

$projects = array_values(
    $site
        -> children()
        -> listed()
        -> published()
        -> flip()
        -> toArray( function ( $project ) {
            return [
                'title' => (string) $project -> title(),
                'url' => "/" . (string) $project -> uri(),
                'thumbnail' => $project -> thumbnail() -> isNotEmpty()
                    ? $project -> thumbnail() -> toFile() -> resize( 200 ) -> url()
                    : null,
                'pixel' => $project -> thumbnail() -> isNotEmpty()
                    ? $project -> thumbnail() -> toFile() -> resize( 1, 1 ) -> url()
                    : null,
                'tags' => $project -> tags() -> split()
            ];
        })
);

$tags = $site
    -> tags()
    -> toStructure()
    -> toArray();

echo json_encode([ 'projects' => $projects, 'tags' => $tags ]);