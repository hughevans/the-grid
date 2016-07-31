var Isomer = require('isomer');

import React, { Component } from 'react';
import areas from './areas.json';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App" ref={(c) => this._container = c}>
        <canvas ref={(c) => this._canvas = c} />
      </div>
    );
  }

  componentDidMount() {
    var width = this._container.offsetWidth;
    var height = this._container.offsetHeight;

    this._canvas.style.width = width + 'px';
    this._canvas.style.height = height + 'px';

    // 2x for retina displays
    this._canvas.width = 2 * width;
    this._canvas.height = 2 * height;

    var iso = new Isomer(this._canvas);

    var Point  = Isomer.Point;
    var Path   = Isomer.Path;
    var Shape  = Isomer.Shape;
    var Vector = Isomer.Vector;
    var Color  = Isomer.Color;

    var red = new Color(160, 60, 50);
    var blue = new Color(50, 60, 160);
    var yellow = new Color(205, 211, 31);
    var brown = new Color(0, 0, 0); // actually black
    var green = new Color(63, 160, 50);

    var white = new Color(255, 255, 255);

    var area = areas['60201'];

    console.log(area);

    var count = 0;
    area['matrix'].forEach(function(row, row_index) {
      row.forEach(function(tile, tile_index) {
        if (tile === 1) {
          var color = white;

          if (count < area.blueTiles) {
            color = blue;
          } else if (count < (area.blueTiles + area.redTiles)) {
            color = red;
          } else if (count < (area.blueTiles + area.redTiles + area.yellowTiles)) {
            color = yellow;
          } else if (count < (area.blueTiles + area.redTiles + area.yellowTiles + area.brownTiles)) {
            color = brown;
          } else if (count < (area.blueTiles + area.redTiles + area.yellowTiles + area.brownTiles + area.greenTiles)) {
            color = green;
          }

          count++;

          // I occasionally get one too many
          if (count <= area.tileCount) {
            iso.add(Shape.Prism(new Point(row_index, tile_index, 0), 1, 1, 0.08), color);
          }
        }
      });
    });

    // iso.add(Shape.Prism(new Point(12, 12, 0), 1, 1, 0.08), blue)
    // iso.add(Shape.Prism(new Point(1, 12, 0), 1, 1, 0.08), red)
    // iso.add(Shape.Prism(new Point(3, 2, 0), 1, 1, 0.08), blue)
    // iso.add(Shape.Prism(new Point(0, 0, 0), 1, 1, 0.08), red)
    // iso.add(Shape.Prism(new Point(1, 1, 0), 1, 1, 0.08), blue)
  }
}

export default App;
