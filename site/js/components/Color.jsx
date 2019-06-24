import React, { useMemo } from 'react';
import Thumbnail from './Thumbnail.jsx';
import useWindowSize from '~/hooks/useWindowSize';
import range from 'lodash/range';
import useColor from '~/hooks/useColor';

var map = ( x, oldMin, oldMax, newMin, newMax ) => (
    newMin + ( x - oldMin ) / ( oldMax - oldMin ) * ( newMax - newMin )
)

var hueGradient = ( lightness, steps = 7 ) => range( 0, steps )
    .map( i => `hsl( ${ ( i / ( steps - 1 ) ) * 360 }, 100%, ${ lightness * 100 }% )`)
    .join(', ')
    
var lightnessGradient = ( hue, steps = 3 ) => range( 0, steps )
    .map( i => `hsl( ${ hue * 360 }, 100%, ${ ( i / ( steps - 1 ) ) * 100 }% )`)
    .join(', ')
    
var Row = ({ y, t }) => (
    <div key={ `row_${ y }` } style={{
        position: 'absolute',
        left: 0,
        top: y + 'px',
        width: '100%',
        height: '1px',
        background: `linear-gradient( to right, ${ hueGradient( 1 - t ) } )`
    }}/>
)

var Column = ({ x, t }) => (
    <div key={ `col_${ x }` } style={{
        position: 'absolute',
        left: x + 'px',
        top: 0,
        width: '1px',
        height: '100%',
        background: `linear-gradient( to top, ${ lightnessGradient( t ) } )`
    }}/>
)

var Grid = ({ radius }) => {
    var cellSize = 50;
    var windowSize = useWindowSize();
    return useMemo( () => {
        var columns = Math.floor( windowSize[ 0 ] / cellSize );
        var rows = Math.floor( windowSize[ 1 ] / cellSize );
        return [
            ...range( 0, rows ).map( row => {
                var y = map( row, 0, rows - 1, radius, windowSize[ 1 ] - radius );
                var t = map( row, 0, rows - 1, 0, 1 );
                return <Row key={ `row_${ row }` } y={ y } t={ t }/>
            }),
            ...range( 0, columns ).map( column => {
                var x = map( column, 0, columns - 1, radius, windowSize[ 0 ] - radius );
                var t = map( column, 0, columns - 1, 0, 1 );
                return <Column key={ `col_${ column }` } x={ x } t={ t }/>
            })
        ]
    }, [ windowSize ] )
}

var ColorThumbnail = ({ project, radius }) => {
    var windowSize = useWindowSize();
    var rand = useMemo( Math.random, [] );
    var { h, l } = project.color;
    if ( h === 0 ) h = rand * 360
    var x = map( h, 0, 360, radius, windowSize[ 0 ] - radius );
    var y = map( l, 0, 1, radius, windowSize[ 1 ] - radius );
    return <Thumbnail project={ project } position={ { x, y } }/>
}

var Color = ({ data, radius }) => (
    <React.Fragment>
        <Grid radius={ radius }/>
        { data.projects.map( project => (
            <ColorThumbnail key={ project.url } project={ project } radius={ radius }/>
        )) }
    </React.Fragment>
)

export default Color