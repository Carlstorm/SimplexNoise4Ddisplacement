import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';

// NOISE
import { makeNoise2D } from "open-simplex-noise";

// ENVIRONMENT
import { useEnvironment } from '@react-three/drei';
import hdr from '../../../assets/hdr/env.hdr'

// TEXTURES
import MusicHandler from '../../../functions/MusicHandler';

let orbRef = {loading: true}
let loudestSound = null

export default function Orb({musicData, soundRef, setLoading}) {
  let noise = makeNoise2D();
  const envMap = useEnvironment({files: hdr})

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

  const rotationAxis = new THREE.Vector3(0, 0, 1);

  const animate = {
    maps: (mapModifier) => {
      document.getElementById("lightBg").style.opacity = mapModifier*0.75
      orbRef.material.envMapIntensity = baseEnvPower+(mapModifier*33)
    },
    rotation: (rotationModifer, baseRotationModifer, rotationLimiter, camera) => {
      let value = (rotationModifer*rotationLimiter)+baseRotationModifer
      orbRef.rotation.z -= value
      camera.rotateOnWorldAxis(rotationAxis, value)
    },
    displace: (modifier, baseModifier, t) => {
      modifier = modifier-(0.5*(modifier/2))
      let noiseModifier = 3-(modifier*2)
      let radiusModifier = 2+(modifier*0.1)
      orbRef.geometry.userData.nPos.forEach((p, idx) => {
        let noiseVal = (noise(t+p.x*noiseModifier, t+p.y*noiseModifier, t+p.z*noiseModifier, t+noiseModifier)*(baseModifier+(modifier*0.8)));
        // let noiseVal = (noise(p.x*noiseModifier, p.y*noiseModifier, p.z*noiseModifier, t+noiseModifier)*(baseModifier+modifier));
        v3.copy(p).multiplyScalar(radiusModifier).addScaledVector(p, noiseVal);
        orbRef.position.setXYZ(idx, v3.x, v3.y, v3.z);
      })
      orbRef.geometry.computeVertexNormals();
      orbRef.position.needsUpdate = true;
    }
  }

  let modifier = 0;
  const baseModifier = 0.0125
  const baseEnvPower = 15
  let noiseSeed = 0;

  useFrame((state, delta) => {
    if (orbRef.loading) return
    
    const musicValue = MusicHandler.value(musicData, soundRef)
    let musicPower = 0.2
    let gravityPower = 0.3
    let gravity = 0.0001

    let musicModifier = (musicValue*musicPower)*(1+(musicValue))
    let gravityModifer = modifier*(gravityPower)+gravity
    modifier += musicModifier-(gravityModifer)
    modifier = modifier < 0 ? 0 : modifier
    
    noiseSeed += 0.015*((modifier*0.75)+1)
    animate.displace(modifier, baseModifier, noiseSeed)
    animate.maps(modifier*0.5)

    const rotationModifer = modifier*0.75
    const baseRotationModifer = 0.000001
    const rotationLimiter = 0.005

    animate.rotation(rotationModifer, baseRotationModifer, rotationLimiter, state.camera)
    return
  })

  return (
    <mesh
      ref={meshRef}
      >
      <bufferGeometry {...orb} />
      <meshStandardMaterial 
        metalness={0.6}
        roughness={0}
        envMap={envMap}
        envMapIntensity={0}
      />
    </mesh>
  )
}
