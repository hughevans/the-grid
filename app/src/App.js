var Isomer = require('isomer');

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <canvas width="1600" height="1200" className="the-grid" ref={(c) => this._theGrid = c} />
      </div>
    );
  }

  componentDidMount() {
    var iso = new Isomer(this._theGrid);

    var Shape = Isomer.Shape;
    var Point = Isomer.Point;

    var blue = new Isomer.Color(50, 60, 160);
    var cube = Shape.Prism(Point.ORIGIN);
    iso.add(cube.scale(Point.ORIGIN, 1, 1, 0.1), blue);
  }
}

export default App;
