import { makeAutoObservable } from 'mobx';
import { DEFAULT_LOCATION } from '../constants';

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
    mapCenterLatitude: number = DEFAULT_LOCATION[0];
    mapCenterLongitude: number = DEFAULT_LOCATION[1];
    slideOut = false;

    constructor() {
        makeAutoObservable(this);
    }

    setSlideOut(slideOut: boolean) {
        this.slideOut = slideOut;
    }

    setViewState(longitude: number, latitude: number) {
        this.mapCenterLatitude = latitude;
        this.mapCenterLongitude = longitude;
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
    }

    play() {
        if (this.station !== undefined) {
            this.isPlaying = true;
        }
    }

    playNew(station: Station) {
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