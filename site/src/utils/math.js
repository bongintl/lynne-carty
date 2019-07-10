export var sum = xs => xs.reduce( ( a, b ) => a + b, 0 );
export var mean = xs => sum( xs ) / xs.length;
export var clamp = ( x, min, max ) => Math.max( Math.min( x, max ), min );
export var lerp = ( a, b, t ) => a + ( b - a ) * t;