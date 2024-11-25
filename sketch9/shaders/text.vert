varying vec2 v_uv;

void main() {
    // vec4 localPos = vec4(position, 1.0);
    // vec4 worldPos = modelMatrix * localPos;
    // vec4 viewPos = modelViewMatrix * worldPos;
    // vec4 projPos = projectionMatrix * viewPos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}