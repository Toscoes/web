cd C:\Users\Jason\Desktop\Goods\Programming\Web\emsdk
call emsdk activate latest
cd C:\Users\Jason\Desktop\Goods\Programming\Web\_sandbox\webassembly\helloworld
call emcc -o helloworld.html helloworld.c -O3 -s WASM=1 --shell-file html_template/template.html -s NO_EXIT_RUNTIME=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"
call python -m http.server