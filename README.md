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

Live demo at [joewood.github.io/partican](http://joewood.github.io/#partican)

## Properties

Prop                        | Datatype | Description
----------------------------|----------|------------
style:                      | Style... |
style.backgroundColor       | string   | Background Color of the canvas
style.height                | number   | Size of the Graph, pixels
style.width                 | number   | Size of the Graph
animate                     | boolean  | Animate Graph 
particleStyle               | ParticleStyle | Default properties applied to each line's particles
particleStyle.variationMin? | number   | The minimum width of the Edge for random dispersal (default -0.01)
particleStyle.variationMax? | number   | The maximum width of the Edge for random dispersal (default 0.01)
particleStyle.color?        | string   | Color of the particle (or color at starting position)
particleStyle.endingColor?  | string   | Color of the particle at the target position (optional, defaults to starting color) 
particleStyle.roundess?     | number   | Roundness of particle range 0..1 - 1 being circle, 0 being square
particleStyle.size?         | number   | Size of the particles (range 1..20)

## Child ParticleEdge Propertes

Prop                        | Datatype | Description
----------------------------|----------|------------
ratePerSecond               | number   | How many particles animating per second through the edge
nonrandom                   | boolean  | Use regular particle points evenly dispersed on the timeline
p0, p3                      | {x,y}    | Origin and terminator of the line
p1?, p2?                    | {x,y}    | Cubic bezier control points (optional)
particleStyle               | ParticleStyle | Default properties applied to each line's particles
particleStyle.variationMin? | number   | The minimum width of the Edge for random dispersal (default -0.01)
particleStyle.variationMax? | number   | The maximum width of the Edge for random dispersal (default 0.01)
particleStyle.color?        | string   | Color of the particle (or color at starting position)
particleStyle.endingColor?  | string   | Color of the particle at the target position (optional, defaults to starting color) 
particleStyle.roundess?     | number   | Roundness of particle range 0..1 - 1 being circle, 0 being square
particleStyle.size?         | number   | Size of the particles (range 1..20)


