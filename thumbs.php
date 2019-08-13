<?php

require 'kirby/bootstrap.php';

$dirs = array_map( 'basename', array_filter( glob('content/*'), 'is_dir' ) );

$pages = array_values( kirby() -> site() -> index() -> toArray( function ( $page ) { return $page -> dirname(); }) );

$cruft = array_filter( $dirs, function ( $dir ) use ( $pages ) {
    return !in_array( $dir, $pages );
});
echo '<pre>';
var_export( $pages );

?>



<?

foreach ( $cruft as $dir ) {
    system("rm -rf content/".escapeshellarg($dir));
}