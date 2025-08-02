import { Avatar, Button, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemText, Slider, Typography } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import RadioMapStore from '../RadioMapStore';
import { observer } from 'mobx-react-lite';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { getDistanceFromLatLonInKm } from '../utils';
import STATIONS_DATA from '../static/data.json';
import mobile from 'is-mobile';
import RadioIcon from '@mui/icons-material/Radio';

const DISTANCE_OPTIONS = [10, 20, 30, 50].map(num => ({ value: num, label: `${num}km` }));

const NoNearbyStations = () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 5, marginTop: 20 }}>
    <Typography textAlign="center">No nearby stations. Try moving around the map or adjusting the radius slider.</Typography>
</div>;

const NearbyStationsList = observer(({ store }: { store: RadioMapStore }) => {
    const searchRadius = store.searchRadius;
    const stationsList = STATIONS_DATA
        .filter(station => getDistanceFromLatLonInKm(store.mapCenterLatitude, store.mapCenterLongitude, station.lat, station.lng) <= searchRadius)
        .sort((a, b) => parseInt(b.votes) - parseInt(a.votes));

    if (!stationsList.length) {
        return <NoNearbyStations />
    }

    return <List style={{ zIndex: 999 }}>
        {stationsList.map((station, index) => <div key={station.id}>
            <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="play" onClick={() => store.playNew(station)}>
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
            {index < stationsList.length - 1 ? <Divider light /> : null}
        </div>
        )}
    </List>;
});

const NearbyStationsDrawer = observer(({ store }: { store: RadioMapStore }) => {
    if (!store.slideOut) {
        return <div style={{ position: 'absolute', right: 20, top: 10 }}>
            <Button onClick={() => store.setSlideOut(true)} variant="contained" startIcon={<RadioIcon />} >
                Stations List
            </Button>
        </div>
    }

    return <Drawer
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
                onChange={(_e, value) => store.setSearchRadius(value)}
                valueLabelDisplay="auto"
                marks={DISTANCE_OPTIONS}
            />
        </div>

        <NearbyStationsList store={store} />
    </Drawer>
});

export default NearbyStationsDrawer;