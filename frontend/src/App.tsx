import React, { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, HeatmapLayer, AttributionControl } from 'react-map-gl';
import NearbyStations from './components/NearbyStations';
import StationPlayer from './components/StationPlayer';
import RadioMapStore from './RadioMapStore';
import type { MapRef } from 'react-map-gl';
import SlidingPane from "react-sliding-pane";

import mobile from 'is-mobile';

import 'mapbox-gl/dist/mapbox-gl.css';
import { circle } from '@turf/turf';
import { observer } from 'mobx-react-lite';
import useConfig from './components/useConfig';

import RadioIcon from '@mui/icons-material/Radio';
import { Button, Drawer, IconButton, ThemeProvider, createTheme } from '@mui/material';

import "react-sliding-pane/dist/react-sliding-pane.css";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
const MAPBOX_TOKEN = "pk.eyJ1IjoibGktZ2FyeSIsImEiOiJjbG02Y2N1eXcwenZ2M2pwNGl6dGJmMHd1In0.0YsbtBewZhkFDARTOgSOLA";
const MAX_ZOOM_LEVEL = 20;
const heatmapLayer: HeatmapLayer = {
  id: 'heatmap',
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'heatmap',
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    'heatmap-weight': 1,
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0.2, 1, MAX_ZOOM_LEVEL, 3],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0.1,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      0.9,
      'rgb(255,201,101)'
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
    // // Transition from heatmap to circle layer by zoom level
    // 'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
  }
};

const store = new RadioMapStore();
const App = observer(() => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [mapData, setMapData] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>>();
  const mapRef = useRef<MapRef>(null);
  const config = useConfig();
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  // grab station and heatmap GeoJSON data from the backend
  // we only need to fetch once as these are static
  useEffect(() => {
    const fetchData: Promise<Station[]> = fetch(config.app.STATION_URL, { method: 'GET' }).then(data => data.json());
    const fetchHeatPoints: Promise<GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>>
      = fetch(config.app.HEATMAP_URL, { method: 'GET' }).then(data => data.json());

    Promise.all([fetchData, fetchHeatPoints]).then((json) => {
      setStations(json[0]);
      setMapData(json[1]);
    }).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  // loading and error indicators
  if (loading) {
    return <p>Loading..</p>
  } else if (error) {
    return <p>Error!</p>
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ position: 'absolute', width: '100vw', height: '100%', left: 0, top: 0 }}>
        <Map
          ref={mapRef}
          {...store.viewState}
          onMove={(evt) => store.setViewState({ ...evt.viewState })}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
          attributionControl={false}
        >
          {mapData && (
            <Source type="geojson" data={mapData}>
              <Layer {...heatmapLayer} />
            </Source>
          )}
          <Source type="geojson" data={circle(mapRef.current?.getCenter().toArray() ?? [store.viewState.longitude, store.viewState.latitude], store.searchRadius, { units: 'kilometers' })}>
            <Layer type='fill' paint={{ "fill-opacity": 0.7, "fill-color": '#255c6e' }} />
          </Source>
          <AttributionControl compact position="top-left" />
        </Map>


        {!store.slideOut ? <div style={{ position: 'absolute', right: 20, top: 10 }}>
          <Button onClick={() => store.setSlideOut(true)} variant="contained" startIcon={<RadioIcon />} >
            Stations List
          </Button>
        </div> : null}

        <Drawer
          sx={{
            width: mobile() ? '70vw' : '27vw',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: mobile() ? '70vw' : '27vw',
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="right"
          open={store.slideOut}
        >
          <NearbyStations stations={stations} store={store} />
        </Drawer>

        <div style={{ position: 'absolute', bottom: 0, display: 'flex', justifyContent: 'center', alignContent: 'center', width: '100vw' }}>
          <StationPlayer store={store} />
        </div>

      </div>
    </ThemeProvider>
  );
});

export default App;
