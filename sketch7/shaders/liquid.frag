varying vec2 vUv;
uniform vec3 color;
uniform vec3 rimColor;
uniform vec3 foamColor;
varying vec3 viewPos;
varying vec3 viewNormal;
varying vec3 pos;
uniform float fillHeight;

void main()
{
    vec3 vNormal = viewNormal;
    float rim;
    float foam = abs(pos.y - fillHeight);

    if (foam < 0.08) {
      vNormal = vec3(0.,1.,1.);
      rim = clamp(dot(normalize(vNormal), normalize(-viewPos)), 0.0, 1.0);
      // rim = pow(rim, 1.) * 0.5 + 0.5;
      gl_FragColor = vec4(mix(foamColor, color, normalize(-viewPos).y), 1.0);
    } else {
      rim = clamp(dot(normalize(vNormal), normalize(-viewPos)), 0.0, 1.0);
      rim = pow(rim, 1.) * 0.5 + 0.5;
      gl_FragColor = vec4(mix(rimColor, color, clamp(rim, 0., 1.)), rim);
    }
}