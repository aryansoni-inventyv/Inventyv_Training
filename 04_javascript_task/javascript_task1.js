let sum = 0;

const promise1 = new Promise((resolve , reject) => {
        if(sum > 35){
            resolve('successful');
        }else{
            reject('unsuccessful');
        }
    });

function main1(){
    let array = [10, 20, 30, 40, 50];
    main2(array);
}

function main2(arr){
    // for(let i = 0; i < arr.length; i++){
    //     console.log(arr[i]);
    // }
    // arr[1] = 1;
    // console.log(arr[1]);

    let element = arr[0] ;
    arr.splice(0 , 1);
    // console.log("Removed element: " + element);
    // for(let i = 0; i < arr.length; i++){
    //     console.log(arr[i]);
    // }

    main3(element , arr);

}

function main3(element , arr){
    // console.log("Element: " + element);
    // for(let i = 0; i < arr.length; i++){
    //     console.log(arr[i]);
    // }

    let array2 = [100 , 200 , 300]; 
    array2.unshift(element);
    for(let i = 0; i < arr.length; i++){
        array2.push(arr[i]);
    }
    
    for(let i = 0; i < array2.length; i++){
        sum += array2[i];
    }

    // for(let i = 0; i < array2.length; i++){
    //     console.log(array2[i]);
    // }


    


    promise1.then((message) => {
        console.log("The sum is " + sum + ", the operation was " + message);
    }).catch((message) => {
        console.log("The sum is " + sum + ", the operation was " + message);
    }); 
}
main1();