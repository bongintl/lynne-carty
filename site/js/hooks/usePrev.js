import { useRef } from 'react';

export default function usePrev ( value, initial = value ) {
    var ref = useRef( initial );
    var prev = ref.current;
    ref.current = value;
    return prev;
}