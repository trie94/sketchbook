varying vec3 viewPos;
varying vec3 viewNormal;

void main()
{
    vec4 viewPosition = modelViewMatrix * vec4( position, 1.0 );
    viewPos = viewPosition.xyz;
    vec3 vNormal = normalize(normalMatrix * normal);
    viewNormal = vNormal;
    gl_Position = projectionMatrix * viewPosition;
}