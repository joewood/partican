import { useState, useEffect, Children, useRef } from "react";
// import * as React from "react";
import * as THREE from 'three'
import { keyBy, map, Dictionary } from "lodash";
import Particles, { IParticleEdge } from "./particles";
import { IParticleStyle } from "./model";
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'

import { ParticleScheduleState } from "./particle-edge";

export interface IProps {
  style: {
    width: number;
    height: number;
    backgroundColor?: string;
  };
  /** The default values for the particle style in each edge  */
  particleStyle?: IParticleStyle;
  defaultRatePerSecond?: number;
  children?: any;
  run?: boolean;
}

export interface IState {}

const ParticleCanvas: React.SFC<IProps> = ({
  particleStyle,
  run,
  style: { width, height, backgroundColor },
  children
}) => {
  const canvas = useRef<HTMLCanvasElement>();
  const particles = useState<Particles | null>(null);
  const edgeState = useState<Dictionary<ParticleScheduleState>>({});

  useEffect(() => {
    if (!canvas) return;
    const edgeChildren = keyBy(Children.toArray(children) as { key: string; props: IParticleEdge }[], c => c.key);
    map(edgeChildren, (v, k) => {
      const style = { ...particleStyle, ...particleStyle };
      if (!edgeState[k]) {
        edgeState[k] = new ParticleScheduleState({ ...v.props, particleStyle: style });
      } else {
        edgeState[k].updateProps({ ...v.props, particleStyle: style });
      }
    });
    particles.updateBuffers(Object.values(edgeState), width, height);
    particles.draw();
    if (run) particles.start();
  }, [canvas, width, height, backgroundColor, run, particles]);

  useEffect(() => {
    if (!!particles) setupParticles(newProps);
    if (!!particles && run) particles.start();
    else this.particles.stop();
  }, [run, particles]);

  // public componentWillUnmount() {
  //   if (!!this.particles) {
  //     this.particles.stop();
  //   }
  // }

  // const lostContext = event => {
  //   event.preventDefault();
  //   const _particles = particles;
  //   particles = null;
  //   _particles.stop();
  // };

  const setupNewCanvas = (_canvas: HTMLCanvasElement) => {
    if (canvas.current === _canvas || !_canvas) return;
    if (canvas.current !== _canvas) {
      canvas = _canvas;
      if (!canvas) return;
      canvas.current.addEventListener("webglcontextlost", this.lostContext, false);
      this.canvas.addEventListener("webglcontextrestored", () => this.setupNewCanvas(this.canvas), false);
    }
    if (!!particles) {
      particles.stop();
      particles = null;
    }
    if (!particles && !!canvas.current) {
      particles = new Particles({ canvas: canvas.current, size: 2 });
    }
    setupParticles(this.props);
  };

  return (
    <Canvas
    camera={{ fov: 100, position: [0, 0, 30]}}>
    <pointLight distance={60} intensity={2} color="white" />
    <spotLight intensity={2} position={[0, 0, 70]} penumbra={1} color="red" />
    <mesh>
      <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
      <meshStandardMaterial attach="material" color="#00ffff" depthTest={false} />
    </mesh>
    </Canvas>
  );
};
