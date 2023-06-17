import { useRef, useState } from "react";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  Mesh,
  MeshStandardMaterial,
  Shape,
  SpotLight,
  Vector2,
  Vector3,
} from "three";

const Road = ({
  width = 10,
  length = 100,
  color = "gray",
  pos = [0, 0, -100],
}) => {
  const mesh = useRef<Mesh>(null);
  const roadRef = useRef<Mesh>();
  const spotLightRef = useRef<SpotLight>();
  const pts1 = [],
    count = 3;

  for (let i = 0; i < count; i++) {
    const l = width;

    const a = ((2 * i) / count) * Math.PI;

    pts1.push(new Vector2(Math.cos(a) * l, Math.sin(a) * l));
  }

  const shape = new Shape(pts1);

  const closedSpline = new CatmullRomCurve3(
    [
      new Vector3(0, 0, 0),
      new Vector3(0, 30, 0),
      new Vector3(20, 60, 0),
      new Vector3(20, 100, 0),
    ],

    false,
    "catmullrom"
  );

  const settings = {
    steps: 100,
    bevelEnabled: false,
    extrudePath: closedSpline,
  };

  let carPosition = 0;
  const carSpeed = 0.005;
  useFrame(() => {
    if (mesh.current && roadRef.current) {
      const currPoint = closedSpline.getPoint(carPosition % 1);
      const nextPoint = closedSpline.getPointAt((carPosition + carSpeed) % 1);

      const newPos = currPoint.applyMatrix4(roadRef.current.matrixWorld);
      const newNextPos = nextPoint.applyMatrix4(roadRef.current.matrixWorld);

      newPos.add(new Vector3(0, 7.5, 0));
      newNextPos.add(new Vector3(0, 7.5, 0));

      mesh.current.position.copy(newPos);
      mesh.current.lookAt(newNextPos);

      mesh.current.rotation.z = 0;
      spotLightRef.current?.target.position.copy(newNextPos);
      spotLightRef.current?.target.updateMatrixWorld();
      carPosition += carSpeed;
    }
  });

  console.log(spotLightRef);

  return (
    <>
      <mesh ref={mesh}>
        <spotLight ref={spotLightRef} color="white" position={[0, 0, 0]} />
        <boxGeometry args={[1.5, 1, 2]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh ref={roadRef} position={pos} rotation={[-1, 0, 1.25]}>
        <extrudeGeometry args={[shape, settings]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
};

function Box() {
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.1;
      mesh.current.rotation.z += 0.01;
      mesh.current.rotation.y += 0.05;
    }
  });
  return (
    <mesh ref={mesh} position={[0, 30, -90]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" ref={material} />
    </mesh>
  );
}

function App() {
  return (
    <div
      style={{
        width: "80vw",
        height: "80vh",
      }}
    >
      <Canvas color="white" camera={{}}>
        <color attach="background" args={["#080705"]} />
        <ambientLight intensity={0.1} />
        <Box />
        <pointLight position={[10, 10, 10]} intensity={0.1} />
        <Road pos={[30, -5, -40]} />
      </Canvas>
    </div>
  );
}

export default App;
