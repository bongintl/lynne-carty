var gr8 = require('gr8');

process.stdout.write( gr8({
    breakpoints: {
        // s: '( --small )',
        m: '( --medium )',
        l: '( --large )',
        xl: '( --xlarge )'
    },
    breakpointSelector: 'class',
    exclude: [ 'margin', 'padding', 'fontSize', 'placement' ],
    utils: [{
        prop: [
            'margin',
            'margin-top',
            'margin-bottom',
            'margin-left',
            'margin-right',
            { mx: [ 'margin-left', 'margin-right' ] },
            { my: [ 'margin-top', 'margin-bottom' ] },
            'padding',
            'padding-top',
            'padding-bottom',
            'padding-left',
            'padding-right',
            { px: [ 'padding-left', 'padding-right' ] },
            { py: [ 'padding-top', 'padding-bottom' ] },
        ],
        vals: [ 0, 0.5, 1, 2, 3, 4 ],
        transform: x => `calc( ${ x } * var( --line ) )`
    },{
        prop: 'border-radius',
        vals: { 50: '50%', max: '100vw' }
    },{
        prop: ['top', 'left', 'bottom', 'right'],
        vals: [ 0, 50, 100 ],
        unit: '%'
    },{
        prop: "object-fit",
        vals: { cv: 'cover', cn: 'contain' }
    },{
        prop: { tx: 'transform' },
        vals: [ -100, -50, 0, 50, 100 ],
        transform: v => `translateX( ${ v }% )`
    },{
        prop: { ty: 'transform' },
        vals: [ -100, -50, 0, 50, 100 ],
        transform: v => `translateY( ${ v }% )`
    },{
        prop: { txy: 'transform' },
        vals: [ -100, -50, 0, 50, 100 ],
        transform: v => `translate( ${ v }%, ${ v }% )`
    },{
        raw: {
            fill: "position: absolute; top: 0; left: 0; width: 100%; height: 100%",
        }
    }]
}) )