import React from 'react';
import useFetch from '~/hooks/useFetch';
import { useVisit } from '../Visited';
import Image from '../Image';
import Vimeo from '@u-wave/react-vimeo';
import bem from '~/utils/bem';
import './Project.scss';

var orientation = srcs => srcs[ 0 ].w > srcs[ 0 ].h ? 'landscape' : 'portrait';

var ProjectImage = ({ srcs }) => (
    <div className={ bem( 'project__image', orientation( srcs ) ) }>
        <Image srcs={ srcs }/>
    </div>
)

var Project = ({ title, url, isCurrent }) => {
    var project = useFetch( url + '.json' );
    useVisit( url, isCurrent );
    return (
        <div className={ bem( 'project', { current: isCurrent } )}>
            <div className="project__header">
                <h1>{ title }</h1>
            </div>
            { project && (
                <div className="project__content">
                    { project.video ? (
                        <div className={ bem( 'project__image', 'landscape' ) }>
                            <Vimeo video={ project.video } responsive={ true } className="vimeo"/>
                        </div>
                    ) : (
                        <ProjectImage srcs={ project.mainImage }/>
                    ) }
                    <div className="project__body" dangerouslySetInnerHTML={{ __html: project.body }}/>
                    <ul className="credits">
                        { project.credits && project.credits.map( ( { role, name }, i ) => (
                            <li className="credit" key={ i }>
                                <div className="credit__role">{ role }</div>
                                <div className="credit__name">{ name }</div>
                            </li>
                        ))}
                    </ul>
                    { project.additionalImages.map( ( srcs, i ) => (
                        <ProjectImage key={ i } srcs={ srcs }/>
                    )) }
                </div>
            ) }
        </div>
    )
}

export default Project;