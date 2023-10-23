import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

// assets
import Reset from './assets/svgs/Reset';
import presetFile from './assets/audio/preset.mp3'

// components
import Loader from './componets/Loader/Loader';
import Orb from './componets/three/Orb/Orb';
import AudioPlayer from './componets/AudioPlayer/AudioPlayer';
import Stars from './componets/three/stars/Stars'

// style 
import style from './App.module.scss'

function App() {
  const appRef = useRef(null)
  const soundRef = useRef(null)

  const [musicData, setMusicData] = useState({sound:null, data:null, duration: null})
  const [name, setName] = useState(null)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setMusicData({sound:null, data:null, duration: null})
    setName(null)
  }

  const initMusicData = async (musicFile, ispreset) => {

    const ac = new AudioContext();
        
    const buffer = await musicFile.arrayBuffer();
    const audioBuffer = await ac.decodeAudioData(buffer);

    const float32Array = audioBuffer.getChannelData(0);

    const array = [];

    let i = 0;
    const length = float32Array.length;

    let chunkSize = length/window.innerWidth

    while (i < length) {
        array.push(
            float32Array.slice(i, i += chunkSize).reduce(function (total, value) {
                return Math.max(total, Math.abs(value));
            })
        );
    }

    const srcVal = ispreset ? presetFile : URL.createObjectURL(musicFile)
    const fileName = ispreset ? "Sample audio" : musicFile.name

    soundRef.current.src = srcVal
    setMusicData({sound:srcVal, data:array, duratin:audioBuffer.duration})
    setName(fileName)
    setLoading(false)
  }

  const handleFile = (e) => {
    setLoading(true)
    const input = e.target
    const inputFile = input.files[0]
    initMusicData(inputFile)
  }

  const selectPreset = async () => {
    setLoading(true)
    const response = await fetch(presetFile)
    
    const audioData = await response.arrayBuffer();
    const audioFile = new Blob([audioData], { type: 'audio/mpeg' });
    
    initMusicData(audioFile, "preset");
  }

  return (
    <div className={style.component} ref={appRef}>
      {musicData.sound ? 
        <div className={style.reset_wrap}>
          <Reset className={style.reset_button} title="reset" onClick={() => reset()}/>
          <span>{name}</span>
        </div>
      : null}
      {loading ? <Loader className={style.loader}/> : null}
      <AudioPlayer soundRef={soundRef} musicData={musicData}>
        <>
          {loading ? null : 
            <>
              <div className={style.button} onClick={() => selectPreset()}>Play sample audio</div>
              <label className={style.button}>
                  Upload
                  <input name="audioFile" id="audioFile" type="file" accept="audio/mp3" hidden onChange={(e) => handleFile(e)}></input>
              </label>
            </>
          }
        </>
      </AudioPlayer>
      <div className={style.light_bg_effect} id='lightBg'></div>
      <Canvas className={style.canvas} >
        <ambientLight intensity={0}/>
        <Orb position={[0, 0, 0]} musicData={musicData} appRef={appRef.current} soundRef={soundRef} setLoading={setLoading}/>
        <Stars musicData={musicData} soundRef={soundRef} />
      </Canvas>
    </div>
  );
}

export default App;
