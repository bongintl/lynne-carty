import React from 'react';
import { Link } from 'react-router-dom';
import { basename } from '../App';
import useFetch from '~/hooks/useFetch';
import { useVisit } from '../Visited';
import Image from '../Image';
import Vimeo from '@u-wave/react-vimeo';
import bem from '~/utils/bem';
import './Project.scss';
import urlJoin from 'url-join';

var orientation = srcs => srcs[ 0 ].w > srcs[ 0 ].h ? 'landscape' : 'portrait';

var ProjectImage = ({ srcs }) => (
    <div className={ bem( 'project__image', orientation( srcs ) ) }>
        <Image srcs={ srcs }/>
    </div>
)

var Credits = ({ credits }) => (
    <ul className="credits">
        { credits.map( ( { role, name }, i ) => (
            <li className="credit" key={ i }>
                <div className="credit__role">{ role }</div>
                <div className="credit__name">{ name }</div>
            </li>
        )) }
    </ul>
)

var ProjectContents = ({ video, autoplay, mainImage, body, credits, additionalImages }) => (
    <>
        { video ? (
            <div className={ bem( 'project__image', 'landscape' ) }>
                <Vimeo
                    className="vimeo"
                    video={ video }
                    responsive={ true }
                    autoplay={ autoplay }
                    background={ autoplay }
                    controls={ !autoplay }
                    volume={ autoplay ? 0 : 1 }
                    loop={ autoplay }
                />
            </div>
        ) : (
            <ProjectImage srcs={ mainImage }/>
        ) }
        <div className="project__body">
            <div dangerouslySetInnerHTML={{ __html: body }}/>
            { credits.length ? <Credits credits={ credits }/> : null }
        </div>
        { additionalImages.map( ( srcs, i ) => (
            <ProjectImage key={ i } srcs={ srcs }/>
        )) }
    </>
)

var AboutContents = ({ mainImage, bio, resume, contact }) => (
    <>
        <div className="project__image project__image--headshot">
            <Image srcs={ mainImage }/>
        </div>
        <div className="project__body">
            <div dangerouslySetInnerHTML={{ __html: bio }}/>
            <div className="cv">
                { resume.map( ({ dates, job }, i ) => (
                    <div className="cv__row" key={ i }>
                        <div className="cv__dates">{ dates }</div>
                        <div className="cv__job">{ job }</div>
                    </div>
                ))}
            </div>
            <div dangerouslySetInnerHTML={{ __html: contact }}/>
        </div>
    </>
)

var Contents = ({ type, ...rest }) => type === 'about'
    ? <AboutContents { ...rest }/>
    : <ProjectContents { ...rest }/>

var Project = ({ title, url, offset }) => {
    var project = useFetch( urlJoin( basename, `${ url }.json` ) );
    var isCurrent = offset === 0;
    useVisit( url, isCurrent );
    var className = bem( 'project', {
        current: isCurrent,
        'off-left': offset < 0,
        'off-right': offset > 0
    })
    return (
        <div className={ className }>
            <Link className="project__header" to="/">
                <h1>{ title }</h1>
            </Link>
            <div className="project__content">
                { project && <Contents { ...project }/> }
            </div>
        </div>
    )
}

export default Project;