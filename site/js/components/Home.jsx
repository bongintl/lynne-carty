import React, { useState, useContext } from 'react';
import Thumbnail from './Thumbnail';
import Legend from './Legend';
import VennShader from './VennShader'
import DataContext from './DataContext';
import useSimulation from '../hooks/useSimulation';
import bem from '../utils/bem';

var groupLayers = ( positions, byTag, colors ) => (
    Object.entries( byTag ).map( ([ tag, idxs ]) => ({
        color: colors[ tag ],
        positions: idxs.map( i => positions[ i ] )
    }))
)

var Home = ({ match }) => {
    var data = useContext( DataContext );
    var running = true;//match.isExact;
    var [ filter, setFilter ] = useState( null );
    var positions = useSimulation( data.projects, running );
    return (
        <div className={ bem( 'home', { inactive: !running } ) }>
            <VennShader layers={ groupLayers( positions, data.byTag, data.colors ) }/>
            <Legend
                tags={ Object.keys( data.byTag ) }
                colors={ data.colors }
                filter={ filter }
                setFilter={ setFilter }
            />
            { data.projects
                .filter( project => filter === null || project.tags.includes( filter ) )
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
                        />
                    )
                })
            }
        </div>
    )
}
export default Home;