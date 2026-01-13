// @ts-check

/**
 * Calculates the sum of the two input arrays.
 *
 * @param {number[]} array1
 * @param {number[]} array2
 * @returns {number} sum of the two arrays
 */
export function twoSum(array1, array2) {
  let sumstring1 = '' ;
  for(let i = 0  ; i < array1.length ; i++){
    sumstring1 += array1[i];
  }
  let sumstring2 = '' ;
  for(let i = 0  ; i < array2.length ; i++){
    sumstring2 += array2[i];
  }
  
  return Number(sumstring1) + Number(sumstring2);
}

/**
 * Checks whether a number is a palindrome.
 *
 * @param {number} value
 * @returns {boolean} whether the number is a palindrome or not
 */
export function luckyNumber(value) {
  let stringvalue = String(value);
  let len = stringvalue.length;
  for(let i = 0 ; i < len / 2 ; i++){
    if(stringvalue[i] == stringvalue[len - i - 1]){
      continue;
    }
    else{
      return false;
    }
  } 
  return true;
}

/**
 * Determines the error message that should be shown to the user
 * for the given input value.
 *
 * @param {string|null|undefined} input
 * @returns {string} error message
 */
export function errorMessage(input) {
  if(input == '' || input == null || input == undefined){
    return 'Required field';
  }

  let num = Number(input);
  if(Number.isNaN(num)  || num === 0 ){
    return 'Must be a number besides 0';
  }
  return '';

  
}
