import { Divider, IconButton, Paper, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import ReactPlayer from 'react-player';
import RadioMapStore from '../RadioMapStore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import isMobile from 'is-mobile';

type StationPlayerProps = {
    store: RadioMapStore;
}

const StationPlayer = observer((props: StationPlayerProps) => {
    const store = props.store;
    return <>
        <ReactPlayer style={{ display: 'none' }} src={store.station?.url} playing={store.isPlaying} />
        <Paper style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: isMobile() ? '40vw' : '25vw' }} elevation={3}>
            <Typography textAlign="center" style={{ width: '80%' }}>{store.station !== undefined ? store.station.name : 'No station'}</Typography>

            <Divider orientation='vertical' />
            <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={() => store.isPlaying ? store.pause() : store.play()}>
                    {store.isPlaying ? <StopCircleIcon /> : <PlayCircleIcon />}
                </IconButton>
            </div>

        </Paper>
    </>
});

export default StationPlayer;