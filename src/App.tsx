import { useRef } from "react";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  Color,
  Mesh,
  MeshStandardMaterial,
  Shape,
  SpotLight,
  Vector2,
  Vector3,
} from "three";
import StaticRoad from "./elements/Road";
import Car from "./elements/Car";

function RoadManager() {
  const roadRef = useRef<Mesh>();
  const roadBackRef = useRef<Mesh>();
  const closedSpline = new CatmullRomCurve3(
    [
      new Vector3(0, -20, 0),
      new Vector3(10, 0, 0),
      new Vector3(0, 30, 0),
      new Vector3(20, 60, 0),
      new Vector3(20, 100, 0),
      new Vector3(20, 190, 4),
    ],

    false,
    "catmullrom"
  );

  const carFleet = (size: number) => {
    const cars = [];
    for (let i = 0; i < size; i++) {
      const isOppositeDirection = Math.random() > 0.5;
      const roadMatrix = isOppositeDirection
        ? roadBackRef.current?.matrixWorld
        : roadRef.current?.matrixWorld;
      const col = Math.random() * 0.1;
      cars.push(
        <Car
          key={i}
          color={new Color(col, col, col)}
          speedOffset={Math.random() + 0.75}
          xOffset={Math.random() * 5}
          roadMatrixTransform={roadMatrix}
          roadPath={closedSpline}
          oppositeDirection={isOppositeDirection}
        />
      );
    }
    return cars;
  };

  return (
    <>
      <StaticRoad deepness={5} width={10} ref={roadRef} path={closedSpline} />
      <StaticRoad
        back
        deepness={5}
        width={15}
        ref={roadBackRef}
        path={closedSpline}
      />
      {carFleet(100)}
    </>
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
      <Canvas color="white">
        <color attach="background" args={["#080705"]} />
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.1} />
        <RoadManager />
      </Canvas>
    </div>
  );
}

export default App;
