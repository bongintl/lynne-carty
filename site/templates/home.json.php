<?php

$projects = array_values(
    $site
        -> children()
        -> listed()
        -> published()
        -> flip()
        // -> limit( 20 )
        -> toArray( function ( $project ) {
            return [
                'title' => (string) $project -> title(),
                'url' => "/" . (string) $project -> uri(),
                'thumbnail' => $project -> mainImage() -> isNotEmpty()
                    ? srcs( $project -> mainImage() -> toFile(), [ 100, 200, 400 ] )
                    : null,
                'tags' => $project -> tags() -> split(),
                "size" => (float) $project -> size() -> value()
            ];
        })
);

$tags = $site -> tags() -> yaml();

echo json_encode([ 'projects' => $projects, 'tags' => $tags ]);
