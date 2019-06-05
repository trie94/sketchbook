uniform vec3 color;
varying vec3 viewPos;
varying vec2 vUv;
uniform vec3 fog;
uniform sampler2D caustics;
uniform float texture_repeat;
uniform float intensity;
varying vec2 v_texcoord;
varying vec2 v_texcoord2;

void main() {
    float f = 1.0 - distance(vUv,vec2(0.5));
    f = pow(f, 2.0);
    vec3 fgColor = mix(fog, color, f);
    vec4 caustic_texture0 = texture2D(caustics, v_texcoord * texture_repeat);
    vec4 caustic_texture1 = texture2D(caustics, v_texcoord2 * texture_repeat * 0.5);
    caustic_texture0 = caustic_texture0 * (abs(vec4(intensity)) + vec4(0.25));
    caustic_texture1 = caustic_texture1 * (abs(vec4(intensity)) + vec4(0.25));
    gl_FragColor = vec4(fgColor, 1.0) + caustic_texture0 + caustic_texture1;
}
