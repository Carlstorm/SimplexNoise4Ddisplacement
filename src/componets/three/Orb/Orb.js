import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';

// NOISE
import openSimplexNoise from 'https://cdn.skypack.dev/open-simplex-noise';

// ENVIRONMENT
import { useEnvironment } from '@react-three/drei';
import hdr from '../../../assets/hdr/testda.hdr'

// TEXTURES
import MusicHandler from '../../../functions/MusicHandler';

let orbRef = {loading: true}
let loudestSound = null

export default function Orb({musicData, soundRef}) {
  let noise = openSimplexNoise.makeNoise4D();
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
      document.getElementsByClassName("dadad")[0].style.opacity = mapModifier*0.525
      orbRef.material.envMapIntensity = baseEnvPower+(mapModifier*10)
    },
    rotation: (rotationModifer, baseRotationModifer, rotationLimiter, camera) => {
      let value = (rotationModifer*rotationLimiter)+baseRotationModifer
      orbRef.rotation.z -= value
      camera.rotateOnWorldAxis(rotationAxis, value)
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

  let modifier = 0;
  const baseModifier = 0.05
  const baseEnvPower = 17
  let noiseSeed = 0;

  useFrame((state, delta) => {
    if (orbRef.loading) return
    
    const musicValue = MusicHandler.value(musicData, soundRef)
    let musicLimiter = 0.075
    let gravityLimiter = 0.1
    let gravity = 0.01

    let musicModifier = (musicValue*musicLimiter)*(1+(musicValue))
    let gravityModifer = modifier*(gravityLimiter)+gravity
    modifier += musicModifier-(gravityModifer)
    modifier = modifier < 0 ? 0 : modifier

    animate.displace(modifier, baseModifier, noiseSeed)
    noiseSeed += 0.02*(musicValue+1)
    animate.maps(modifier)

    const rotationModifer = modifier
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
        roughness={0}
        envMap={envMap}
        envMapIntensity={baseEnvPower}
      />
    </mesh>
  )
}
