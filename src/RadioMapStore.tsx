import { makeAutoObservable } from 'mobx';

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
    mapCenterLongitude: number = -80.516670;
    mapCenterLatitude: number = 43.466667;
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