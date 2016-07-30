var fs = require('fs');
var grid = require( 'node-geojson-grid' );

var geoJson = JSON.parse(fs.readFileSync('geojson/10101.geojson', 'utf8'));

// console.log(geoJson['features'][0]);

var pointsGrid = grid.createPointsGrid(30, geoJson['features'][0], {});

console.log(JSON.stringify(pointsGrid));
