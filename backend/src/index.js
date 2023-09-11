const express = require('express');
const serverless = require('serverless-http');
const app = express();
const cors = require('cors');
const geojson = require('geojson');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

app.use(cors());

// read from the file system
const stationsStr = fs.readFileSync(path.resolve(__dirname, '../stations.csv')).toString();

// convert to an array of arrays
const stations = parse(stationsStr, {
  skip_empty_lines: true,
  escape: '\\',
});

// prepare csv data to a data array for GeoJson
const data = stations.map((station) => {
  return {
    id: station[0],
    name: station[1],
    url: station[2],
    homepage: station[3],
    icon: station[4],
    country: station[6],
    codec: station[14],
    lat: Number.parseFloat(station[26]),
    lng: Number.parseFloat(station[27]),
    votes: station[9]
  };
});

const geojsonData = geojson.parse(data, {
  Point: ['lat', 'lng']
});

app.get('/data', function (req, res) {
  res.send(data);
});

app.get('/layer', (req, res) => {
  res.send(geojsonData);
});

module.exports.handler = serverless(app);