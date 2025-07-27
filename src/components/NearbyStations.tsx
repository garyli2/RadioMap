import { Avatar, Chip, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Slider, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import RadioMapStore from '../RadioMapStore';
import { observer } from 'mobx-react-lite';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

type NearbyStationsProps = {
    stations: Station[];
    store: RadioMapStore;
}

// Haversine formula from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}

const NearbyStations = observer((props: NearbyStationsProps) => {
    const store = props.store;
    const [lastUpdatedLocation, setLastUpdatedLocation] = useState<[number, number]>([0, 0]);
    const [nearbyStations, setNearbyStations] = useState<Station[]>([]);

    useEffect(() => {
        const changedDistance = getDistanceFromLatLonInKm(store.viewState.latitude, store.viewState.longitude, lastUpdatedLocation[0], lastUpdatedLocation[1]);
        if (changedDistance > 1) {
            const stationsList = props.stations
                .filter(station => getDistanceFromLatLonInKm(store.viewState.latitude, store.viewState.longitude, station.lat, station.lng) <= props.store.searchRadius)
                .sort((a, b) => parseInt(b.votes) - parseInt(a.votes)) // descending order
            console.log(stationsList)
            setNearbyStations(stationsList);
            setLastUpdatedLocation([store.viewState.latitude, store.viewState.longitude]);
        }
    }, [lastUpdatedLocation, props.stations, props.store.searchRadius, props.store.viewState.latitude, props.store.viewState.longitude, store.viewState.latitude, store.viewState.longitude])

    const NearbyStationsList = memo(({ nearbyStations }: { nearbyStations: Station[] }) =>
        nearbyStations.length > 0 ? <List style={{ zIndex: 999, height: '70vh' }}>
            {nearbyStations.map((station, index) => <div key={station.id}>
                <ListItem
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => props.store.playNew(station)}>
                            <PlayCircleIcon />
                        </IconButton>
                    }
                >
                    <ListItemAvatar>
                        <Avatar src={station.icon} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={station.name}
                    />
                    <Chip label={station.codec} />
                </ListItem>
                {index < nearbyStations.length - 1 ? <Divider light /> : null}
            </div>
            )}
        </List> :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 5, marginTop: 20 }}>
                <Typography textAlign="center">No nearby stations. Try moving around the map or adjusting the radius slider.</Typography>
            </div>

    );

    return <>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <IconButton onClick={() => store.setSlideOut(false)}>
                <ArrowCircleRightIcon />
            </IconButton>
            <Slider
                aria-label="Search Radius"
                style={{ margin: 5 }}
                defaultValue={30}
                max={55}
                min={5}
                step={null}
                onChange={(_e, value) => props.store.setSearchRadius(value as number)}
                valueLabelDisplay="auto"
                marks={[
                    {
                        value: 10,
                        label: '10km'
                    },
                    {
                        value: 20,
                        label: '20km'
                    },
                    {
                        value: 30,
                        label: '30km'
                    },
                    {
                        value: 50,
                        label: '50km'
                    }
                ]}
            />
        </div>

        <NearbyStationsList nearbyStations={nearbyStations} />

    </>
});

export default NearbyStations;