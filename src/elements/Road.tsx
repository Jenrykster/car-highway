import { forwardRef } from "react";
import { CatmullRomCurve3, Vector2, Shape } from "three";

interface IRoadProps {
  width: number;
  path: CatmullRomCurve3;
  deepness: number;
  back?: boolean;
}

const StaticRoad = forwardRef(
  ({ width, path, deepness, back }: IRoadProps, ref) => {
    const shape = new Shape();
    shape.moveTo(0, -width / 2);
    shape.lineTo(0, width / 2);
    shape.lineTo(deepness, width / 2);
    shape.lineTo(deepness, 0);
    shape.lineTo(0, 0);
    const settings = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: path,
    };

    const distance = -30;
    const normPos = [35, -10, distance];
    const backPos = [40, -6.7, distance - 10];

    const rot = [-1.25, 0, 1.25];
    const zero = [-0.25, 0, 0.25];
    return (
      <mesh ref={ref} position={back ? backPos : normPos} rotation={rot}>
        <extrudeGeometry args={[shape, settings]} />
        <meshStandardMaterial color={"gray"} />
      </mesh>
    );
  }
);

export default StaticRoad;
