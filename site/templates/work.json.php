<?php

echo json_encode(
    array_values(
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
    )
);
