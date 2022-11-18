import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshToonMaterial, PlaneGeometry } from 'three'
import * as THREE from 'three';


export default function Sphere(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // mesh.current.rotation.x += 0.01
    const vertex = new THREE.Vector3();
    const positionAttribute = mesh.current.geometry.getAttribute( 'position' );

    let testarray = []
    for ( let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex ++ ) {

      vertex.fromBufferAttribute( positionAttribute, vertexIndex );
    
      vertex.x = Math.random() * 4
      vertex.y = Math.random() * 4
      vertex.z = Math.random() * 4
      testarray.push(vertex.x, vertex.y, vertex.z)
      // do something with vertex
    
    }
  })

  useEffect(() => {
    console.log(<sphereGeometry attach="geometry" />)
  },[])


  // Return view, these are regular three.js elements expressed in JSX
  
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}