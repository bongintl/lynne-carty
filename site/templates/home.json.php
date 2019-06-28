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
                'thumbnail' => $project -> mainImage() -> isNotEmpty()
                    ? $project -> mainImage() -> toFile() -> resize( 200 ) -> url()
                    : null,
                'tags' => $project -> tags() -> split(),
                "size" => (float) $project -> size() -> value()
            ];
        })
);

$tags = $site
    -> tags()
    -> toStructure()
    -> toArray();

echo json_encode([ 'projects' => $projects, 'tags' => $tags ]);
