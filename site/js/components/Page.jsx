import React from 'react';
import { Link } from "react-router-dom";
import useFetch from '~/hooks/useFetch';

var Page = ({ match }) => {
    var data = useFetch( match.params.page + '.json' );
    console.log( data );
    return (
        <div>
            { match.params.page }
            <Link to="/">Back</Link>
        </div>
    )
}

export default Page;