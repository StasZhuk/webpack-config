async function start() {
    return await Promise.resolve('async is working');
}

start().then((res) => console.log(res));

const unusedVariable = 10;
console.log(unusedVariable);

class Util {
    static id = Date.now();
}

console.log('Util id:', Util.id);
