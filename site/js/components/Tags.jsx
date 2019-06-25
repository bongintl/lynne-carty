import React, { useState } from 'react';
import VennShader from './VennShader.jsx';
import useWindowSize from '~/hooks/useWindowSize';
import useSimulation from '~/hooks/useSimulation';
import Thumbnail from './Thumbnail'

var randomPosition = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() < .1 ? 80 : 40
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

var Venn = ({ data, initialPositions = data.projects.map( randomPosition ) }) => {
    var [ filter, setFilter ] = useState( null );
    var positions = useSimulation( data, initialPositions );
    var layers = Object.entries( data.byTag ).map( ([ tag, idxs ]) => ({
        color: data.colors[ tag ],
        positions: idxs.map( i => positions[ i ] )
    }));
    return (
        <React.Fragment>
            <VennShader layers={ layers }/>
            <Legend tags={ data.tags } colors={ data.colors } filter={ filter } setFilter={ setFilter }/>
            { data.projects
                .filter( project => filter === null || project.tags.includes( filter ) )
                .map( ( project, i ) => {
                    var position = positions[ project.i ];
                    return (
                        <Thumbnail
                            key={ project.url }
                            project={ project }
                            x={ position.x }
                            y={ position.y }
                            r={ position.r }
                        />
                    )
                })
            }
        </React.Fragment>
    )
}

export default Venn;