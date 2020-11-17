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
      return { probabilities, indexOfMaxProba };
    },
  };
})();

const App = (function buildApp() {
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

  let colorInputEl;
  let barRects;
  let predictionLabelEl;

  async function predict() {
    const hexColor = colorInputEl.value;
    const rgbColor = ColorUtil.hexToRgb(hexColor);
    const { probabilities, indexOfMaxProba } = await Model.predict(rgbColor);

    barRects.forEach((rect, index) => {
      rect.style.backgroundColor = hexColor;
      rect.style.height = `${probabilities[index] * 100}%`;
    });

    const predictionLabel = predictionLabels[indexOfMaxProba];
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

  function setDomReferences() {
    const barRectsHTMLCollection = document.getElementsByClassName(
      'bar__rect-fill'
    );
    barRects = [...barRectsHTMLCollection];
    colorInputEl = document.getElementsByClassName('color-input').item(0);
    predictionLabelEl = document
      .getElementsByClassName('prediction-label')
      .item(0);
  }

  return {
    async init() {
      setDomReferences();
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
