import React from 'react';
import useFetch from '../hooks/useFetch';
import Image from './Image';

var Project = ({ url }) => {
    var project = useFetch( url + '.json' );
    if ( project === null ) return null;
    var { title, mainImage } = project;
    return (
        <div className="project">
            <Image srcs={ mainImage }/>
            <h1>{ title }</h1>
        </div>
    )
}
//     <div className="project">
//         { url }
//     </div>
// }

export default Project;