import filenames from '../../work_small/*.{png,gif,jpg}';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import tinycolor from 'tinycolor2';

export var nodes = Object.keys( filenames ).map( ( name, i ) => {
    var [ tags, ...rest ] = name.split('-');
    var src = Object.values( filenames[ name ] )[ 0 ]
    return {
        tags: tags.split('+').sort(),
        name: rest.join('-'),
        src,
        r: 40,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        id: i
    };
})

export var tags = uniq( flatten( nodes.map( ({ tags }) => tags ) ) );
export var byTag = Object.fromEntries( tags.map( tag => [
    tag,
    nodes.filter( n => n.tags.includes( tag ) )
]))

var c = () => Math.random();
var COLORS = [ '#FFDC98', '#BCDBFF', '#E2BCFF', '#C9FFBC', '#BABABA', '#FFBCF0', '#FFABAB' ].map( tinycolor )

export var colors = Object.fromEntries( tags.map( ( tag, i ) => [
    tag,
    // COLORS[ i ]
    tinycolor.fromRatio({ h: i / tags.length, s: 1, l: .5 })
]))