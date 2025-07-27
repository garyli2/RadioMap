import { makeAutoObservable } from 'mobx';

const DEFAULT_LOCATION = [43.466667, -80.516670];

export type Station = {
    id: string;
    name: string;
    url: string;
    homepage: string;
    icon: string;
    country: string;
    codec: string;
    lat: number;
    lng: number;
    votes: string;
}

class RadioMapStore {
    
    station: Station | undefined;
    isPlaying = false;
    searchRadius = 30;
    viewState = {
        latitude: DEFAULT_LOCATION[0],
        longitude: DEFAULT_LOCATION[1],
        zoom: 10,
    }
    slideOut = false;

    constructor() {
        makeAutoObservable(this);
    }

    setSlideOut(slideOut: boolean) {
        this.slideOut = slideOut;
    }

    setViewState(viewState: {longitude: number, latitude: number, zoom: number}) {
        this.viewState = viewState;
    }

    play() {
        if (this.station !== undefined) {
            this.isPlaying = true;
        }
    }

    playNew(station: Station) {
        this.pause();
        if (station.url.includes('http://')) {
            console.log('Upgrading http to https', station.url);
            station.url = station.url.replace('http://', 'https://');
        }
        this.station = station;
        this.play();
    }

    pause() {
        this.isPlaying = false;
    }

    setSearchRadius(radius: number) {
        this.searchRadius = radius;
    }
}

export default RadioMapStore;