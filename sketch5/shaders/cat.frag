uniform vec3 color;
uniform vec3 rimColor;
uniform float rimPower;
varying vec3 viewPos;
varying vec3 viewNormal;
uniform sampler2D texture;

void main() {
    float rim = clamp(dot(normalize(viewNormal), normalize(-viewPos)), 0.0, 1.0);
    rim = 1.0 - rim;
    rim = pow(rim, rimPower);
    vec3 color = mix(color, rimColor, rim);
    // vec4 render_texture = texture2D(texture, v_texcoord * 1.0);
    gl_FragColor = vec4(rimColor, rim);
}
