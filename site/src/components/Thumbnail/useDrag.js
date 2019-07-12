import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { useNodeUpdate } from '../Simulation';
import vec2 from '~/utils/vec2';

var getCenter = el => {
    var { top, left, width, height } = el.getBoundingClientRect();
    return vec2( left + width / 2, top + height / 2 );
}

export var useDrag = ({ onDrag, onEnd, onClick }) => {
    
    var [ dragging, setDragging ] = useState( false );
    var startPosition = useRef();
    var offset = useRef();
    
    var onMouseDown = useCallback( e => {
        e.preventDefault();
        var p = vec2( e.clientX, e.clientY );
        var c = getCenter( e.target );
        startPosition.current = c;
        offset.current = vec2.sub( c, p );
        onDrag( c );
        setDragging( true );
    }, [ startPosition, onDrag ]);

    useLayoutEffect( () => {
        if ( !dragging ) return;
        var onMouseMove = e => {
            e.preventDefault();
            onDrag( vec2.add( offset.current, vec2( e.clientX, e.clientY ) ) );
        }
        var onMouseUp = e => {
            e.preventDefault();
            var p = vec2.add( vec2( e.clientX, e.clientY ), offset.current );
            var d = vec2.len( vec2.sub( p, startPosition.current ) );
            setDragging( false );
            onEnd();
            if ( d < 10 ) onClick();
        }
        window.addEventListener( 'mousemove', onMouseMove );
        window.addEventListener( 'mouseup', onMouseUp );
        return () => {
            window.removeEventListener( 'mousemove', onMouseMove );
            window.removeEventListener( 'mouseup', onMouseUp );
        }
    }, [ dragging, onDrag, onEnd, onClick ] );

    return onMouseDown;

}

export var useDragNode = ({
    index,
    onClick,
    onUpdate
}) => {

    var position = useRef( null );
    var prevPosition = useRef( null );

    var onMouseEnter = useCallback( e => {
        position.current = getCenter( e.target );
    }, [ position ] )

    var onMouseLeave = useCallback( () => {
        position.current = null;
    }, [ position ] )

    var onMouseDown = useDrag({
        onDrag: p => {
            prevPosition.current = position.current;
            position.current = p;
        },
        onEnd: () => position.current = prevPosition.current = null,
        onClick
    })

    useNodeUpdate( index, node => {
        if ( !node ) return;
        var p = position.current;
        var prev = prevPosition.current;
        if ( p ) {
            vec2.copy( node, p );
            if ( prev ) {
                var d = vec2.sub( p, prev );
                node.vx = d.x;
                node.vy = d.y;
            } else {
                node.vx = node.vy = 0;
            }
        }
        onUpdate( node );
    }, [ position, prevPosition, onUpdate ] );

    return { onMouseEnter, onMouseLeave, onMouseDown };

}