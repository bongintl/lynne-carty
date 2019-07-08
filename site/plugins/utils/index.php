<?php

function srcs ( $file ) {
    $originalWidth = $file -> width();
    $widths = array_filter(
        [ 100, 200, 400, 800, 1000, 1600, min( $originalWidth, 2000 ) ],
        function ( $w ) use ( $originalWidth ) {
            return $w <= $originalWidth;
        }
    );
    $srcs = [];
    foreach ( $widths as $w ) {
        $f = $file -> thumb([ 'width' => $w, 'quality' => 80 ]);
        $srcs []= [
            'url' => $f -> url(),
            'w' => $f -> width(),
            'h' => $f -> height()
        ];
    }
    return $srcs;
}