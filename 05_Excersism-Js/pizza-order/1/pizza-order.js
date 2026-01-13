/// <reference path="./global.d.ts" />
//
// @ts-check

/**
 * Determine the price of the pizza given the pizza and optional extras
 *
 * @param {Pizza} pizza name of the pizza to be made
 * @param {Extra[]} extras list of extras
 *
 * @returns {number} the price of the pizza
 */
export function pizzaPrice(pizza, ...extras) {

  // if(pizza === '' && extras === []){
  //   return 0;
  // }
  const availble = {
    Margherita: 7,
    Caprese: 9,
    Formaggio: 10,
  };

  const extra = {
    ExtraSauce: 1,
    ExtraToppings: 2,
  };

  const basePrice = availble[pizza] ?? 0;

  function calulatingextra(extras){
    if(extras.length === 0){
      return 0;
    }
    const [first , ...rest] = extras;
    if (!(first in extra)) {
    return calulatingextra(rest);
  }
    return extra[first] + calulatingextra(rest);
  }

  return basePrice + calulatingextra(extras);
}

/**
 * Calculate the price of the total order, given individual orders
 *
 * (HINT: For this exercise, you can take a look at the supplied "global.d.ts" file
 * for a more info about the type definitions used)
 *
 * @param {PizzaOrder[]} pizzaOrders a list of pizza orders
 * @returns {number} the price of the total order
 */
export function orderPrice(pizzaOrders) {
  return pizzaOrders.reduce((total , order) => {
    return total + pizzaPrice(order.pizza , ...order.extras);
  } , 0);
}
