uniform vec3 rimColor;
varying vec3 viewPos;
varying vec3 viewNormal;

void main() {
    // gl_FragColor = vec4(normalize(viewNormal) * 0.5 + 0.5, 1.0);
    // gl_FragColor = vec4(normalize(viewPos) * 0.5 + 0.5, 1.0);
    float rim = clamp(dot(normalize(viewNormal), normalize(-viewPos)), 0.0, 1.0);
    rim = pow(rim, 3.0);
    // rim = 1.0 - rim;
    // vec3 color = mix(mainColor, rimColor, rim);
    gl_FragColor = vec4(rimColor, rim);
    // gl_FragColor = vec4(glow, 1.0);
}
