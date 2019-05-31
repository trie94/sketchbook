uniform vec3 color;
varying vec3 viewPos;
varying vec2 vUv;
uniform vec3 fog;
uniform sampler2D caustics;
uniform float texture_repeat;
uniform float intensity;
varying vec2 v_texcoord;

void main() {
    float f = 1.0 - distance(vUv,vec2(0.5));
    f = pow(f, 2.0);
    vec3 fgColor = mix(fog, color, f);
    vec4 caustic_texture = texture2D(caustics, v_texcoord * texture_repeat);
    gl_FragColor = vec4(fgColor, 1.0) + caustic_texture * (abs(vec4(intensity)) + vec4(0.3));
}
