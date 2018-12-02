uniform vec3 color;
uniform sampler2D texture;
varying vec3 viewPos;
varying vec3 viewNormal;

void main() {
    // float rim = clamp(dot(normalize(viewNormal), normalize(-viewPos)), 0.0, 1.0);
    // rim = pow(rim, 3.0);
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(glow, 1.0);
}
