uniform vec3 color;
varying vec3 viewPos;
varying vec2 vUv;
uniform vec3 fog;

void main() {
    float f = 1.0 - distance(vUv,vec2(0.5));
    f = pow(f, 2.0);
    vec3 fgColor = mix(fog, color, f);
    gl_FragColor = vec4(fgColor, 1.0);
}
