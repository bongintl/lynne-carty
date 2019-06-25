import React, { useState } from 'react';
import Thumbnail from './Thumbnail';
import Legend from './Legend';
import Nav from './Nav';
import VennShader from './VennShader'
import useData from '~/hooks/useData';
import useSimulation from '~/hooks/useSimulation';

var groupLayers = ( positions, byTag, colors ) => (
    Object.entries( byTag ).map( ([ tag, idxs ]) => ({
        color: colors[ tag ],
        positions: idxs.map( i => positions[ i ] )
    }))
)

var Home = ({ data }) => {
    var [ mode, setMode ] = useState( 'tags' );
    var [ filter, setFilter ] = useState( null );
    var positions = useSimulation( data.projects )
    return (
        <React.Fragment>
            <VennShader layers={ groupLayers( positions, data.byTag, data.colors ) }/>
            <Nav setMode={ setMode }/>
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
                        />
                    )
                })
            }
        </React.Fragment>
    )
}

var withData = Component => props => {
    var data = useData();
    if ( data === null ) return null;
    return <Component data={ data } { ...props }/>
}

export default withData( Home );