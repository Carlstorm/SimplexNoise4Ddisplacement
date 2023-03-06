import './App.css';

import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Orb from './componets/three/Orb/Orb';
import AudioWave from './componets/AudioWave/AudioWave';
import Stars from './componets/three/stars/Stars'

function App() {
  const appRef = useRef(null)
  const soundRef = useRef(null)

  const [musicData, setMusicData] = useState({sound:null, data:null, duration: null})
  const [songCurrentTime, setSongCurrentTime] = useState(0)

  return (
    <div className="App" ref={appRef}>
      <AudioWave setMusicData={setMusicData} musicData={musicData} setSongCurrentTime={setSongCurrentTime} soundRef={soundRef} />
      <div className="dadad"></div>
      <Canvas className="canvas" >
        <ambientLight intensity={0}/>
        <Orb position={[0, 0, 0]} musicData={musicData} appRef={appRef.current} soundRef={soundRef} />
        <Stars musicData={musicData} songCurrentTime={songCurrentTime} soundRef={soundRef} />

      </Canvas>
    </div>
  );
}

export default App;
