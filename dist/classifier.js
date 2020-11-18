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

const Model = (function buildModel() {
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
  let titleEl;

  function getTextColorForBackground({ red, green, blue }) {
    const THRESHOLD = 110;
    const channels = [red, green, blue];
    const countBelowThreshold = channels.filter((channel) => {
      return channel < THRESHOLD;
    }).length;

    if (countBelowThreshold >= 1) {
      return 'white';
    } else {
      return 'black';
    }
  }

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
    predictionLabelEl.style.color = getTextColorForBackground(rgbColor);
  }

  const updateBodyBackground = (function makeUpdateBodyBackground() {
    const BG_OPACITY = 0.25;
    const BG_OPACITY_RGB_RANGE = Math.floor(BG_OPACITY * 255);
    const BG_OPACITY_HEX = ColorUtil.intToHex(BG_OPACITY_RGB_RANGE);

    return function (hexColor) {
      document.body.style.backgroundColor = `${hexColor}${BG_OPACITY_HEX}`;
    };
  })();

  const updateTitleColor = (function makeUpdateTitleColor() {
    // const TITLEOPACITY = 0.25;
    // const BG_OPACITY_RGB_RANGE = Math.floor(BG_OPACITY * 255);
    // const BG_OPACITY_HEX = ColorUtil.intToHex(BG_OPACITY_RGB_RANGE);
    const SATURATION_MAX_PERCENT = 30;
    const LIGHTNESS_MAX_PERCENT = 30;

    return function (hexColor) {
      const { h, s, l } = ColorUtil.hexToHsl(hexColor);
      const saturation = Math.min(s, SATURATION_MAX_PERCENT);
      const lightness = Math.min(l, LIGHTNESS_MAX_PERCENT);
      const propValue = `hsl(${h}, ${saturation}%, ${lightness}%)`;
      titleEl.style.color = propValue;
      // return "hsl(" + h + "," + s + "%," + l + "%)";
    };
  })();

  function handleColorInput() {
    const hexColor = colorInputEl.value;
    updateBodyBackground(hexColor);
    updateTitleColor(hexColor);
    predict();
  }

  function setColorInputToRandomValue() {
    const hexColor = ColorUtil.getRandomHexColor();
    colorInputEl.value = hexColor;
    updateBodyBackground(hexColor);
    updateTitleColor(hexColor);
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
    titleEl = document.getElementsByClassName('title').item(0);
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
