import { useState, useEffect, useMemo } from 'react';
import useFetch from './useFetch';
import getColor from '~/utils/getColor';
import tinycolor from 'tinycolor2';

export default () => {
    var data = useFetch( './home.json' );
    var [ projectColors, setProjectColors ] = useState( null );
    useEffect( () => {
        if ( !data ) return;
        Promise.all( data.projects
            .map( project => getColor( project.pixel ) )
        ).then( setProjectColors )
    }, [ data ] )
    return useMemo(() => {
        if ( data === null || projectColors === null ) return null;
        var { projects, tags } = data;
        projects = projects.map( ( project, i ) => ({
            ...project,
            i,
            color: projectColors[ i ]
        }))
        return {
            projects,
            tags: tags.map( ({ name }) => name ),
            byTag: Object.fromEntries( tags.map( tag => [
                tag.name,
                projects
                    .map( ( project, i ) => ({ project, i }) )
                    .filter( ({ project }) => project.tags.includes( tag.name ) )
                    .map(( { project, i }) => i )
            ])),
            colors: Object.fromEntries( tags.map( tag => [
                tag.name,
                tinycolor( tag.color )
            ]))
        }
    }, [ data, projectColors ] );
}