var fs = require('fs');
var turf = require('turf');

var areas = JSON.parse(fs.readFileSync('../data/areas.json', 'utf8'));
var newJson = {};

areas['areas'].forEach(function(area) {
  var geoJsonPath = 'geojson/' + area['code'] + '.geojson';
  try {
    fs.accessSync(geoJsonPath, fs.F_OK);

    var geoJson = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'));
    var feature = geoJson['features'][0];
    var points = area['tileCount'];

    var bbox = turf.extent(feature);
    var poly = turf.bboxPolygon(bbox);
    var polyArea = turf.area(feature);
    var bboxArea = turf.area(poly);
    var ratio = bboxArea / polyArea;
    var adjustedPoints = Math.ceil(points * ratio);

    var mpp = Math.ceil(Math.sqrt(bboxArea / adjustedPoints));

    var bbox = turf.extent(feature);
    var fc = turf.featurecollection([feature]);
    var gridPoints = turf.pointGrid(bbox, mpp * 0.001, 'kilometers');

    var matrix = [];
    var row = -1;
    var rowCoordinate = 0;

    gridPoints['features'].forEach(function(point) {
      var coordinates = point['geometry']['coordinates'];

      if (coordinates[0] != rowCoordinate) {
        row++;
        rowCoordinate = coordinates[0];
        matrix.push([]);
      }

      matrix[row].push(coordinates);
    });

    var sparseMatrix = []

    for(var i = 0; i < matrix.length; i++) {
      sparseMatrix[i] = [];
      for(var j = 0; j < matrix[0].length; j++) {
        sparseMatrix[i][j] = undefined;
      }
    }

    var filteredPoints = turf.within(gridPoints, fc);

    matrix.forEach(function(row, index) {
      row.forEach(function(coordinates, rowIndex) {
        var found = 0;
        filteredPoints['features'].forEach(function(point) {
          if (point['geometry']['coordinates'] === coordinates) {
            found = 1;
          }
        });
        sparseMatrix[index][rowIndex] = found;
      });
    });
  } catch (e) {
    var sparseMatrix = [[1, 1][1, 1]];
  }

  // console.log(sparseMatrix);
  newJson[area['code']] = Object.assign({ matrix: sparseMatrix }, area);

  // var newGeoJson = turf.combine(filteredPoints);
});

var jsonfile = require('jsonfile');

var file = '../app/src/areas.json';

jsonfile.writeFile(file, newJson, function(err) {
  console.error(err);
});
