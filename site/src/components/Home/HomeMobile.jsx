import React, { useState } from 'react';
import bem from '../../utils/bem';
import { Link } from "react-router-dom";
import Image from '../Image';
import { useData } from '../Data';
import './HomeMobile.scss';

var HomeMobileThumbnail = ({ project, colors, showTags = true }) => (
    <Link className="home-mobile-thumbnail" to={ project.url }>
        <div className="home-mobile-thumbnail__image">
            <Image srcs={ project.thumbnail } ratio={ false } className='contain'/>
        </div>
        <div className="home-mobile-thumbnail__title">
            { project.title }
        </div>
        { showTags && (
            <div className="home-mobile-thumbnail__tags">
                { project.tags.map( tag => (
                    <div key={ tag } className="home-mobile-thumbnail__tag" style={{ '--color': colors[ tag ] }}/>
                )) }
            </div>
         ) }
    </Link>
)

var HomeMobile = () => {
    var data = useData();
    console.log( data );
    var [ filter, setFilter ] = useState( null );
    var about = data.projects[ data.projects.length - 1 ];
    var projects = data.projects.slice( 0, -1 );
    return (
        <div className="home-mobile">
            <div className="home-mobile__header">
                <HomeMobileThumbnail project={ about } colors={ data.colors } showTags={ false }/>
            </div>
            <div className="home-mobile__tags">
                { data.tags.filter( tag => tag !== about.tags[ 0 ] ).map( tag => (
                    <div
                        key={ tag }
                        className={ bem( 'home-mobile__tag', { selected: filter === null || filter === tag } )}
                        style={{ '--color': data.colors[ tag ] }}
                        onClick={ () => setFilter( filter === tag ? null : tag ) }
                    >
                        { filter === null
                            ? tag
                            : filter === tag
                                ? `${ tag } ×`
                                : ''
                        }
                    </div>
                )) }
            </div>
            <div className="home-mobile__thumbnails">
                { projects
                .filter( project => filter === null || project.tags.includes( filter ) )
                .map( project => (
                    <HomeMobileThumbnail key={ project.i } project={ project } colors={ data.colors }/>
                ))}
            </div>
        </div>
    )
}

export default HomeMobile