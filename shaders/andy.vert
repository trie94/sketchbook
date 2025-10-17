precision mediump float;
precision mediump int;

varying vec2 v_uv;
attribute vec3 position;
attribute vec2 uv;

void main(){
    gl_Position = vec4(position, 1.0);
    v_uv = uv;
}