import logo from './logo.svg';
import './App.css';

import { createRoot } from 'react-dom/client'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Orb from './componets/three/Orb/Orb';
import Sphere from './componets/three/Orb/Sphere';
import openSimplexNoise from 'https://cdn.skypack.dev/open-simplex-noise';
import AudioWave from './componets/AudioWave/AudioWave';
import { CubeCamera, Environment, OrbitControls, useEnvironment } from '@react-three/drei';
import Stars from './componets/three/stars/Stars'
import hdr from './assets/hdr/testda.hdr'
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'

function App() {
  const canvasRef = useRef(null)
  const appRef = useRef(null)
  const [noisecanvas, setnoisecanvas] = useState(null)
  const [musicData, setMusicData] = useState({sound:null, data:null, duration: null})

  // useEffect(() => {
  //   const ctx = canvasRef.current.getContext("2d");
  //   setnoisecanvas(ctx)
  //   const [width, height] = [888, 222];
  //   const imageData = ctx.createImageData(width, height);
  //   const noise2D = openSimplexNoise.makeNoise2D(Date.now()); // Using current date as seed

  //   for (let x = 0; x < width; x++) {
  //     for (let y = 0; y < height; y++) {
  //       const i = (x + y * width) * 4;
  //       const value = (noise2D(x, y) + 1) * 128;
  //       imageData.data[i] = value;
  //       imageData.data[i + 1] = value;
  //       imageData.data[i + 2] = value;
  //       imageData.data[i + 3] = 255;
  //     }
  //   }

  //   ctx.putImageData(imageData, 0, 0);
  // },[])
  // const envMap = useEnvironment({files: hdr})

  return (
    <div className="App" ref={appRef}>
          <AudioWave setMusicData={setMusicData} musicData={musicData}/>
          {/* <canvas className="canvasnoise" ref={canvasRef} />
          <AudioWave setMusicData={setMusicData} musicData={musicData}/> */}
          <div className="dadad"></div>
          <Canvas className="canvas" >
            <ambientLight intensity={0}/>
            {/* <directionalLight intensity={1} position={[0, -5, -5]} color="red" />
            <directionalLight intensity={1} position={[0, 5, -5]} color="blue" /> */}
            {/* <hemisphereLight groundColor={"red"} skyColor={"blue"} intensity={0.05} /> */}
            {/* <rectAreaLight position={[0, 0, -3]} intensity={275} color={"yellow"} /> */}
            {/* <rectAreaLight position={[0, 0, 7]} intensity={75} color={"red"} /> */}
            {/* <pointLight position={[0, 0, 10]} color={"blue"} intensity={0.4} /> */}
          
            <Orb position={[0, 0, 0]} musicData={musicData} appRef={appRef.current} />
            {/* <Stars musicData={musicData} /> */}
            {/* <Sphere /> */}
            {/* <OrbitControls /> */}
            <EffectComposer>
            <Bloom 
              luminanceThreshold={0.0}
              luminanceSmoothing={1}
              height={160}
              opacity={0.2}/>
            </EffectComposer>
          </Canvas>
    </div>
  );
}

export default App;
