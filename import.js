var fs = require('fs');
var path = require('path');
var YAML = require('yaml')

var kirbyYaml = obj => Object.entries( obj )
    .map( ([ key, value ]) => YAML.stringify({ [ key ]: value }) )
    .join( '\n\n----\n\n' )

var capitalise = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
var titleCase = string => string.split( ' ' ).map( capitalise ).join( ' ' );

fs.readdirSync('./work').forEach( ( file, i ) => {
    var [ name ] = file.split( '.' );
    var [ tags, ...rest ] = name.split('-');
    tags = tags.split('+').sort().map( tag => tag === 'AD' ? 'Art Direction' : tag ).map( titleCase );
    var title = rest.map( capitalise ).join(' ');
    var slug = rest.join('-');
    var data = { title, tags, thumbnail: file };
    var destDir = `./content/work/${ i + 1 }_${ slug }`;
    var content = `Title: ${ title }

----

Thumbnail:

- ${ file }

----

Tags: ${ tags.join(', ') }`
    fs.mkdirSync( destDir )
    fs.writeFileSync( `${ destDir }/project.txt`, content, 'utf8' );
    fs.copyFileSync( `./work/${ file }`, `${ destDir }/${ file }` );
})