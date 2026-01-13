/// <reference path="./global.d.ts" />
// @ts-check

/**
 * Implement the functions needed to solve the exercise here.
 * Do not forget to export them so they are available for the
 * tests. Here an example of the syntax as reminder:
 *
 * export function yourFunction(...) {
 *   ...
 * }
 */

export function cookingStatus(remainingtime) {
  if (remainingtime === undefined){
      return 'You forgot to set the timer.';
    }
    else if(remainingtime == 0){
    return 'Lasagna is done.' ;
  }
  else{
    return 'Not done, please wait.';
  }
  
}


export function preparationTime (layers , time = 2){
  let leng = layers.length ;
  
  return leng * time;
}

export function quantities(layers) {
  let noodles = 0;
  let sauce = 0;

  for (let layer of layers) {
    if (layer === 'noodles') {
      noodles += 50;
    }
    if (layer === 'sauce') {
      sauce += 0.2;
    }
  }

  return {
    noodles,
    sauce,
  };
}

export function addSecretIngredient (friendslist , mylist){
  mylist.push(friendslist[friendslist.length - 1]);
}


export function scaleRecipe (recipe , amount){
  // if(amount == undefined){
  //   return obj;
  // }
  let mul1 = amount / 2 ;
  const scalerec = {}

  for(let key in recipe){
    scalerec[key] = recipe[key] * mul1 ;
  }
  return scalerec ;
}

