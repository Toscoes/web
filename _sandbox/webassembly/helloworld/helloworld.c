#include <stdio.h>
#include <emscripten/emscripten.h>

EMSCRIPTEN_KEEPALIVE
int myAddFunction(a, b) {
    return a + b;
}