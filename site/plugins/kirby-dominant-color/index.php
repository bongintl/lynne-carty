<?php

@include_once __DIR__ . '/vendor/autoload.php';

use League\ColorExtractor\Color;
use League\ColorExtractor\ColorExtractor;
use League\ColorExtractor\Palette;

Kirby::plugin( 'benwest/kirby-dominant-color', [
    'fileMethods' => [
        'dominantColor' => function () {
            return 'honk';
            if ( $this -> type() != 'image' ) return null;
            $thumb = $this -> resize( 50 );
            $palette = Palette::fromFilename( $thumb -> root() );
            $extractor = new ColorExtractor( $palette );
            $colors = $extractor->extract( 1 );
            $color = Color::fromIntToHex( $colors[ 0 ] );
            return $color;
        }
    ]
]);

// kirby()->hook(['panel.file.upload', 'panel.file.replace'], function($image) {
//   if ($image->type() == 'image') {
//     // Create thumb for faster processing
//     $thumb = $image->thumb([
//       'width'   => 400,
//       'imagekit.lazy' => false,
//       'imagekit.optimize' => false
//     ]);
// 		// Extract main color
// 		$palette = Palette::fromFilename($thumb->root());
// 		$extractor = new ColorExtractor($palette);
// 		$colors = $extractor->extract(1);
// 		$hex_main_color = Color::fromIntToHex($colors[0]);
// 		// Update image metadata
// 		$image->update(array(
// 			'color'    => $hex_main_color
// 		));
//   }
// });