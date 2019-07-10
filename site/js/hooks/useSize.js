import { useState, useLayoutEffect } from 'react';
import createObserver from '../utils/observer';
import ResizeObserver from 'resize-observer-polyfill';

var { observe, unobserve } = createObserver( ResizeObserver );

var useSize = ref => {
    var [ size, setSize ] = useState( null );
    useLayoutEffect(() => {
        var el = ref.current;
        var onChange = entry => setSize([ entry.contentRect.width, entry.contentRect.height ])
        observe( el, onChange );
        return () => unobserve( el, onChange );
    }, [ ref.current ] );
    return size;
}

export default useSize