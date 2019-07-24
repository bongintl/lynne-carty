import React, { useRef, useState } from 'react';
import Thumbnail from '../Thumbnail/Thumbnail';
import Legend from './Legend';
import VennShader from '../Venn'
import { useData } from '../Data';
import { useTick } from '../Simulation';
import useWindowSize from '~/hooks/useWindowSize';
import useIsMobile from '~/hooks/useIsMobile';
import './Home.scss';

var Sizer = () => {
    var ref = useRef();
    useTick( simulation => {
        if ( !ref.current ) return;
        var max = Math.max( ...simulation.nodes().map( n => n.y + n.r ) );
        ref.current.style.height = max + 20 + 'px';
    }, [ ref ] )
    return <div ref={ ref }/>
}

var Home = () => {
    var windowSize = useWindowSize();
    var isMobile = useIsMobile();
    var data = useData();
    var [ filter, setFilter ] = useState( null );
    var [ title, setTitle ] = useState( null )
    return (
        <div className="home">
            { !isMobile && <VennShader size={ windowSize }/> }
            { !isMobile && <div className="home__title">{ title }</div> }
            <div className="home__thumbnails">
                { isMobile && <Sizer/> }
                { data.projects
                    .map( project => {
                        return (
                            <Thumbnail
                                key={ project.url }
                                project={ project }
                                colors={ data.colors }
                                visible={ filter === null || project.tags.includes( filter ) }
                                setTitle={ setTitle }
                            />
                        )
                    })
                }
            </div>
            <Legend
                tags={ Object.keys( data.byTag ) }
                colors={ data.colors }
                filter={ filter }
                setFilter={ setFilter }
            />
        </div>
    )
}
export default Home;