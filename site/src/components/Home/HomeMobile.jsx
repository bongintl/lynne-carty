import React, { useState, useRef, useCallback } from 'react';
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

var Tag = ({ tag, color, filter, setFilter, scrollToTop }) => {
    var className = bem( 'home-mobile__tag', { selected: filter === null || filter === tag } );
    var text = filter === null
        ? tag
        : filter === tag
            ? `${ tag } ×`
            : ''
    var onClick = useCallback(
        () => {
            setFilter( prevFilter => prevFilter === tag ? null : tag );
            scrollToTop();
        },
        [ setFilter, scrollToTop, tag ]
    )
    return (
        <div
            className={ className }
            style={{ '--color': color }}
            onClick={ onClick }
        >{ text }</div>
    )
}

var HomeMobile = () => {
    var data = useData();
    var [ filter, setFilter ] = useState( null );
    var about = data.projects[ data.projects.length - 1 ];
    var projects = data.projects.slice( 0, -1 );
    var headerRef = useRef();
    var scrollToTop = useCallback(
        () => window.scrollTo({
            top: headerRef.current.getBoundingClientRect().bottom + window.pageYOffset,
            behavior: 'smooth'
        }),
        [ headerRef ]
    )
    return (
        <div className="home-mobile">
            <div className="home-mobile__header" ref={ headerRef }>
                <HomeMobileThumbnail project={ about } colors={ data.colors } showTags={ false }/>
            </div>
            <div className="home-mobile__tags">
                { data.tags.filter( tag => tag !== about.tags[ 0 ] ).map( tag => (
                    <Tag
                        key={ tag }
                        tag={ tag }
                        filter={ filter }
                        setFilter={ setFilter }
                        color={ data.colors[ tag ] }
                        scrollToTop={ scrollToTop }
                    />
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