import React, { useState } from 'react';
import Thumbnail from '../Thumbnail/Thumbnail';
import Legend from './Legend';
import VennShader from '../Venn'
import { useData } from '../Data';
import useWindowSize from '~/hooks/useWindowSize';
import useIsMobile from '~/hooks/useIsMobile';

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