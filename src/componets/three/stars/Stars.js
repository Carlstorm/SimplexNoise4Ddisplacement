import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';

// assets
import star from '../../../assets/textures/star.png'

// functions
import MusicHandler from '../../../functions/MusicHandler';

let starsData = []
export default function Stars({musicData, soundRef}) {
    let g, pos
    const count = 300
    const mesh = useRef()
    const texloader = new THREE.TextureLoader();
    const standard = texloader.load(star)
    let v3 = new THREE.Vector3()

    const initStars = () => {
      if (!mesh.current) return
        g = mesh.current.geometry
        pos = g.attributes.position;
    }

    const stars = useMemo(() => {
        for (let i = 0; i<count; i++) {
          let maxdist = 33
          let randomposX = Math.random()*(maxdist*2)-maxdist
          let randomposY = Math.random()*(maxdist*2)-maxdist

          let posXdiff = maxdist-Math.abs(randomposX)
          let posYdiff = maxdist-Math.abs(randomposY)
          randomposX = randomposX > 0 ? randomposX+posYdiff : randomposX-posYdiff
          randomposY = randomposY > 0 ? randomposY+posXdiff : randomposY-posXdiff

          let randomposZ = (Math.random()*-120)

          starsData.push({
            x: randomposX,
            y: randomposY,
            z: randomposZ,
            acc: (Math.random()*0.05)+0.05,
            show: randomposZ < (-100/2)
          })
        }

        return new THREE.BufferAttribute(new Float32Array(starsData.flatMap(v => [v.x, v.y, v.z])), 3);
    }, []);

    useFrame((state, delta) => {
        if (!g) {
          initStars()
          return
        }        
          starsData.forEach((p, idx) => {
            v3.fromBufferAttribute(pos, idx)
            if (v3.z > 20) {
              v3.z = -120
              v3.x = starsData[idx].x
              v3.y = starsData[idx].y
              starsData[idx].show = true
            }

            v3.z += starsData[idx].acc*(1+(MusicHandler.value(musicData, soundRef)*7.5))

            pos.setXYZ(idx, v3.x, v3.y, v3.z)
        });
        pos.needsUpdate = true;
    })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach={"attributes-position"} {...stars} />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        transparent="true"
        color="white"
        opacity={0.5}
        map={standard}
      />
    </points>
  )
}