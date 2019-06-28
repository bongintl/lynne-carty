import { useState, useEffect, useMemo } from 'react';
import useFetch from './useFetch';
import tinycolor from 'tinycolor2';

export default () => {
    var data = useFetch( './home.json' );
    return useMemo(() => {
        if ( data === null ) return null;
        var { projects, tags } = data;
        projects = projects.map( ( project, i ) => ({ ...project, i }) )
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
    }, [ data ] );
}