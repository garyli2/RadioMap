import { useRef } from 'react';
import Map, { Source, Layer, AttributionControl } from 'react-map-gl/mapbox';
import NearbyStations from './components/NearbyStations';
import StationPlayer from './components/StationPlayer';
import RadioMapStore from './RadioMapStore';
import type { MapRef } from 'react-map-gl/mapbox';

import mobile from 'is-mobile';

import 'mapbox-gl/dist/mapbox-gl.css';
import { circle } from '@turf/circle';
import { observer } from 'mobx-react-lite';

import RadioIcon from '@mui/icons-material/Radio';
import { Button, Drawer, ThemeProvider, createTheme } from '@mui/material';

import "react-sliding-pane/dist/react-sliding-pane.css";

import STATION_DATA from './static/data.json';
import { HEAT_MAP_LAYER } from './heatmap-layer';
import MAP_LAYER_DATA from './static/layer.json';

const MAPBOX_TOKEN = "pk.eyJ1IjoibGktZ2FyeSIsImEiOiJjbG02Y2N1eXcwenZ2M2pwNGl6dGJmMHd1In0.0YsbtBewZhkFDARTOgSOLA";

const store = new RadioMapStore();

const App = observer(() => {
  const mapRef = useRef<MapRef>(null);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

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
          {
            <Source type="geojson" data={MAP_LAYER_DATA as GeoJSON.GeoJSON}>
              <Layer {...HEAT_MAP_LAYER} />
            </Source>
          }
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
          <NearbyStations stations={STATION_DATA} store={store} />
        </Drawer>

        <div style={{ position: 'absolute', bottom: 0, display: 'flex', justifyContent: 'center', alignContent: 'center', width: '100vw' }}>
          <StationPlayer store={store} />
        </div>

      </div>
    </ThemeProvider>
  );
});

export default App;
