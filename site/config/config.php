<?php

return [
    'debug' => true,
    'thumbs' => [
        'driver' => 'im'
    ],
    'cache' => [
        'pages' => [
            'active' => true
        ]
    ]
    // 'routes' => [[
    //     'pattern' => 'image/(:all)',
    //     'action' => function ( $id ) {
    //         // return $id;
    //         return srcs( kirby() -> site() -> index() -> files() -> findById( $id ) );
    //     }
    // ]]
];
