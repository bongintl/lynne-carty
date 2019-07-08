import React, { useState, useContext } from 'react';
import Thumbnail from './Thumbnail';
import Legend from './Legend';
import VennShader from './VennShader'
import { useData } from './Data';
import { useSimulation } from './Simulation'
import bem from '../utils/bem';

var groupLayers = ( positions, byTag, colors ) => (
    Object.entries( byTag ).map( ([ tag, idxs ]) => ({
        color: colors[ tag ],
        positions: idxs.map( i => positions[ i ] )
    }))
)

var Home = ({ match }) => {
    var data = useData();
    var [ filter, setFilter ] = useState( null );
    var [ title, setTitle ] = useState( null )
    var positions = useSimulation();
    return (
        <div className='home'>
            <VennShader layers={ groupLayers( positions, data.byTag, data.colors ) }/>
            <div className="home__title">{ title }</div>
            <Legend
                tags={ Object.keys( data.byTag ) }
                colors={ data.colors }
                filter={ filter }
                setFilter={ setFilter }
            />
            { data.projects
                // .filter( project => filter === null || project.tags.includes( filter ) )
                .map( project => {
                    var position = positions[ project.i ];
                    return (
                        <Thumbnail
                            key={ project.url }
                            project={ project }
                            x={ position.x }
                            y={ position.y }
                            r={ position.r }
                            colors={ data.colors }
                            visible={ filter === null || project.tags.includes( filter ) }
                            onMouseEnter={ () => setTitle( project.title ) }
                            onMouseLeave={ () => setTitle( null ) }
                        />
                    )
                })
            }
        </div>
    )
}
export default Home;