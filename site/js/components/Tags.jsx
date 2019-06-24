import React, { useState } from 'react';
import VennShader from './VennShader.jsx';
import useWindowSize from '~/hooks/useWindowSize';
import useSimulation from '~/hooks/useSimulation';
import Thumbnail from './Thumbnail'

var randomPosition = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
});

var Legend = ({ tags, colors, filter, setFilter }) => {
    var [ selected, setSelected ] = useState( null );
    return (
        <ul className="legend">
            { tags.map( tag => (
                <li
                    key={ tag }
                    className={ ( filter === null || filter === tag ) ? 'selected' : undefined }
                    style={{ '--color': colors[ tag ] }}
                    onMouseEnter={ () => setFilter( tag ) }
                    onMouseLeave={ () => setFilter( selected ) }
                    onClick={ () => setSelected( selected === tag ? null : tag ) }
                >{ tag }</li>
            )) }
        </ul>
    )
}

var Venn = ({ data, radius, initialPositions = data.projects.map( randomPosition ) }) => {
    var [ filter, setFilter ] = useState( null );
    var positions = useSimulation( data, radius, initialPositions );
    return (
        <React.Fragment>
            <VennShader data={ data } radius={ radius } positions={ positions }/>
            <Legend tags={ data.tags } colors={ data.colors } filter={ filter } setFilter={ setFilter }/>
            { data.projects
                .filter( project => filter === null || project.tags.includes( filter ) )
                .map( ( project, i ) => (
                    <Thumbnail key={ project.url } project={ project } position={ positions[ project.i ] }/>
                ))
            }
        </React.Fragment>
    )
}

var Grid = data => {
    
}

var Tags = props => {
    return useWindowSize[ 0 ] < 768
        ? <Grid { ...props }/>
        : <Venn { ...props }/>
}

export default Venn;