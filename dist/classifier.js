function handleDOMContentLoaded() {
  App.init();
}

const FakeModel = (function buildFakeModel() {
  return {
    predict(hexColor) {
      const randomLabel = MathUtil.getRandomInt(10);
      return randomLabel;
    },
  };
})();

const Model = (function buildFakeModel() {
  let model;

  return {
    async init() {
      model = await tf.loadLayersModel('./model/model.json');
    },

    getModel() {
      return model;
    },

    async predict({ red, green, blue }) {
      const x = tf.tensor2d([red, green, blue], [1, 3]);
      const predictionTensor = model.predict(x);
      const probabilities = await predictionTensor.data();
      const maxProba = Math.max(...probabilities);
      const indexOfMaxProba = probabilities.indexOf(maxProba);
      return indexOfMaxProba;
    },
  };
})();

const App = (function buildApp() {
  const colorInputEl = document.getElementsByClassName('color-input').item(0);
  const predictionLabelEl = document
    .getElementsByClassName('prediction-label')
    .item(0);
  const predictionLabels = [
    'Red-ish',
    'Green-ish',
    'Blue-ish',
    'Orange-ish',
    'Yellow-ish',
    'Pink-ish',
    'Purple-ish',
    'Brown-ish',
    'Gray-ish',
  ];

  async function predict() {
    const hexColor = colorInputEl.value;
    const rgbColor = ColorUtil.hexToRgb(hexColor);
    const predictionIndex = await Model.predict(rgbColor);
    const predictionLabel = predictionLabels[predictionIndex];
    predictionLabelEl.textContent = predictionLabel;
  }

  function handleColorInput() {
    predict();
  }

  function setColorInputToRandomValue() {
    const randomHexColor = ColorUtil.getRandomHexColor();
    colorInputEl.value = randomHexColor;
  }

  function addEventListeners() {
    colorInputEl.addEventListener('input', handleColorInput);
  }

  return {
    async init() {
      addEventListeners();
      setColorInputToRandomValue();
      await Model.init();
      predict();
    },
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
  handleDOMContentLoaded();
}
