precision mediump float;
precision mediump int;
varying vec2 v_uv;
uniform vec2 resolution;
uniform float time;

// define material here. reserve 0-10 for lights.
// #define POINT_LIGHT_0 0
// #define POINT_LIGHT_1 1
// #define POINT_LIGHT_2 2
// #define POINT_LIGHT_3 3
// #define POINT_LIGHT_4 4
// #define BODY 11
// #define EYE 12

// #define LIGHT_BALL_NUM 3

// #define ANTI_ALIAS true
// #define ANIMATE 1.

// vec3 lightBallPositions[LIGHT_BALL_NUM] = vec3[](
//     vec3(2., 0.4, 16.),
//     vec3(-2., -1.77, 16.),
//     vec3(1.86, -0.49, 14.)
// );
// vec3 lightBallColors[LIGHT_BALL_NUM] = vec3[](
//     vec3(1., 0.63, 0.63),  // pink-ish
//     vec3(1., 0.79, 0.),  // yellow-ish
//     vec3(0.75, 1., 0.8)  // green-ish
// );
// float lightBallSpeeds[LIGHT_BALL_NUM] = float[](
//     1.0,  // pink-ish
//     -0.8,  // yellow-ish
//     1.4  // green-ish
// );
// vec3 eyeColor = vec3(1., 0.95, 0.);
// vec3 bodyColor = vec3(0.643, 0.776, 0.223);

// float lightBallRadiuses[LIGHT_BALL_NUM] = float[](0.2, 0.3, 0.35);
// vec3 andyPos = vec3(0.,0.,15.);

// bool isLight(int matId) {
//     return matId < 11;
// }

// // CSG operations
// float _union(float a, float b) {
//     return min(a, b);
// }

// float intersect(float a, float b) {
//     return max(a, b);
// }

// float difference(float a, float b) {
//     return max(a, -b);
// }

// // given segment ab and point c, computes closest point d on ab
// // also returns t for the position of d, d(t) = a + t(b-a)
// vec3 closestPtPointSegment(vec3 c, vec3 a, vec3 b, out float t) {
//     vec3 ab = b - a;
//     // project c onto ab, computing parameterized position d(t) = a + t(b-a)
//     t = dot(c - a, ab) / dot(ab, ab);
//     // clamp to closest endpoint
//     t = clamp(t, 0.0, 1.0);
//     // compute projected position
//     return a + t * ab;
// }

// // primitive functions
// // these all return the distance to the surface from a given point
// float plane(vec3 p, vec3 planeN, vec3 planePos) {
//     return dot(p - planePos, planeN);
// }

// float sphere(vec3 p, float r) {
//     return length(p) - r;
// }

// // capsule in Y axis
// float capsuleY(vec3 p, float r, float h) {
//     p.y -= clamp(p.y, 0.0, h);
//     return length(p) - r;
// }

// float halfSphere(vec3 p, float r) {
//     return difference(sphere(p, r),
//         plane(p, vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 0.0)) );
// }

// float capsule(vec3 p, vec3 a, vec3 b, float r) {
//     float t;
//     vec3 c = closestPtPointSegment(p, a, b, t);
//     return length(c - p) - r;
// }

// // transforms
// vec3 rotateX(vec3 p, float a) {
//     float sa = sin(a);
//     float ca = cos(a);
//     vec3 r;
//     r.x = p.x;
//     r.y = ca*p.y - sa*p.z;
//     r.z = sa*p.y + ca*p.z;
//     return r;
// }

// vec3 rotateY(vec3 p, float a) {
//     float sa = sin(a);
//     float ca = cos(a);
//     vec3 r;
//     r.x = ca*p.x + sa*p.z;
//     r.y = p.y;
//     r.z = -sa*p.x + ca*p.z;
//     return r;
// }

// vec3 getLightPos(int ballIndex) {
//     return rotateY(lightBallPositions[ballIndex] - andyPos, time * lightBallSpeeds[ballIndex] * ANIMATE) + andyPos;
// }

// float andy(vec3 pos, float delta, out int matId) {
//     float d = 1e10;
//     pos.x = abs(pos.x);  // mirror in X
//     matId = BODY;

//     // head
//     d = halfSphere(pos, 1.0);

//     // antennas
//     d = _union(d, capsule(pos, vec3(0.4, 0.7, 0.0), vec3(0.75, 1.2, 0.0), 0.05));

//     // body
//     d = _union(d, capsuleY((pos*vec3(1.0, 4.0, 1.0) - vec3(0.0, -4.6, 0.0)), 1.0, 4.0));

//     // arms
//     d = _union(d, capsuleY(rotateX(pos, sin(delta)) - vec3(1.2, -0.9, 0.0), 0.2, 0.7));

//     // legs
//     d = _union(d, capsuleY(pos - vec3(0.4, -1.8, 0.0), 0.2, 0.5));

//     float dEyes = sphere(pos + vec3(-0.35, -0.5, 0.75), /* eye size= */ 0.075);
//     if (dEyes < d)
//     {
//     matId = EYE;
//     }
//     // eyes
//     d = _union(d, dEyes);

//     return d;
// }

// float pointLight(vec3 pos, float rad) {
//     return sphere(pos, rad);
// }

// float scene(vec3 p, out int matId) {
//     float d = 1e10;
//     d = andy(p - andyPos, 0.0, matId);

//     for (int i=0; i<LIGHT_BALL_NUM; i++)
//     {
//     float dPointLight = sphere(p - getLightPos(i), lightBallRadiuses[i]);
//     if (dPointLight < d)
//     {
//       matId = i;
//     }
//     d = _union(d, dPointLight);
//     }

//     return d;
// }

// // calculate scene normal
// vec3 sceneNormal( in vec3 pos ) {
//     int matId = BODY;
//     float eps = 0.0001;
//     vec3 n;
//     n.x = scene( vec3(pos.x+eps, pos.y, pos.z), matId ) - scene( vec3(pos.x-eps, pos.y, pos.z), matId );
//     n.y = scene( vec3(pos.x, pos.y+eps, pos.z), matId ) - scene( vec3(pos.x, pos.y-eps, pos.z), matId );
//     n.z = scene( vec3(pos.x, pos.y, pos.z+eps), matId ) - scene( vec3(pos.x, pos.y, pos.z-eps), matId );
//     return normalize(n);
// }

// // trace ray using sphere tracing
// vec3 trace(vec3 ro, vec3 rd, out bool hit, out int matId) {
//     const int maxSteps = 64;
//     const float hitThreshold = 0.01;
//     hit = false;
//     vec3 pos = ro;
//     vec3 hitPos = ro;

//     for(int i=0; i<maxSteps; i++) {
//         matId = BODY;
//         float d = scene(pos, matId);
//         if (d < hitThreshold) {
//             hit = true;
//             hitPos = pos;
//         }
//         pos += d*rd;
//     }
//     return hitPos;
// }

// vec3 computeLight(vec3 pointLightPos, vec3 cam, vec3 pos, vec3 n, vec3 pointLightColor) {
//     vec3 l = normalize(pointLightPos - pos);
//     vec3 v = normalize(cam - pos);
//     vec3 h = normalize(v + l);

//     vec3 diffuse = /* attenuation= */ 0.5 * pointLightColor * max(0.0, dot(n, l));
//     vec3 spec = pointLightColor * pow(max(0.0, dot(n, h)), /* shininess= */ 100.);

//     return diffuse + spec;
// }

// // lighting
// vec4 shade(vec3 pos, vec3 n, vec3 cam, int matId) {
//     // shoot a ray towards the point light
//     vec3 pointLightContribution = vec3(0,0,0);
//     for (int i=0; i<LIGHT_BALL_NUM; i++) {
//         bool hit = false;
//         int materialId = matId;
//         vec3 lightDir = normalize(getLightPos(i)-pos);
//         vec3 lightHitPos = trace(pos + n * 0.001, lightDir, hit, materialId);

//         if (hit && isLight(materialId)) {
//           // in order to make it unbised, we should multiply a pdf (probability distribution function) to the contribution - the probability of picking up the ray if we randomly picked the ray on the hemisphere.
//           pointLightContribution += computeLight(getLightPos(i), cam, pos, n, lightBallColors[i]);
//         }
//     }

//     if (matId == EYE) {
//         return vec4(eyeColor, 1.0);
//     }

//     if (matId == BODY) {
//         return vec4(bodyColor * pointLightContribution, 1.0);
//     }

//     if (isLight(matId)) {
//         return vec4(lightBallColors[matId], 1);
//     }

//     // fallback to black
//     return vec4(0.,0.,0.,1);
// }

// float rand(vec3 co) {
//     return fract(sin( dot(co.xyz ,vec3(12.9898,78.233,45.5432) )) * 43758.5453);
// }

// // get a random point on the surface of a unit hemisphere
// vec3 randomPointOnSurfaceOfUnitHemisphere(vec3 pos) {
//     float PI = 3.141592;
//     float theta = 2. * 3.141592 * rand(pos);
//     float phi = acos(1. - 2. * rand(pos));
//     float x = sin(phi) * cos(theta);
//     float y = sin(phi) * sin(theta);
//     float z = cos(phi);

//     return vec3(x, y, z);
// }

// vec4 raycolor(vec3 rayOrigin, vec3 rayDir) {
//     bool hit;
//     int matId;
//     vec3 t = trace(rayOrigin, rayDir, hit, matId);
//     if (hit) {
//         return shade(t, sceneNormal(t), rayOrigin, matId);
//     } else {
//         return vec4(0.007843138,0.145098,0.145098,1);
//     }
// }

void main() {
    // vec2 pixel = v_uv * 2.0 - 1.0;

    // float aspectRatio = resolution.x / resolution.y;
    // vec3 rayDir = normalize(vec3(aspectRatio * pixel.x, pixel.y, 2.0));
    // vec3 raydx = dFdx(rayDir);
    // vec3 raydy = dFdy(rayDir);
    // vec3 rayOrigin = vec3(0.0, 0.0, 8.8);
    
    // gl_FragColor = raycolor(rayOrigin, rayDir);
    gl_FragColor = vec4(v_uv, 0., 1.);

    // enable anti-alias
    //vec4 color = vec4(0,0,0,0);
    //for (float x=0.; x<4.; x++) {
        //for (float y=0.; y<4.; y++) {
            //vec3 rd = rayDir + raydx * (x-1.5) * 0.5 + raydy * (y-1.5) * 0.5;
            //color += raycolor(rayOrigin, rd);
       //}
    //}
    //fragColor = color / 16.;
    
    // gamma-inverse
    // fragColor = vec4(pow(fragColor.rgb, vec3(1.0 / 2.2)), 1.0);
}