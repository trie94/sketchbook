varying vec3 localPosition;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
    gl_FragColor = vec4(
        mix(uColorA, uColorB, clamp(normalize(localPosition).y * 0.5 + 0.5, 0., 1.)),
        // vec3(fract(normalize(localPosition).y * 0.5 + 0.5)),
        1.
    );
}