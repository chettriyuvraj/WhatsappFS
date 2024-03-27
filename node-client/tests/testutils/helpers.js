function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = generateRandomDigit(0, chars.length);
    randomString += chars[randomIndex];
  }
  return randomString;
}

function generateRandomNumberOfFixedLength(length) {
  let number = 0;
  for (let i = 0; i < length; i++) {
    const nextDigit = generateRandomNumberBetweenBounds(1, 10);
    number *= 10;
    number += nextDigit;
  }
  return number;
}

/** 
 * Note: leftBound inclusive, rightBound exclusive
 * Undefined behaviour if leftBound > rightBound
 **/ 
function generateRandomNumberBetweenBounds(leftBound, rightBound) {
  return Math.floor(Math.random() * (rightBound - leftBound)) + leftBound;
}

module.exports = {
  generateRandomNumberBetweenBounds,
  generateRandomString,
  generateRandomNumberOfFixedLength
}