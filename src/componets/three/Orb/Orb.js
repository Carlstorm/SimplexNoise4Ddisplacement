import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';
import openSimplexNoise from 'https://cdn.skypack.dev/open-simplex-noise';



// TEXTURES
  import normalMap from "../../../assets/normals/Water_002_NORM.jpg"
  import displacementMap from "../../../assets/displacements/Water_002_DISP.png"
import { useEnvironment } from '@react-three/drei';
import hdr from '../../../assets/hdr/testda.hdr'

let orbRef = {loading: true}
let musicDatada = null
let loudestSound = null
export default function Orb(props) {

  const envMap = useEnvironment({files: hdr})
  const {musicData, appRef} = props

  const texloader = new THREE.TextureLoader();
  const orbTextures = {
    normal: texloader.load(normalMap),
    displacement: texloader.load(displacementMap)
  }

  let nPos = [];
  let v3 = new THREE.Vector3();
  const orb = useMemo(() => {
    const orbGeometry = new THREE.SphereGeometry(1, 124, 124)
    let {position} = orbGeometry.attributes;
    for (let i = 0; i < position.count; i++){
        v3.fromBufferAttribute(position, i).normalize();
        nPos.push(v3.clone());
    }
    orbGeometry.userData.nPos = nPos;
    return orbGeometry
  }, []);

  const meshRef = useRef()

  useEffect(() => {
    if (!meshRef.current)
      return
    console.log(meshRef.current)
    const ref = meshRef.current
    orbRef = {
      ...orbRef,
      material: ref.material,
      rotation: ref.rotation,
      geometry: ref.geometry,
      position: ref.geometry.attributes.position,
      normalMap: ref.material.normalMap,
      normalScale: ref.material.normalScale,
      displacementMap: ref.material.displacementMap,
      displacementScale: ref.material.displacementScale,
      loading: false
    }
    if (musicData.data && !loudestSound) {
      let len = musicData.data.length;
      let max = -Infinity;
  
      while (len--) {
          max = musicData.data[len] > max ? musicData.data[len] : max;
      }
      loudestSound = max
    }

  },[musicData])

  // useEffect(() => {
  //   if (musicData.data) {
  //     musicDatada = musicData
  //     console.log(musicData)
  //   }

  // },[musicData])

  let rotationdir = true
  let radiusnew = 2;
  let v2 = new THREE.Vector2(0, 0)
  const rotationAxis = new THREE.Vector3(0, 0, 1);

  let testmat = new THREE.MeshStandardMaterial()
  testmat.normalMap = orbTextures.normal
  testmat.normalScale = 3

  const animate = {
    maps: (mapModifier) => {
      // v2.x = BaseMapModifier+(mapModifier*mapLimiter)
      // v2.y = BaseMapModifier+(mapModifier*mapLimiter)
      // orbRef.material.normalMap.repeat = v2
      // orbRef.material.displacementMap.repeat = v2
      // // orbRef.material.displacementScale = value

      if (appRef) {
        console.log(appRef.getElementsByClassName("dadad")[0])
        appRef.getElementsByClassName("dadad")[0].style.opacity = mapModifier*0.5
      }
      orbRef.material.envMapIntensity = baseEnvPower+(mapModifier*10)
    },
    rotation: (rotationModifer, baseRotationModifer, rotationLimiter, camera) => {
      // let value = (rotationModifer*rotationLimiter)+baseRotationModifer
      // // value = rotationdir ? value : -value
      // orbRef.rotation.z -= value
      // camera.rotateOnWorldAxis(rotationAxis, value)
    },
    displace: (modifier, baseModifier, t) => {
      orbRef.geometry.userData.nPos.forEach((p, idx) => {
        let noiseModifier = 1+(modifier*1.5)
        let radiusModifier = 2+(modifier*0.2)
        let noiseVal = (noise(p.x*noiseModifier, p.y*noiseModifier, p.z*noiseModifier, t+noiseModifier)*(baseModifier+modifier));
        v3.copy(p).multiplyScalar(radiusModifier).addScaledVector(p, noiseVal);
        orbRef.position.setXYZ(idx, v3.x, v3.y, v3.z);
      })
      orbRef.geometry.computeVertexNormals();
      orbRef.position.needsUpdate = true;
    }
  }

  let radius = 2;
  let avarageSound = 0;

  let noise = openSimplexNoise.makeNoise4D();
  let clock = new THREE.Clock();

  let modifier = 0;
  let timePrev = 0;

  let rotation = 0
  let baseModifier = 0.05

  let baseEnvPower = 17

  useFrame((state, delta) => {
    if (orbRef.loading)
      return
    

    let t = clock.getElapsedTime();

    if (musicData.data) {
      let currentTimePercent = t/musicData.duratin
      let musicIndex = Math.floor(musicData.data.length*currentTimePercent)
      let musicFrame = musicData.data[musicIndex]

  
      let musicLimiter = 0.075
      let gravityLimiter = 0.1
      let gravity = 0.01

      let musicModifier = (musicFrame*musicLimiter)*(1+(musicFrame))
      let gravityModifer = modifier*(gravityLimiter)+gravity
      modifier += musicModifier-(gravityModifer)
      modifier = modifier < 0 ? 0 : modifier

      if (musicFrame >= loudestSound-0.025)
        rotationdir = !rotationdir
    }

    animate.displace(modifier, baseModifier, t)

    // let mapModifier = modifier
    // let BaseMapModifier = 0.4
    // let mapLimiter = 0.1

    animate.maps(modifier)

    let rotationModifer = modifier
    let baseRotationModifer = 0.00066
    let rotationLimiter = 0.005

    animate.rotation(rotationModifer, baseRotationModifer, rotationLimiter, state.camera)
    return


            
            // state.camera.rotateOnWorldAxis(myAxis, rotation*-0.25)
            // let shortsec = 5
            // let longsec = 200



            // let radiusnew = radius+(modifier*0.25)


            // const rotdir = rotationdir ? -1 : 1
            // rotation = ((modifier*0.015)+(0.005))*rotdir




            




  })



  return (
    <mesh
      {...props}
      ref={meshRef}
      >
      <bufferGeometry {...orb} />
      <meshStandardMaterial 
        roughness={0}
        envMap={envMap}
        envMapIntensity={baseEnvPower}
      />
    </mesh>
  )
}
