varying vec2 vUv;
uniform vec3 color;
uniform float fillHeight;
varying vec3 viewPos;
varying vec3 viewNormal;
varying vec3 pos;

void main() {
    // coffee height
    pos = position;
    pos.y = min(pos.y, fillHeight);

    // rim
    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
    viewPos = viewPosition.xyz;
    vec3 vNormal = normalize(normalMatrix * normal);
    viewNormal = vNormal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}