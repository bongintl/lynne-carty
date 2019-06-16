<?php

$projects = array_values(
    $pages
        -> find( 'work' )
        -> children()
        -> published()
        -> flip()
        -> toArray( function ( $project ) {
            return [
                'title' => (string) $project -> title(),
                'url' => (string) $project -> url(),
                'thumbnail' => $project -> thumbnail() -> isNotEmpty()
                    ? $project -> thumbnail() -> toFile() -> resize( 200 ) -> url()
                    : null,
                'tags' => $project -> tags() -> split()
            ];
        })
);

$tags = $pages
    -> find( 'work' )
    -> tags()
    -> toStructure()
    -> toArray();

echo json_encode([ 'projects' => $projects, 'tags' => $tags ]);
