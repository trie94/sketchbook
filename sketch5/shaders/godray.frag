uniform vec3 color;
varying vec2 vUv;
uniform float intensity;

void main() {
    vec2 flipped = vec2(vUv.y, vUv.x);
    gl_FragColor = vec4(color, flipped * intensity);
}
