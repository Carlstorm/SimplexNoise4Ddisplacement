import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { BufferGeometry, MeshToonMaterial, PlaneGeometry, Vector3 } from 'three'
import * as THREE from 'three';
import star from '../../../assets/textures/star.png'


export default function Stars(props) {

    const {musicData} = props;

    const count = 300
    const mesh = useRef()

    let v3 = new THREE.Vector3()

    let starsData = []

    const stars = useMemo(() => {
        for (let i = 0; i<count; i++) {
          let maxdist = 33
          let randomposX = Math.random()*(maxdist*2)-maxdist
          let randomposY = Math.random()*(maxdist*2)-maxdist

          let posXdiff = maxdist-Math.abs(randomposX)
          let posYdiff = maxdist-Math.abs(randomposY)
          randomposX = randomposX > 0 ? randomposX+posYdiff : randomposX-posYdiff
          randomposY = randomposY > 0 ? randomposY+posXdiff : randomposY-posXdiff
          // if (randomposX > 0 && randomposX < 5)
          //   randomposX+=5
          // else if (randomposX < 0 && randomposX > -5)
          //   randomposX-=5


          // if (randomposY > 0 && randomposY < 5)
          //   randomposY+=5
          // else if (randomposY < 0 && randomposY > -5)
          //   randomposY-=5

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
    }, [count, musicData]);

    let g, pos
    useEffect(() => {
        if (!mesh.current) return

        g = mesh.current.geometry
        pos = g.attributes.position;
        console.log(pos)
    },[mesh.current])


    const texloader = new THREE.TextureLoader();
    const standard = texloader.load(star)


    useFrame((state, delta) => {
        if (!g)
            return

          starsData.forEach((p, idx) => {
            v3.fromBufferAttribute(pos, idx)
            if (v3.z > 20) {
              v3.z = -120
              v3.x = starsData[idx].x
              v3.y = starsData[idx].y
              starsData[idx].show = true
            }
            v3.z += starsData[idx].acc

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
        size={1}
        transparent="true"
        color="#004770"
        opacity={1}
        map={standard}
      />
    </points>
  )
}