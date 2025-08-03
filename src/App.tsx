
import StationPlayer from './components/StationPlayer';
import RadioMapStore from './store/RadioMapStore';

import 'mapbox-gl/dist/mapbox-gl.css';
import { observer } from 'mobx-react-lite';


import { ThemeProvider, createTheme } from '@mui/material';

import { RadioMap } from './map/RadioMap';
import NearbyStationsDrawer from './components/NearbyStationsDrawer';

const store = new RadioMapStore();

const App = observer(() => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ position: 'absolute', width: '100vw', height: '100%', left: 0, top: 0 }}>
        <RadioMap store={store} />
        <NearbyStationsDrawer store={store} />

        <div style={{ position: 'absolute', bottom: 0, display: 'flex', justifyContent: 'center', alignContent: 'center', width: '100vw' }}>
          <StationPlayer store={store} />
        </div>

      </div>
    </ThemeProvider>
  );
});

export default App;
