import React, { useMemo } from 'react';
import Thumbnail from './Thumbnail.jsx';
import useWindowSize from '~/hooks/useWindowSize';
import range from 'lodash/range';
import useColor from '~/hooks/useColor';

var hueGradient = ( lightness, steps = 7 ) => range( 0, steps )
    .map( i => `hsl( ${ ( i / ( steps - 1 ) ) * 360 }, 100%, ${ lightness * 100 }% )`)
    .join(', ')
    
var lightnessGradient = ( hue, steps = 3 ) => range( 0, steps )
    .map( i => `hsl( ${ hue * 360 }, 100%, ${ ( i / ( steps - 1 ) ) * 100 }% )`)
    .join(', ')
    
var Row = ({ y, rows }) => (
    <div key={ `row_${ y }` } style={{
        position: 'absolute',
        left: 0,
        top: `${ ( y / rows ) * 100 }%`,
        width: '100%',
        height: '1px',
        background: `linear-gradient( to right, ${ hueGradient( 1 - y / rows ) } )`
    }}/>
)

var Column = ({ x, columns }) => (
    <div key={ `col_${ x }` } style={{
        position: 'absolute',
        left: `${ ( x / columns ) * 100 }%`,
        top: 0,
        width: '1px',
        height: '100%',
        background: `linear-gradient( to top, ${ lightnessGradient( x / columns ) } )`
    }}/>
)

var Grid = () => {
    var cellSize = 50;
    var windowSize = useWindowSize();
    var columns = Math.floor( windowSize[ 0 ] / cellSize );
    var rows = Math.floor( windowSize[ 1 ] / cellSize );
    return useMemo( () => [
        ...range( 1, rows ).map( y => <Row key={ `row_${ y }` } y={ y } rows={ rows }/> ),
        ...range( 1, columns ).map( x => <Column key={ `col_${ x }` } x={ x } columns={ columns }/> )
    ], [ columns, rows ] )
}

var ColorThumbnail = ({ project }) => {
    var windowSize = useWindowSize();
    var rand = useMemo( Math.random, [] );
    var { h, l } = project.color;
    if ( h === 0 ) h = rand * 360
    var x = ( h / 360 ) * windowSize[ 0 ];
    var y = l * windowSize[ 1 ];
    return <Thumbnail project={ project } position={ { x, y } }/>
}

var Color = ({ data }) => (
    <React.Fragment>
        <Grid/>
        { data.projects.map( project => <ColorThumbnail key={ project.url } project={ project }/>) }
    </React.Fragment>
)

export default Color