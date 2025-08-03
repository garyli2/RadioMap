import { useRef } from "react";
import Map, { type MapRef, Source, Layer, AttributionControl } from "react-map-gl/mapbox";
import { HEAT_MAP_LAYER } from './heatmap-layer';
import MAP_LAYER_DATA from '../static/layer.json';
import type RadioMapStore from "../store/RadioMapStore";
import circle from "@turf/circle";
import { observer } from "mobx-react-lite";
import { DEFAULT_LOCATION, MAPBOX_TOKEN } from "../constants";

export const RadioMap = observer(({ store }: { store: RadioMapStore }) => {
    const mapRef = useRef<MapRef>(null);
    const selectionCircle = circle([store.mapCenterLongitude, store.mapCenterLatitude], store.searchRadius, { units: 'kilometers' });

    return <Map
        ref={mapRef}
        initialViewState={{
            latitude: DEFAULT_LOCATION[0],
            longitude: DEFAULT_LOCATION[1],
            zoom: 10,
        }}
        onMove={e => store.setViewState(e.viewState.longitude, e.viewState.latitude)}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
    >
        <Source type="geojson" data={MAP_LAYER_DATA as GeoJSON.GeoJSON}>
            <Layer {...HEAT_MAP_LAYER} />
        </Source>
        <Source type="geojson" data={selectionCircle}>
            <Layer type='fill' paint={{ "fill-opacity": 0.7, "fill-color": '#255c6e' }} />
        </Source>
        <AttributionControl compact position="top-left" />
    </Map>;
});