
// uniform vec2 iResolution;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec3 color;

void main() {
    vec4 previousPassColor = texture2D(tDiffuse, vUv);
    gl_FragColor = vec4(previousPassColor.rgb * color, previousPassColor.w);
    // gl_FragColor = vec4(1,0,0,1);
}
