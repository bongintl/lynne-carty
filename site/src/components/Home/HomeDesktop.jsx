import React, { useState } from 'react';
import bem from '../../utils/bem';
import Thumbnail from '../Thumbnail/Thumbnail';
import VennShader from '../Venn'
import { useData } from '../Data';
import useWindowSize from '~/hooks/useWindowSize';
import './HomeDesktop.scss';

var isTouch = 'ontouchstart' in window;

var Legend = ({ tags, colors, filter, setFilter }) => {
    var [ selected, setSelected ] = useState( null );
    return (
        <ul className="legend">
            { tags.map( tag => (
                <li
                    className={ bem( "legend__item", { selected: filter === null || filter === tag } ) }
                    key={ tag }
                    style={{ '--color': colors[ tag ] }}
                    onMouseEnter={ isTouch ? undefined : () => setFilter( tag ) }
                    onMouseLeave={ isTouch ? undefined : () => setFilter( selected ) }
                    onClick={ isTouch
                        ? () => setFilter( filter === tag ? null : tag )
                        : () => setSelected( selected === tag ? null : tag )
                    }
                >
                    { tag }
                    { tag === selected && ' ×' }
                </li>
            )) }
        </ul>
    )
}

var HomeDesktop = () => {
    var windowSize = useWindowSize();
    var data = useData();
    var [ filter, setFilter ] = useState( null );
    var [ title, setTitle ] = useState( null )
    return (
        <div className="home-desktop">
            <VennShader size={ windowSize }/>
            <div className="home-desktop__title">{ title }</div>
            <div className="home-desktop__thumbnails">
                { data.projects.map( project => (
                    <Thumbnail
                        key={ project.url }
                        project={ project }
                        colors={ data.colors }
                        visible={ filter === null || project.tags.includes( filter ) }
                        setTitle={ setTitle }
                    />
                )) }
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
export default HomeDesktop;