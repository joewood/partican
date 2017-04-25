# Partican

A React component for a WebGL GPU Particle System organized as a series of beizer lines.

## Description

A pure WebGL component where each particle belongs to a bezier line between two points. The component can contain
any number of lines. The number of particles in each line is determined by the `ratePerSecond` property. The animation
interval is assumed to be 1 second.

The component contains internal state of the previous rate. This allows the rate to be adjusted smoothly, with the 
previous set of particles animating out of the system before the next arrives.

## Installation

Assuming you're using **webpack** or **browserify**:

```
npm install partican
```

Package comes with types built in (it's written using TypeScript).

Live demo at [joewood.github.io/edge-flow](http://joewood.github.io/#edge-flow)

## Simple Directed Graph Usage

```jsx
import { ParticleEdge, ParticleCanvas } from "edge-flow"

:: ::

render() {
    return (
        <EdgeFlowDag style={{backgroundColor:"#0f0f0f",height:600,width:600}} run={true}>
            <NodeDag key="1" id="node-1" label="node-1' labelColor="white" >
                <EdgeDag linkTo="node-2" ratePerSecond={30} color="blue" size={2} />
            </NodeDag>
            <NodeDag key="2" id="node-2" label="node-2' labelColor="white">
                <EdgeDag linkTo="node-3" ratePerSecond={30} color="red" shape={0.2}/>
            </NodeDag>
            <NodeDag key="3" id="node-3" label="node-3' labelColor="white">
                <EdgeDag linkTo="node-1" ratePerSecond={30}  color="pink" shape={0.8} size={10} />
            </NodeDag>
        </EdgeFlowDag>
    );
}

```                     




## Usage

```jsx
import { EdgeFlow, Node, Edge } from "edge-flow"

:: ::

render() {
    return (
        <EdgeFlow style={{backgroundColor:"#0f0f0f",height:600,width:600}} run={true}>
            <Node key="1" id="node-1" label="node-1' center={{x:30,y:20}} labelColor="white" >
                <Edge linkTo="node-2" ratePerSecond={30} color="blue" size={2} />
            </Node>
            <Node key="2" id="node-2" label="node-2' center={{x:530,y:120}} labelColor="white">
                <Edge linkTo="node-3" ratePerSecond={30} variationMin={-0.01} variationMax={0.05} color="red" shape={0.2}/>
            </Node>
            <Node key="3" id="node-3" label="node-3' center={{x:330,y:520}} labelColor="white">
                <Edge linkTo="node-1" ratePerSecond={30} variationMin={-0.06} variationMax={0.06} color="pink" shape={0.8} size={10} />
            </Node>
        </EdgeFlow>
    );
}
```                     

# Components and Properties

## Animated Directed Acrylic Graph - EdgeFlowDag

For a live demo see [here](http://joewood.github.io/#network).

## ParticleCanvas

Main underlying component providing absolute positioning

Prop                  | Datatype | Description
----------------------|----------|------------
style:                | Style... |
style.backgroundColor | string   | Background Color of the canvas
style.height          | number   | Size of the Graph, pixels
style.width           | number   | Size of the Graph
run                   | boolean  | Animate Graph 


## ParticleEdge

Child component of a Node. Indicates which other Nodes this Node links to.

Prop                  | Datatype | Description
----------------------|----------|------------
ratePerSecond         | number   | How many particles animating per second through the edge
style.variationMin?   | number   | The minimum width of the Edge for random dispersal (default -0.01)
style.variationMax?   | number   | The maximum width of the Edge for random dispersal (default 0.01)
style.color?          | string   | Color of the particle (or color at starting position)
style.endingColor?    | string   | Color of the particle at the target position (optional, defaults to starting color) 
style.shape?          | number   | Roundness of particle range 0..1 - 1 being circle, 0 being square
style.size?           | number   | Size of the particles (range 1..20)
nonrandom             | boolean  | Use regular particle points evenly dispersed on the timeline
p0, p1                | {x,y}    | Origin and terminator of the line
p2?, p3?              | {x,y}    | Cubic bezier control points (optional)
