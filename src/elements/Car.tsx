import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useRef } from "react";
import {
  CatmullRomCurve3,
  ColorRepresentation,
  Matrix4,
  Mesh,
  SpotLight,
  Vector3,
} from "three";

interface ICarProps {
  roadMatrixTransform?: Matrix4;
  roadPath: CatmullRomCurve3;
  xOffset: number;
  speedOffset: number;
  oppositeDirection?: boolean;
  color: ColorRepresentation;
}

const Car = ({
  roadMatrixTransform,
  roadPath,
  xOffset,
  speedOffset,
  oppositeDirection,
  color,
}: ICarProps) => {
  const carRef = useRef<Mesh>();
  const spotLightRef = useRef<SpotLight>();
  let carPosition = oppositeDirection ? 100 : 0;
  let carSpeed = 0.005 * speedOffset;
  if (oppositeDirection) carSpeed *= -1;
  useFrame(() => {
    const offSet = new Vector3(xOffset, 1, 0);
    const car = carRef.current;
    if (car && roadMatrixTransform) {
      let currPoint = roadPath.getPoint(carPosition % 1);
      let nextPoint = roadPath.getPoint((carPosition + carSpeed) % 1);

      let newPos = currPoint.applyMatrix4(roadMatrixTransform);
      let newNextPos = nextPoint.applyMatrix4(roadMatrixTransform);
      if (oppositeDirection) {
        currPoint = roadPath.getPoint(carPosition % 1);
        nextPoint = roadPath.getPoint(0);
        newPos = currPoint.applyMatrix4(roadMatrixTransform);
        newNextPos = nextPoint.applyMatrix4(roadMatrixTransform);
      }

      newPos.add(offSet);
      newNextPos.add(offSet);

      car.position.copy(newPos);
      car.lookAt(newNextPos);

      car.rotation.z = 0;
      spotLightRef.current?.target.position.copy(newNextPos);
      spotLightRef.current?.target.updateMatrixWorld();
      carPosition += carSpeed;
      if (carPosition <= 0.01) {
        carPosition = 100;
      }
    }
  });
  return (
    <mesh ref={carRef}>
      <spotLight
        intensity={0.4}
        ref={spotLightRef}
        color="orange"
        position={[0, 0, 0]}
      />
      <boxGeometry args={[1.5, 1, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Car;
