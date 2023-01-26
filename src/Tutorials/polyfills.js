/*
    This files contains the polyfill for various methods
*/

//Map Method
Array.prototype.myMap = function (cb) {
    const newArr = []
    this.forEach((e, index) => {
        newArr.push(cb(e, index, this))
    })
    return newArr
}
console.log([2, 5, 7].myMap((e, idx, ar) => e * 2 + idx + ar[2]))

//Filter method
Array.prototype.myFilter = function(cb) {
    const newArr = []
    this.forEach((e,idx)=>{
        if (cb(e,idx, this)) {
            newArr.push(e)
        }
    })
    return newArr
}
console.log([5,7,9].myFilter((e,idx)=> e % 2 === 0))

//Reduce method
Array.prototype.myReduce = function(cb, initialValue) {
    // initialValue => acc = initialValue
    //                currElement = arr[0] : arr[1]
    //                currIndex = 0 : 1
    let accumulator = initialValue !== undefined ? initialValue : this[0]
    for(let i = initialValue !== undefined ? 0 : 1; i < this.length; i++) {
        accumulator = cb(accumulator, this[i], i, this)
    }
    return accumulator
}

const sum = [1,5,7,2,9].myReduce((acc, currVal, currIndex, ar) => {
    console.log(acc, currVal, currIndex, ar);
    return acc + currVal;
}, 0);
console.log(sum);

//Call Method
Function.prototype.myCall = function(context, ...args) {
    const fun = this
    let randomUniqueKey = Math.random()
    while (context[randomUniqueKey] !== undefined) randomUniqueKey = Math.random()
    context[randomUniqueKey] = fun
    const result =  context[randomUniqueKey](...args)
    delete context[randomUniqueKey]
    return result
}

// Apply method
Function.prototype.myApply = function (context, argArr) {
    const fun = this
    let randomUniqueKey = Math.random()
    while (context[randomUniqueKey] !== undefined) randomUniqueKey = Math.random()
    context[randomUniqueKey] = fun
    const result = context[randomUniqueKey](...argArr)
    delete context[randomUniqueKey]
    return result
}

//Bind
Function.prototype.myBind = function(context, ...args) {
    const fun = this
    return function() {
        return fun.apply(context, args)
    }
}

/*
    *  ******Promises******
    ! Fullfils -> resolved
    ? settled -> resolved or rejected. only needs to be fulfilled
    * Prmomise.resolve(prms) used so that if we pass static values/non-promise values then also the code works for us. As, Promise.resolve() returns a promise
    ******* <<<------>>>
*/

/*
    ******* <<<------>>>
    * Promise.All
    ! Fulfills when all of the promises fulfill; rejects when any of the promises rejects.
    ******* <<<------>>>
*/
Promise.prototype.myPromiseAll = promiseArr => {
    return new Promise((res, rej)=>{
        let resolvedPromise = 0
        let returnArr = []
        promiseArr.forEach((prms, index)=> {
            Promise.resolve(prms).then((val)=>{
                returnArr[index] = val
                resolvedPromise += 1
            }).catch((err) => {
                rej(err)
            })
        })
        if (resolvedPromise === promiseArr.length) res(returnArr)
    })
}

/*
    ******* <<<------>>>
    * Promise.allSettled()
    ! Fulfills when all promises settle.
    ******* <<<------>>>
*/
Promise.prototype.mySettledAll = function (promiseArr) {
    return new Promise((res) => {
        const resolvedPromises = [];
        promiseArr.forEach((prms, idx) => {
            Promise.resolve(prms)
                .then((response) => {
                    resolvedPromises[idx] = response;
                })
                .catch((err) => {
                    resolvedPromises[idx] = err;
                });
        });
        res(resolvedPromises);
    });
};

/*
    ******* <<<------>>>
    * Promise.race()
    ! Settles when any of the promises settles. In other words, fulfills when any of the promises fulfills; rejects when any of the promises rejects.
    ******* <<<------>>>
*/
Promise.prototype.myRace = function (promiseArr) {
    return new Promise((resolve, reject) => {
        promiseArr.forEach((prms) => {
            Promise.resolve(prms)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });
};

/*
    ******* <<<------>>>
    * Promise.any()
    ! Fulfills when any of the promises fulfills; rejects when all of the promises reject.
    ******* <<<------>>>
*/
Promise.prototype.myAny = function (promiseArr) {
    return new Promise((resolve, reject) => {
        let rejectedPrms = 0;
        const rejectedPrmsVals = [];
        promiseArr
            .forEach((prms, idx) => {
                Promise.resolve(prms).then((res) => {
                    resolve(res);
                });
            })
            .catch((err) => {
                rejectedPrmsVals[idx] = err;
                rejectedPrms++;
                if (rejectedPrms === promiseArr.length) reject(new Error("Aggregate"));
            });
    });
};

