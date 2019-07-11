<?php

function srcs ( $file, $widths = [ 100, 200, 400, 800, 1000, 1600 ] ) {
    // if ( $file -> extension() === 'gif' ) {
    //     return [[
    //         'url' => $file -> url(),
    //         'w' => $file -> width(),
    //         'h' => $file -> height()
    //     ]];
    // }
    $originalWidth = $file -> width();
    $smallerWidths = array_filter(
        $widths,
        function ( $w ) use ( $originalWidth ) {
            return $w <= $originalWidth;
        }
    );
    if ( count( $smallerWidths ) < count( $widths ) ) $smallerWidths []= $originalWidth;
    $srcs = [];
    foreach ( $smallerWidths as $w ) {
        $f = $file -> thumb([ 'width' => $w, 'quality' => 80 ]);
        $srcs []= [
            'url' => $f -> url(),
            'w' => $f -> width(),
            'h' => $f -> height()
        ];
    }
    return $srcs;
}