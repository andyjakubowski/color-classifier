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

  function predict() {
    const hexColor = colorInputEl.value;
    const predictionIndex = FakeModel.predict(hexColor);
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
    init() {
      addEventListeners();
      setColorInputToRandomValue();
      predict();
    },
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
  handleDOMContentLoaded();
}
