uniform vec3 color;
uniform vec3 rimColor;
uniform float rimPower;
varying vec3 viewPos;
varying vec3 viewNormal;
varying vec3 worldPos;
varying vec3 worldNormal;

void main() {
    float rim = clamp(dot(normalize(viewNormal), normalize(-viewPos)), 0.0, 1.0);
    rim = pow(rim, rimPower);
    gl_FragColor = vec4(rimColor, rim);
}
