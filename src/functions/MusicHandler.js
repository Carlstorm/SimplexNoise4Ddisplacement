import * as THREE from 'three';
const clock = new THREE.Clock();
let time = 0;

const MusicHandler = {
    value: (musicData, soundRef) => {
        if (!musicData.data || soundRef.current.paused) return 0
        let currentTimePercent = (soundRef.current.currentTime+0.05)/musicData.duratin
        let musicIndex = Math.floor(musicData.data.length*currentTimePercent)
        if (!musicData.data[musicIndex]) return 0
        return musicData.data[musicIndex]
    },
    time: time
}

export default MusicHandler;