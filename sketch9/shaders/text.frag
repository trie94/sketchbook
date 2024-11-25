
uniform vec2 u_resolution;

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

void main() {
    // gl fragcoord is a relative window coordinate (0, 0) - (window_width, window_height)
    // z: depth, w: related to perspective division and is often used for perspective correct interpolation.
    vec2 uv = gl_FragCoord.xy / u_resolution;
    gl_FragColor = vec4(uv, 0., 1.);
}