<?php

function srcs ( $file, $widths = [ 100, 200, 400, 800, 1000, 1600 ] ) {
    $srcs = [];
    foreach ( $widths as $w ) {
        $f = $file -> resize( $w );
        $srcs []= [
            'url' => $f -> url(),
            'w' => $f -> width(),
            'h' => $f -> height()
        ];
    }
    return $srcs;
}