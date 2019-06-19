import tinycolor from 'tinycolor2';

var cache = {};
var canvas = document.createElement( 'canvas' );
canvas.width = canvas.height = 1;
var ctx = canvas.getContext('2d');

export default src => new Promise( resolve => {
    var image = new Image();
    image.onload = () => {
        ctx.drawImage( image, 0, 0 );
        var { data } = ctx.getImageData( 0, 0, 1, 1 );
        var [ r, g, b ] = data;
        var color = tinycolor({ r, g, b }).toHsl();
        cache[ src ] = color;
        resolve( color );
    }
    image.src = src;
})