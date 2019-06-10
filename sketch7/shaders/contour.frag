varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform vec2 iResolution;

float checkSame(vec4 center, vec4 samplef)
{
    vec2 centerNormal = center.xy;
    float centerDepth = center.z;
    vec2 sampleNormal = samplef.xy;
    float sampleDepth = samplef.z;
    
    vec2 diffNormal = abs(centerNormal - sampleNormal);
    bool isSameNormal = (diffNormal.x + diffNormal.y) < 0.1;
    
    float diffDepth = abs(centerDepth - sampleDepth);
    bool isSameDepth = diffDepth < 0.1;
    return (isSameNormal && isSameDepth) ? 1.0 : 0.0;
}

void main()
{
    vec4 sample0 = texture2D(tDiffuse, vUv);
    vec4 sample1 = texture2D(tDiffuse, vUv + vec2(1.0, 1.0) / iResolution.xy);
    vec4 sample2 = texture2D(tDiffuse, vUv + vec2(-1.0, -1.0) / iResolution.xy);
    vec4 sample3 = texture2D(tDiffuse, vUv + vec2(-1.0, 1.0) / iResolution.xy);
    vec4 sample4 = texture2D(tDiffuse, vUv + vec2(1.0, -1.0) / iResolution.xy);
    float edge = checkSame(sample1, sample2) * checkSame(sample3, sample4);
    float depth = texture2D(tDepth, vUv).x;
    gl_FragColor = vec4(edge, depth, 1.0, 1.0);
}
