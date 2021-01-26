add = Module.cwrap('myAddFunction', 'number', ['number', 'number']);
console.log(add(1,1));