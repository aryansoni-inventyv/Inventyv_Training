// @ts-check

/**
 * Generates a random starship registry number.
 *
 * @returns {string} the generated registry number.
 */
export function randomShipRegistryNumber() {
  const min = 1000;
  const max = 9999;
  const number = Math.floor(Math.random() * (max - min + 1)) + min;
  return `NCC-${number}`;
}

/**
 * Generates a random stardate.
 *
 * @returns {number} a stardate between 41000 (inclusive) and 42000 (exclusive).
 */
export function randomStardate() {
  return Math.random() * (42000 - 41000) + 41000;
}

/**
 * Generates a random planet class.
 *
 * @returns {string} a one-letter planet class.
 */
export function randomPlanetClass() {
  const planetClasses = ['D', 'H', 'J', 'K', 'L', 'M', 'N', 'R', 'T', 'Y'];
  const index = Math.floor(Math.random() * planetClasses.length);
  return planetClasses[index];
}
