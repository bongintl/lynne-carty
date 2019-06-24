import React from 'react';
import { Link } from "react-router-dom";
import useFetch from '~/hooks/useFetch';

var Page = ({ match }) => {
    var data = useFetch( match.params.page + '.json' );
    if ( !data ) return 'Loading';
    console.log( data )
    return (
        <div>
            <h1>{ data.title }</h1>
            <p>{ data.tags.join(', ') }</p>
            <img src={ data.thumbnail }/>
            <Link to="/">Back</Link>
        </div>
    )
}

export default Page;