let sum = 0;

const promise1 = new Promise((resolve, reject) => {
    if (sum > 35) {
        resolve('successful');
    } else {
        reject('unsuccessful');
    }
});


function main1() {



    let arr = [1, 2, 3];
    let sym1 = Symbol();
    let sym_array = {
        [sym1]: arr
    }
    main2(sym_array, sym1);
}

function main2(arr, sym1) {
    console.log(arr[sym1][0]);
    let first_element = arr[sym1].shift();
    console.log("Removed element: " + first_element);
    main3(first_element, arr, sym1);
}

function main3(element, arr, sym1) {
    let arr2 = [4, 5, 6];
    arr2.unshift(element);
    for (let i = 0; i < arr[sym1].length; i++) {
        arr2.push(arr[sym1][i]);
    }

    for (let i = 0; i < arr2.length; i++) {
        sum += arr2[i];
    }


    for (let i = 0; i < arr2.length; i++) {
        console.log(arr2[i]);
    }
    
    promise1.then((message) => {
        console.log("The sum is " + sum + ", the operation was " + message);
    }).catch((message) => {
        console.log("The sum is " + sum + ", the operation was " + message);
    });

}

main1()