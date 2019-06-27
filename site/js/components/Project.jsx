import React from 'react';
import useFetch from '../hooks/useFetch';

var Project = ({ url }) => {
    var project = useFetch( url + '.json' );
    if ( project === null ) return null;
    var { title, thumbnail } = project;
    return (
        <div className="project">
            <img src={ thumbnail }/>
            <h1>{ title }</h1>
        </div>
    )
}
//     <div className="project">
//         { url }
//     </div>
// }

export default Project;