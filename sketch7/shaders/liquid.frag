varying vec2 vUv;
uniform vec3 color;
varying vec3 viewPos;
varying vec3 viewNormal;
varying vec3 pos;
uniform float fillHeight;

void main()
{
    vec3 vNormal = viewNormal;
    if (abs(pos.y - fillHeight) < 0.001) {
      vNormal = vec3(0.,1.,1.);
    }
    float rim = clamp(dot(normalize(vNormal), normalize(-viewPos)), 0.0, 1.0);
    rim = pow(rim, 0.2);
    gl_FragColor = vec4(color, rim);   
}