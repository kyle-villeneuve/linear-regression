(function Main() {
  const plot = document.querySelector('.plot');
  const equationEl = document.querySelector('.equation');
  const form = document.querySelector('.form');
  const rSquared = document.querySelector('.rSquared');

  const plotDimensions = {
    x: 400,
    y: 400,
  };

  let regressionLine = {};
  let average = {};

  const sum = (a, b) => a + b;

  const plotPoints = (array) => {
    let points = '';

    for (let i = 0; i < array.length; i++) {
      const { x } = array[i];
      let { y } = array[i];

      // normalize y coordinate
      y = plotDimensions.y - y;

      points += `
      <circle cx="${x}" cy="${y}" r="2" fill="#f00" />
    `;
    }

    plot.innerHTML = points;
  };

  const plotRegression = (x1, x2, y1, y2) => {
    // normalize y coordinate
    y1 = plotDimensions.y - y1;
    y2 = plotDimensions.y - y2;

    plot.innerHTML += `
      <line x1='${x1}' x2='${x2}' y1='${y1}' y2='${y2}' stroke='blue' />
    `;
  };

  const calcAverageCoords = (array) => {
    const total = array.reduce(
      (accumulator, current) => ({
        x: accumulator.x + current.x,
        y: accumulator.y + current.y,
      }),
      { x: 0, y: 0 },
    );

    const x = total.x / array.length;
    const y = total.y / array.length;

    return {
      x,
      y,
    };
  };

  const calcRegressionLine = (array) => {
    // 1. Get average of x, y
    average = calcAverageCoords(array);

    // 2. slope = ∑(x - meanX)(y - meanY) / ∑(x - meanX)^2
    const numerator = array.map(pt => (pt.x - average.x) * (pt.y - average.y)).reduce(sum);

    const denominator = array
      .map((pt) => {
        const diff = pt.x - average.x;

        return diff * diff;
      })
      .reduce(sum);

    const M = numerator / denominator;

    // 3. y-intercept = y - M(x)
    const B = average.y - average.x * M;
    regressionLine = {
      equation: `y = ${M}x + ${B}`,
      M,
      B,
    };
  };

  const calcRSquared = (array) => {
    const { M, B } = regressionLine;

    const numerator = array
      .map((pt) => {
        const estimate = pt.x * M + B;

        const diff = estimate - average.y;

        return diff * diff;
      })
      .reduce(sum);

    const denominator = array
      .map((pt) => {
        const diff = pt.y - average.y;
        return diff * diff;
      })
      .reduce(sum);

    const result = numerator / denominator;

    rSquared.innerHTML = `
    r<sup>2</sup> = ${result}
    `;
  };

  const calcRegressionLinePoints = () => {
    const { M, B, equation } = regressionLine;

    const pt1 = {
      x: 0,
      y: 0 * M + B,
    };

    const pt2 = {
      x: 400,
      y: 400 * M + B,
    };

    equationEl.innerHTML = equation;

    plotRegression(pt1.x, pt2.x, pt1.y, pt2.y);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let points;
    try {
      points = JSON.parse(e.target.elements.points.value);
    } catch (err) {
      window.alert(`The JSON data you entered was unable to be parsed. \n\n ${err}`);
      return;
    }

    plotPoints(points);

    calcRegressionLine(points);
    calcRegressionLinePoints();

    calcRSquared(points);
  });
}());
