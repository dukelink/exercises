/*
The purpose of Promise's is to 'read' values from an operation
that may take an unknown amount of time to completed.  There are two 
ways of reading such values, either waiting for the values to become 
available (a synchronous operation) or by letting the operation notify
the consumers awaiting the value when the value becomes available.  

Two ways of an operation notifying 'consumer(s)' are events and callbacks.
Promises use a callback approach but the callbacks are packaged in a unique 
manner using an anonymous function that is packaged within the Promise objects. 

NOTE: Anonymous functions are also called 'delegates' (at least in
C# nomenclature), or 'lambda' functions (general programming nomenclature).
In any case, anonymous functions (as they are called in javascript) are implemented as
a pointer or reference to a (e.g. "first-class") function object. The function
has no name because it is found and executed using values assignment and may be 
handled ("bound") like any other javascript object via assignment, parameter passing,
return values, etc.

Promises use anonymous functions multiple times, initially within the constructor
where an anonymous function is called immediately for purposes of initiating an 
operation that may take an unknown amount of time.  Even if the operation is a 
simple computation that returns directly, it is treated as something that may take
an unknown amount of time and the final value will be 'resolved' in the exact same
manner as a slow-running operation.  The next way anonymous functions are used is
when they are tied to the promise via 'then' and 'catch' methods that call anonymous
functions (which are passed as parameters to these methods ) when the promise is finalized 
either with a value or an error message.

All this functionality (and more) is packaged into a Promise object that may itself be
passed around as a value rather than 'traditional' callbacks that are single function
bound directy to the operation being run.  Again, these operations are typically "asynchronous"
operations in javascript but they do not need to be.  Either way promises handle all 
operation results and resolution in an asynchronous manner...

Here's a good article:
https://developers.google.com/web/fundamentals/primers/promises

Perhaps the most important initial concept to master is simply that promises yeild values
when possible in their own time and these values are ONLY available via callback events which 
are bound to Promise objects.

The following is an exercise that is more of an anti-pattern, illustrating that Promises
cannot be handled or evaluated directly to simple values...
*/

const prom = new Promise((resolve,reject)=>{
    resolve("Final value");
});

function getFulfilledPromiseValue(prom) {
    let value = undefined; // default return for unfulfilled promises
    console.log('2')
    prom.then((val) => { value = val;})
    console.log('4')
    return value;
}

console.log('--------Stage 1---------')
console.log('1')
console.log(getFulfilledPromiseValue(prom));
console.log('3')

console.log('--------Stage 2---------')
console.log('1')
console.log(getFulfilledPromiseValue(prom));
console.log('3')

console.log('--------Stage 3---------')
console.log('1')
console.log(getFulfilledPromiseValue(prom));
console.log('3')

setTimeout(()=>{
    console.log('--------Stage 4---------')
    console.log('1')
    console.log(getFulfilledPromiseValue(prom)); 
    console.log('3')
})

console.log('=======================')

async function getFulfilledPromiseValueAsync(prom) {
    let value = undefined; // default return for unfulfilled promises
    console.log('2')
    await prom.then((val) => { value = val;})
    console.log('4')
    return value;
}

console.log('--------Stage 5---------')
console.log('1')
console.log(getFulfilledPromiseValueAsync(prom));
console.log('3')

console.log('--------Stage 6---------')
console.log('1')
console.log(getFulfilledPromiseValueAsync(prom));
console.log('3')

console.log('--------Stage 7---------')
console.log('1')
console.log(getFulfilledPromiseValueAsync(prom));
console.log('3')

setTimeout(()=>{
    console.log('--------Stage 8---------')
    console.log('1')
    console.log(getFulfilledPromiseValueAsync(prom)); 
    console.log('3')
})

console.log('\n=======================');

let finalValue = undefined;

prom.then( (val) => {
    console.log('\n***');
    console.log('--------Stage 8---------')
    console.log(`Value = ${val}!`)
    finalValue = val;
    console.log('***\n');
})

console.log('=======================\n');

setTimeout(()=>{
console.log(`

Value = ${finalValue}!!!!!
`)
},3000);


/*
RESULTS:

$ node promise-resolved.js
--------Stage 1---------
1
2
4
undefined
3
--------Stage 2---------
1
2
4
undefined
3
--------Stage 3---------
1
2
4
undefined
3
=======================
--------Stage 5---------
1
2
Promise { <pending> }
3
--------Stage 6---------
1
2
Promise { <pending> }
3
--------Stage 7---------
1
2
Promise { <pending> }
3

=======================
=======================


***
--------Stage 8---------
Value = Final value!
***

4
4
4
--------Stage 4---------
1
2
4
undefined
3
--------Stage 8---------
1
2
Promise { <pending> }
3
4


Value = Final value!!!!!

*/