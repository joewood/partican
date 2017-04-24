precision mediump float;

//// ****   inputs- variants:
//* edgeData - array edges x fields (below)
uniform sampler2D edgeData;
// Input Parameters for the rows in the texture
// edgeCount - size of edgeData edges
//    * colorRow - index of starting color of the edge
uniform float colorRow;
//    * sizeRoundnessRow - index of sizeRoundness of particle
uniform float sizeRoundnessRow;
//    * bezierRow - index of bezierPoints points (p1,p2)
uniform float bezierRow;
//    * vertexRow - index of source/target (p0,p3);
uniform float vertexRow;
//    * endColorRow - index of ending color
uniform float endColorRow;
//    * variationRow - index of variation (minx(x,y),max(x,y))
uniform float variationRow;
//    * startEndTime - [b1*2^24,b2][e1^224,e2]
uniform float startEndTimeRow;

//* worldsize - size of target sample
uniform vec2 worldsize;
//* clockLsf - The clock time least significant float. 1/65536 for each ms
uniform float clockLsf;
//* clockMsf - The clock time most significant float. 1/65536 for each 65.536 seconds
uniform float clockMsf;
// number of edges
uniform float edgeCount;

////// ** OUTPUTS
varying vec4 outColor;
varying float outRoundness;
const float nodeVariation = 0.005; 

// *** Attributes Vary With Each Particle from the Array
// time - set at a different offset for each particle
attribute float time;
// edge Index - references the descriptor of the edge in the sample - i.e. which edge does this particle belong
attribute float edgeIndex;  


float random(vec2 co) {
    return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 toBezier(float t, vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
    float u = 1.0-t;
    float tt = t*t;
    float uu = u*u;
    float uuu = uu*u;
    float ttt = tt*t;
    vec2 p = uuu*p0;
    p = p + 3.0 * uu * t * p1;
    p = p + 3.0 * u * tt * p2;
    p = p + ttt * p3;
    return p;
}

// For a sample point (as a vec2 fraction) return the time in seconds seconds
float toSeconds(vec2 timeSample) {
    return (floor(timeSample.y*65536.0)+timeSample.x)*65.536;
}

float subtract(vec2 time1, vec2 time2) {
    float msf = time1.y-time2.y;
    float lsf = time1.x-time2.x;
    // don't bother doing carry - just work with negatives
    return toSeconds( vec2(lsf,msf));
}

void main() {
    // ** Read In Per Edge Variables from texture using the edgeIndex
    vec4 startEndPoints = texture2D(edgeData,vec2(edgeIndex/edgeCount,vertexRow));
    vec4 bezierPoints = texture2D(edgeData,vec2(edgeIndex/edgeCount,bezierRow));
    vec4 variations = texture2D(edgeData,vec2(edgeIndex/edgeCount,variationRow)); 
    vec4 sizeRoundness = texture2D(edgeData,vec2(edgeIndex/edgeCount,sizeRoundnessRow)); // vector sizeRoundness in fourth row (size,sizeRoundness,unused,unused)
    vec4 startEndTime = texture2D(edgeData,vec2(edgeIndex/edgeCount,startEndTimeRow));
    
    // time x(seconds) + y(fractions)
    float startTime = toSeconds(startEndTime.xy);
    float endTime=  toSeconds(startEndTime.zw);
    vec2 clockVec = vec2( clockLsf,clockMsf);
    vec2 startTimeVec = startEndTime.xy;
    vec2 endTimeVec = startEndTime.zw;

    // if no end time then time is  (clock-startTime+timeOffset) % 1 second
    float seconds = subtract(clockVec, startTimeVec)+time;
    float timefrac  = 0.0;
    float timePos = mod(seconds,1.0);
    // if no end specified, check that 
    if (endTime==0.0) { 
        if (seconds<0.0) {
            gl_PointSize = 0.0;
            gl_Position = vec4(0.0,0.0,0.0,1.0);
            return;
        }
    } else {
        // otherwise time is (timeoffset+endTime % 1 second)+(clock-end)
        float endDelta = subtract(endTimeVec,clockVec);
        if ((endDelta+timePos)<0.0) {
            gl_PointSize = 0.0;
            gl_Position = vec4(0.0,0.0,0.0,1.0);
            return;
        }
    }
    timefrac = timePos;
    
    // vector coordinates in clockSeconds row
    // vector variations (randomness) in third row (min,max,mid,seed)
    float seed = variations.w;
    float rnd = random(vec2(time,0));
    vec2 from = startEndPoints.xy;
    vec2 to = startEndPoints.zw;
    if (variations.z!=0.0) {
        startEndPoints.xy += (nodeVariation * rnd-nodeVariation/2.0); 
        to += (nodeVariation * rnd-nodeVariation/2.0);
    }
    vec2 middle = vec2(rnd * variations.z + variations.x,rnd * variations.z + variations.x);
    vec2 mid = toBezier(0.5, from, bezierPoints.xy, bezierPoints.zw, to); 

    // position is linear between source and target
    vec2 p1 = toBezier(timefrac, from, bezierPoints.xy, bezierPoints.zw, to);

    // add some variation with a mixed in mid point 0t=0 0.25t=0.25(0.15) 0.5t=0.5(0.15) 1t=0
    vec2 p = mix(p1,middle+mid,clamp(0.5-abs(timefrac-0.5),0.0,0.15));

    vec4 color = texture2D(edgeData,vec2(edgeIndex/edgeCount,colorRow));
    vec4 endColor = texture2D(edgeData,vec2(edgeIndex/edgeCount,endColorRow));
    outColor = mix(color,endColor,timefrac);

    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = 256.0 * sizeRoundness.x;
    outRoundness = sizeRoundness.y;
}