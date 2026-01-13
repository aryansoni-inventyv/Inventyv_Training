// @ts-check
//
// The line above enables type checking for this file. Various IDEs interpret
// the @ts-check directive. It will give you helpful autocompletion when
// implementing this exercise.

/**
 * Determines how long it takes to prepare a certain juice.
 *
 * @param {string} name
 * @returns {number} time in minutes
 */
export function timeToMixJuice(name) {
  if(name == 'Pure Strawberry Joy'){return 0.5 ;}
  else if(name == 'Energizer'){return 1.5 ;}
  else if(name == 'Green Garden'){return 1.5 ;}
  else if(name == 'Tropical Island'){return 3 ;}
  else if(name == 'All or Nothing'){return 5 ;}
  else{return 2.5;}
}

/**
 * Calculates the number of limes that need to be cut
 * to reach a certain supply.
 *
 * @param {number} wedgesNeeded
 * @param {string[]} limes
 * @returns {number} number of limes cut
 */
export function limesToCut(wedgesNeeded, limes) {
  let wedges = wedgesNeeded;
  let count = 0;

  while (wedges > 0 && count < limes.length) {
    if (limes[count] === 'small') {
      wedges -= 6;
    } else if (limes[count] === 'medium') {
      wedges -= 8;
    } else {
      wedges -= 10;
    }
    count++;
  }

  return count;
}


/**
 * Determines which juices still need to be prepared after the end of the shift.
 *
 * @param {number} timeLeft
 * @param {string[]} orders
 * @returns {string[]} remaining orders after the time is up
 */
export function remainingOrders(timeLeft, orders) {
  while (timeLeft > 0 && orders.length > 0) {
    const nextJuice = orders.shift();
    timeLeft -= timeToMixJuice(nextJuice);
  }
  return orders;
}