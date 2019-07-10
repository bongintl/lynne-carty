import React from 'react';
import useFetch from '~/hooks/useFetch';
import { useVisit } from '../Visited';
import Image from '../Image';
import Vimeo from '@u-wave/react-vimeo';

var ProjectContent = React.memo( ({ project }) => (
    <div className="project">
        <div className="project__header">
            <h1>{ project.title }</h1>
        </div>
        <div className="project__body">
            { project.video ? (
                <Vimeo video={ project.video } responsive={ true } className="vimeo"/>
            ) : (
                <Image srcs={ project.mainImage }/>
            ) }
            <div dangerouslySetInnerHTML={{ __html: project.body }}/>
            <ul className="credits">
                { project.credits && project.credits.map( ( { role, name }, i ) => (
                    <li className="credit" key={ i }>
                        <div className="credit__role">{ role }</div>
                        <div className="credit__name">{ name }</div>
                    </li>
                ))}
            </ul>
            { project.additionalImages.map( ( srcs, i ) => (
                <Image key={ i } srcs={ srcs }/>
            )) }
        </div>
    </div>
))

ProjectContent.displayName = 'ProjectContent';

var Project = ({ url, isCurrent }) => {
    var project = useFetch( url + '.json' );
    // debugger
    useVisit( url, isCurrent );
    if ( project === null ) return null;
    return <ProjectContent project={ project }/>
}

export default Project;