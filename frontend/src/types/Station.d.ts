type Station = {
    id: number;
    name: string;
    url: string;
    homepage: string;
    icon: string;
    country: string;
    codec: "MP3" | "UNKNOWN" | "AAC" | "AAC+" | "OGG" | "AAC,H.264" | "UNKNOWN,H.264" | "MP3,H.264" | "FLAC"
    lat: number;
    lng: number;
    vote: number;
}