varying vec2 v_uv;
uniform vec2 resolution;
uniform float time;

#define SKEW 0.366025404 // (sqrt(3)-1)/2;
#define UNSKEW 0.211324865 // (3-sqrt(3))/6;

// define material here. reserve 0-10 for lights.
#define LIGHT 0
#define BODY 11
#define EYE 12
#define CONE 13

#define MAX_DIST 10.

// #define LIGHT_BALL_NUM 3

// #define ANTI_ALIAS true
#define ANIMATE 1.
vec3 lightPos = vec3(1., 0.45, 1.75);
vec3 lightColor = vec3(1., 0.79, 0.);
float lightRad = 0.4;

// vec3 eyeColor = vec3(1., 0.95, 0.);
vec3 eyeColor = vec3(1., 0, 0.);
vec3 bodyColor = vec3(0.643, 0.776, 0.223);
vec3 coneColor = eyeColor;

vec3 andyPos = vec3(0.,0.,0.);

#define DENSITY_MULTIPLIER 5.
#define MAX_STEPS 64

bool isLight(int matId) {
    return matId < 11;
}

// CSG operations
float _union(float a, float b) {
    return min(a, b);
}

float intersect(float a, float b) {
    return max(a, b);
}

float difference(float a, float b) {
    return max(a, -b);
}

// given segment ab and point c, computes closest point d on ab
// also returns t for the position of d, d(t) = a + t(b-a)
vec3 closestPtPointSegment(vec3 c, vec3 a, vec3 b, out float t) {
    vec3 ab = b - a;
    // project c onto ab, computing parameterized position d(t) = a + t(b-a)
    t = dot(c - a, ab) / dot(ab, ab);
    // clamp to closest endpoint
    t = clamp(t, 0.0, 1.0);
    // compute projected position
    return a + t * ab;
}

// primitive functions
// these all return the distance to the surface from a given point
float plane(vec3 p, vec3 planeN, vec3 planePos) {
    return dot(p - planePos, planeN);
}

float sphere(vec3 p, float r) {
    return length(p) - r;
}

// capsule in Y axis
float capsuleY(vec3 p, float r, float h) {
    p.y -= clamp(p.y, 0.0, h);
    return length(p) - r;
}

float halfSphere(vec3 p, float r) {
    return difference(sphere(p, r),
        plane(p, vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 0.0)) );
}

float capsule(vec3 p, vec3 a, vec3 b, float r) {
    float t;
    vec3 c = closestPtPointSegment(p, a, b, t);
    return length(c - p) - r;
}

// infinite cone
float sdCone(vec3 p, vec2 c) {
    // c is the sin/cos of the angle
    vec2 q = vec2( length(p.xz), -p.y );
    float d = length(q-c*max(dot(q,c), 0.0));
    return d * ((q.x*c.y-q.y*c.x<0.0)?-1.0:1.0);
}

float sdCone(vec3 p, vec2 c, float h) {
  // c is the sin/cos of the angle, h is height
  // Alternatively pass q instead of (c,h),
  // which is the point at the base in 2D
  vec2 q = h*vec2(c.x/c.y,-1.0);
    
  vec2 w = vec2( length(p.xz), p.y );
  vec2 a = w - q*clamp( dot(w,q)/dot(q,q), 0.0, 1.0 );
  vec2 b = w - q*vec2( clamp( w.x/q.x, 0.0, 1.0 ), 1.0 );
  float k = sign( q.y );
  float d = min(dot( a, a ),dot(b, b));
  float s = max( k*(w.x*q.y-w.y*q.x),k*(w.y-q.y)  );
  return sqrt(d)*sign(s);
}

// transforms
vec3 rotateX(vec3 p, float a) {
    float sa = sin(a);
    float ca = cos(a);
    vec3 r;
    r.x = p.x;
    r.y = ca*p.y - sa*p.z;
    r.z = sa*p.y + ca*p.z;
    return r;
}

vec3 rotateY(vec3 p, float a) {
    float sa = sin(a);
    float ca = cos(a);
    vec3 r;
    r.x = ca*p.x + sa*p.z;
    r.y = p.y;
    r.z = -sa*p.x + ca*p.z;
    return r;
}

// some noise functions

vec3 hash(vec3 p) {
	p = fract(p * vec3(.3456, .1234, .9876));
    p += dot(p, p.yxz+43.21);
    p = (p.xxy + p.yxx)*p.zyx;
    return (fract(sin(p)*4567.1234567)-.5)*2.;
}

vec3 hash33(vec3 p) {
    p = fract(p * vec3(0.1031, 0.11369, 0.13787));
    p += dot(p, p.yzx + 19.19);
    return fract(vec3((p.x + p.y) * p.z, (p.x + p.z) * p.y, (p.y + p.z) * p.x));
}

float perlin(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    
    vec3 u = f * f * (3.0 - 2.0 * f);
    
    vec3 a = hash33(i + vec3(0.0, 0.0, 0.0));
    vec3 b = hash33(i + vec3(1.0, 0.0, 0.0));
    vec3 c = hash33(i + vec3(0.0, 1.0, 0.0));
    vec3 d = hash33(i + vec3(1.0, 1.0, 0.0));
    vec3 e = hash33(i + vec3(0.0, 0.0, 1.0));
    vec3 g = hash33(i + vec3(1.0, 0.0, 1.0));
    vec3 h = hash33(i + vec3(0.0, 1.0, 1.0));
    vec3 j = hash33(i + vec3(1.0, 1.0, 1.0));

    float k0 = dot(a, f - vec3(0.0, 0.0, 0.0));
    float k1 = dot(b, f - vec3(1.0, 0.0, 0.0));
    float k2 = dot(c, f - vec3(0.0, 1.0, 0.0));
    float k3 = dot(d, f - vec3(1.0, 1.0, 0.0));
    float k4 = dot(e, f - vec3(0.0, 0.0, 1.0));
    float k5 = dot(g, f - vec3(1.0, 0.0, 1.0));
    float k6 = dot(h, f - vec3(0.0, 1.0, 1.0));
    float k7 = dot(j, f - vec3(1.0, 1.0, 1.0));

    float k = mix(k0, k1, u.x);
    float l = mix(k2, k3, u.x);
    float m = mix(k4, k5, u.x);
    float n = mix(k6, k7, u.x);
    float o = mix(k, l, u.y);
    float q = mix(m, n, u.y);
    
    return mix(o, q, u.z);
}

vec3 getLightPos() {
    float speed = 1.;
    return rotateY(lightPos - andyPos, time * speed * ANIMATE) + andyPos;
}

float andy(vec3 pos, float delta, out int matId) {
    float d = 1e10;
    pos.x = abs(pos.x);  // mirror in X
    matId = BODY;

    // head
    d = halfSphere(pos, 1.0);

    // antennas
    d = _union(d, capsule(pos, vec3(0.4, 0.7, 0.0), vec3(0.75, 1.2, 0.0), 0.05));

    // body
    d = _union(d, capsuleY((pos*vec3(1.0, 4.0, 1.0) - vec3(0.0, -4.6, 0.0)), 1.0, 4.0));

    // arms
    d = _union(d, capsuleY(rotateX(pos, sin(delta)) - vec3(1.2, -0.9, 0.0), 0.2, 0.7));

    // legs
    d = _union(d, capsuleY(pos - vec3(0.4, -1.8, 0.0), 0.2, 0.5));

    float dEyes = sphere(pos + vec3(-0.35, -0.5, 0.75), /* eye size= */ 0.075);
    if (dEyes < d)
    {
        matId = EYE;
    }
    // eyes
    d = _union(d, dEyes);

    return d;
}

vec3 getLeftBeamPos(out vec3 dir) {
    dir = rotateY(rotateX(vec3(0,1,0), -1.45), 0.1);
    return andyPos - vec3(0.35, -0.5, 0.75) + dir * 0.1;
}

vec3 getRightBeamPos(out vec3 dir) {
    dir = rotateY(rotateX(vec3(0,1,0), -1.45), -0.1);
    return andyPos - vec3(-0.35, -0.5, 0.75) + dir * 0.1;
}

float pointLight(vec3 pos, float rad) {
    return sphere(pos, rad);
}

// TODO: remove as we are now using a line instead of cone sdf for the laser beams
float getEyeBeam(vec3 p) {
    // TODO fix the pos and transform
    vec3 leftBeamPos = andyPos + vec3(-0.35, 0.8, 1.2);
    vec3 rightBeamPos = andyPos + vec3(0.35, 0.8, 1.2);
    float left = sdCone(rotateY(rotateX(p - leftBeamPos, -1.45), 0.1), vec2(0.005, 0.12), 7.);
    float right = sdCone(rotateY(rotateX(p - rightBeamPos, -1.45), 0.1), vec2(0.005, 0.12), 7.);

    return _union(left, right);
}

float getDensity(float d, vec3 p) {
    // returns high density when it's inside
    float baseDensity = max(0., -d);
    float SHARPNESS = 1.4;
    baseDensity = pow(baseDensity, SHARPNESS);
    // TODO: think about noise...
    // float noise = perlin(p + time * 1.2) * 0.5 + 0.5;

    // return baseDensity * noise * DENSITY_MULTIPLIER;
    return baseDensity * DENSITY_MULTIPLIER;
}

// infinite lines
float distanceBetweenLines(vec3 a0, vec3 aDir, vec3 b0, vec3 bDir) {
    vec3 d = b0 - a0;
    vec3 c = cross(aDir, bDir);
    float cLen = length(c);

    return abs(dot(d, c)) / cLen;
}

// Calculates the squared shortest distance between two line segments in 3D.
// Seg1: P0 + s*u  (0 <= s <= 1)
// Seg2: Q0 + t*v  (0 <= t <= 1)
float segmentToSegmentDistanceSq(
    vec3 P0, vec3 P1, // Segment 1 endpoints
    vec3 Q0, vec3 Q1,  // Segment 2 endpoints
    out vec3 closestP, out vec3 closestQ // point on the line segs
) {
    // Direction vectors
    vec3 u = P1 - P0;
    vec3 v = Q1 - Q0;
    vec3 w0 = P0 - Q0; // Vector between start points

    // Coefficients for the quadratic equation
    float a = dot(u, u); // Squared length of u
    float b = dot(u, v);
    float c = dot(v, v); // Squared length of v
    float d = dot(u, w0);
    float e = dot(v, w0);

    // Determinant (always non-negative)
    float denom = a * c - b * b;

    float s, t; // Segment parameters

    // Check if segments are parallel (denom is near zero)
    if (denom < 1e-6) {
        // Segments are nearly parallel.
        // Pick s = 0 and clamp t, then try s = 1 and clamp t,
        // but for simplicity and robustness in GLSL, we'll
        // just set s = 0 and clamp t, as one of the endpoints of
        // segment 1 will be involved in the closest point pair.
        s = 0.0;
        t = clamp(e / c, 0.0, 1.0); // Clamp t along v
    } else {
        // Segments are not parallel. Find the closest points on the infinite lines.
        s = (b * e - c * d) / denom;
        t = (a * e - b * d) / denom;

        // Clamp the parameters s and t to the [0, 1] range of the segments
        if (s < 0.0) {
            s = 0.0;
            // The minimum must lie on the segment s=0, so re-clamped t is needed
            t = clamp(-d / a, 0.0, 1.0);
        } else if (s > 1.0) {
            s = 1.0;
            // The minimum must lie on the segment s=1, so re-clamped t is needed
            t = clamp((b - d) / a, 0.0, 1.0);
        } else if (t < 0.0) {
            t = 0.0;
            // The minimum must lie on the segment t=0, so re-clamped s is needed
            s = clamp(-d / a, 0.0, 1.0);
        } else if (t > 1.0) {
            t = 1.0;
            // The minimum must lie on the segment t=1, so re-clamped s is needed
            s = clamp((b - d) / a, 0.0, 1.0);
        }
        // If s and t are both in [0, 1], they represent the closest points
        // and no further clamping or re-projection is needed.
    }

    // Compute the difference vector between the closest points
    closestP = P0 + s * u;
    closestQ = Q0 + t * v;

    vec3 diff = closestP - closestQ;
    // vec3 diff = w0 + s * u - t * v;

    return dot(diff, diff); // Return the squared distance
}

// 1) the laser beam should cast shadow
// 2) depending on the dist between the camera ray and the laser beam, it should contribute more?
float getEyeBeamShadow() {
    return 0.;
}

float getEyeBeamContribution(vec3 ro, vec3 re, vec3 laserOrigin, vec3 laserEnd) {
    vec3 closestOnRay;
    vec3 closestOnLaser;

    float d = segmentToSegmentDistanceSq(ro, re, laserOrigin, laserEnd, closestOnRay, closestOnLaser);

    // TODO: use a 3D noise texture
    float noise = perlin(closestOnRay * 5. + time * 2. * vec3(0.3, 0.4, 0.5)) * 0.5 + 0.5;
    // when d is close to 0, we want the max contribution; we want to fall off quickly
    return exp(-d * 150.) * noise;
}

// scene with solid surfaces
float scene(vec3 p, out int matId) {
    float d = 1e10;
    d = andy(p - andyPos, time, matId);

    float dPointLight = sphere(p - getLightPos(), lightRad);
    if (dPointLight < d)  {
        matId = LIGHT;
    }
    d = _union(d, dPointLight);

    return d;
}

// calculate scene normal
vec3 sceneNormal( in vec3 pos ) {
    int matId = BODY;
    float eps = 0.0001;
    vec3 n;
    n.x = scene( vec3(pos.x+eps, pos.y, pos.z), matId ) - scene( vec3(pos.x-eps, pos.y, pos.z), matId );
    n.y = scene( vec3(pos.x, pos.y+eps, pos.z), matId ) - scene( vec3(pos.x, pos.y-eps, pos.z), matId );
    n.z = scene( vec3(pos.x, pos.y, pos.z+eps), matId ) - scene( vec3(pos.x, pos.y, pos.z-eps), matId );
    return normalize(n);
}

// march ray using sphere tracing
// surface raymarching (for solid surfaces)
vec3 march(vec3 ro, vec3 rd, out bool hit, out int matId, out float distTraveled) {
    const float hitThreshold = 0.01;
    hit = false;
    vec3 pos = ro;
    vec3 hitPos = ro;
    // we use this for volume/light to stop marching when there's a solid surface that's closer.
    float totalDist = 0.;

    for(int i=0; i < MAX_STEPS; i++) {
        matId = BODY;
        float d = scene(pos, matId);
        totalDist += d;
        if (d < hitThreshold) {
            hit = true;
            hitPos = pos;
        }
        pos += d*rd;
    }

    // it's possible that we have used up max steps before we reach any surface.
    // so if there's no hit, we make distTraveled MAX_DIST.
    // otherwise we set to totalDist with clamping.
    if (hit) {
        distTraveled = min(totalDist, MAX_DIST);
    } else {
        distTraveled = MAX_DIST;
    }
    return hitPos;
}

vec4 volumeMarch(vec3 ro, vec3 rd, float maxDist, out float totalDistTraveled) {
    // loop through the volume
    // accumulated color and opacity
    vec4 acc = vec4(0.0, 0.0, 0.0, 0.0); // Start with black color, fully transparent.
    vec3 pos = ro;

    // float stepSize = MAX_DIST / float(MAX_STEPS);
    // float distTraveled = 0.;

    // for (int i = 0; i < MAX_STEPS; i++) {
    //     pos += stepSize * rd;
    //     distTraveled += stepSize;
    //     // there's some solid surface that's closer to the camera
    //     if (distTraveled > maxDist) {
    //         break;
    //     }
    //     float dEyeBeam = getEyeBeam(pos);
    //     float density = getDensity(dEyeBeam, pos);
    //     float extinction = density * stepSize;

    //     // new color = old color + transparency * scattered color
    //     // scattered color = original beam color * extinction
    //     vec3 scatteredColor = coneColor * extinction;
    //     // accumulate the color, the new color scattered at this step can only contributed
    //     // as much as the light that makes it to that point, meaning transparency.
    //     acc.rgb += (1. - acc.a) * scatteredColor;
    //     // now we need to update the opacity
    //     // opacity is old opacity + extinction.
    //     acc.a += (1. - acc.a) * extinction;
    //     // Check for early exit (e.g., if the volume is fully opaque)
    //     if (acc.a > 0.999) break; 

    // }
    // totalDistTraveled = distTraveled;

    bool laserHit;
    int laserMatId = 0;
    float laserDistTraveled;
    
    vec3 leftLaserDir;
    vec3 leftLaserPos = getLeftBeamPos(leftLaserDir);
    vec3 laserHitPos = march(leftLaserPos, leftLaserDir, laserHit, laserMatId, laserDistTraveled);
    float leftLaser = getEyeBeamContribution(ro, ro + rd * maxDist, leftLaserPos, leftLaserPos + leftLaserDir * laserDistTraveled);

    vec3 rightLaserDir;
    vec3 rightLaserPos = getRightBeamPos(rightLaserDir);
    laserHitPos = march(rightLaserPos, rightLaserDir, laserHit, laserMatId, laserDistTraveled);
    float rightLaser = getEyeBeamContribution(ro, ro + rd * maxDist, rightLaserPos, rightLaserPos + rightLaserDir * laserDistTraveled);

    acc.r += leftLaser;
    acc.r += rightLaser;

    // return vec4(maxDist * 0.1, 0., 0., 1.);
    
    return acc;
}

vec3 computeLight(vec3 pointLightPos, vec3 cam, vec3 pos, vec3 n, vec3 pointLightColor) {
    vec3 l = normalize(pointLightPos - pos);
    vec3 v = normalize(cam - pos);
    vec3 h = normalize(v + l);

    vec3 diffuse = /* attenuation= */ 0.5 * pointLightColor * max(0.0, dot(n, l));
    vec3 spec = pointLightColor * pow(max(0.0, dot(n, h)), /* shininess= */ 100.);

    return diffuse + spec;
}

// lighting
vec4 shade(vec3 pos, vec3 n, vec3 cam, int matId) {
    // shoot a ray towards the point light
    vec3 pointLightContribution = vec3(0,0,0);
    bool hit = false;
    int materialId = matId;
    float maxDist = MAX_DIST;
    vec3 lightDir = normalize(getLightPos()-pos);
    vec3 lightHitPos = march(pos + n * 0.001, lightDir, hit, materialId, maxDist);

    if (hit && isLight(materialId)) {
        // in order to make it unbised, we should multiply a pdf (probability distribution function) to the contribution - the probability of picking up the ray if we randomly picked the ray on the hemisphere.
        pointLightContribution += computeLight(getLightPos(), cam, pos, n, lightColor);
    }

    if (matId == EYE) {
        return vec4(eyeColor, 1.0);
    }

    if (matId == BODY) {
        return vec4(bodyColor * pointLightContribution, 1.0);
    }

    // if (matId == CONE) {
    //     return vec4(coneColor, 1.0);
    // }

    if (isLight(matId)) {
        return vec4(lightColor, 1.0);
        // return vec4(lightColor * pointLightContribution, 1.0);
    }

    // fallback to black
    return vec4(0.,0.,0.,1);
}

float rand(vec3 co) {
    return fract(sin( dot(co.xyz ,vec3(12.9898,78.233,45.5432) )) * 43758.5453);
}

// get a random point on the surface of a unit hemisphere
vec3 randomPointOnSurfaceOfUnitHemisphere(vec3 pos) {
    float PI = 3.141592;
    float theta = 2. * 3.141592 * rand(pos);
    float phi = acos(1. - 2. * rand(pos));
    float x = sin(phi) * cos(theta);
    float y = sin(phi) * sin(theta);
    float z = cos(phi);

    return vec3(x, y, z);
}

vec4 raycolor(vec3 rayOrigin, vec3 rayDir) {
    bool hit;
    int matId;
    float maxDist;

    vec3 t = march(rayOrigin, rayDir, hit, matId, maxDist);

    vec4 surfaceColor;
    if (hit) {
        vec3 sceneNormal = sceneNormal(t);
        surfaceColor = shade(t, sceneNormal, rayOrigin, matId);
    } else {
        // background color
        surfaceColor = vec4(0.007843138,0.145098,0.145098,1);
    }

    float totalDistTraveled;
    vec4 volumeResult = volumeMarch(rayOrigin, rayDir, maxDist, totalDistTraveled);
    vec3 volumeColor = volumeResult.rgb;
    float volumeOpacity = volumeResult.a;
    // alpha blending
    // return vec4(volumeColor, 1.);
    return surfaceColor + (1.-volumeOpacity) * volumeResult;
    // return surfaceColor + volumeResult;
    // return vec4(volumeOpacity, 0, 0, 1.);
}

void main() {
    vec2 pixel = v_uv * 2.0 - 1.0;

    float aspectRatio = resolution.x / resolution.y;
    vec3 rayDir = normalize(vec3(aspectRatio * pixel.x, pixel.y, 2.0));
    // vec3 raydx = dFdx(rayDir);
    // vec3 raydy = dFdy(rayDir);
    vec3 rayOrigin = vec3(0.0, 0.0, -5.);
    float angle = time * 0.1;
    rayOrigin = rotateY(rayOrigin, angle);
    rayDir = rotateY(rayDir, angle);
    
    gl_FragColor = raycolor(rayOrigin, rayDir);
    // gl_FragColor = vec4(v_uv, 0., 1.);

    // enable anti-alias
    //vec4 color = vec4(0,0,0,0);
    //for (float x=0.; x<4.; x++) {
        //for (float y=0.; y<4.; y++) {
            //vec3 rd = rayDir + raydx * (x-1.5) * 0.5 + raydy * (y-1.5) * 0.5;
            //color += raycolor(rayOrigin, rd);
       //}
    //}
    //fragColor = color / 16.;
}