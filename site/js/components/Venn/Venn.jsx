import React, { useState } from 'react';
import VennShader from './VennShader.jsx';
import useSimulation from './useSimulation';
import Thumbnail from '../Thumbnail/Thumbnail'

var randomPosition = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
});

var Legend = ({ tags, colors, onHover }) => (
    <ul className="legend">
        { tags.map( tag => (
            <li
                style={{ '--color': colors[ tag ] }}
                onMouseEnter={ () => onHover( tag ) }
                onMouseLeave={ () => onHover( null ) }
            >{ tag }</li>
        )) }
    </ul>
)

var Venn = ({ data, initialPositions = data.projects.map( randomPosition ) }) => {
    var [ filter, setFilter ] = useState( null );
    var radius = 40;
    var positions = useSimulation( data.projects, radius, initialPositions );
    return (
        <React.Fragment>
            <VennShader data={ data } radius={ radius } positions={ positions }/>
            <Legend tags={ data.tags } colors={ data.colors } onHover={ setFilter }/>
            { data.projects
                .filter( project => filter === null || project.tags.includes( filter ) )
                .map( ( project, i ) => (
                    <Thumbnail project={ project } position={ positions[ i ] }/>
                ))
            }
        </React.Fragment>
    )
    
}

export default Venn;