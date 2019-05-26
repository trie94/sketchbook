uniform vec3 color;
uniform vec3 rimColor;
varying vec3 viewPos;
varying vec3 viewNormal;

void main() {
    float rim = clamp(dot(normalize(viewNormal), normalize(-viewPos)), 0.0, 1.0);
    rim = 1.0 - rim;
    rim = pow(rim, 2.0);
    // vec3 color = mix(color, rimColor, rim);
    gl_FragColor = vec4(rimColor, rim);
}
