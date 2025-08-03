import { Divider, IconButton, Paper, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import RadioMapStore from '../store/RadioMapStore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import isMobile from 'is-mobile';
import { useEffect, useRef } from 'react';
import Hls from "hls.js";

type StationPlayerProps = {
    store: RadioMapStore;
}
const hls = new Hls();

const StationPlayer = observer((props: StationPlayerProps) => {
    const store = props.store;
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const url = store.station?.url;
        if (Hls.isSupported() && url?.endsWith(".m3u8") && ref.current) {
            hls.loadSource(url);
            hls.attachMedia(ref.current);
        } else {
            hls.detachMedia();
        }
    }, [store.station?.url]);

    if (store.isPlaying) {
        ref.current?.play();
    } else {
        ref.current?.pause();
    }

    return <>
        <audio ref={ref} src={store.station?.url} autoPlay />
        <Paper style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: isMobile() ? '40vw' : '25vw' }} elevation={3}>
            <Typography textAlign="center" style={{ width: '80%' }}>{store.station !== undefined ? store.station.name : 'No station'}</Typography>

            <Divider orientation='vertical' />
            <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={() => store.togglePlay()}>
                    {store.isPlaying ? <StopCircleIcon /> : <PlayCircleIcon />}
                </IconButton>
            </div>
        </Paper>
    </>
});

export default StationPlayer;