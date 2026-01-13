export function translate2d(dx, dy) {
  return function (x, y) {
    return [x + dx, y + dy];
  };
}

export function scale2d(sx, sy) {
  return function (x, y) {
    return [x * sx, y * sy];
  };
}

export function composeTransform(f, g) {
  return function (x, y) {
    const [newX, newY] = f(x, y);
    return g(newX, newY);
  };
}

export function memoizeTransform(f) {
  let lastX;
  let lastY;
  let lastResult;
  let hasCache = false;

  return function (x, y) {
    if (hasCache && x === lastX && y === lastY) {
      return lastResult;
    }

    lastX = x;
    lastY = y;
    lastResult = f(x, y);
    hasCache = true;

    return lastResult;
  };
}
