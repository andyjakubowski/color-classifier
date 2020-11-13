function handleDOMContentLoaded() {
  App.init();
}

const LocalStorageBuddy = {
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  set(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
};

const Data = (function buildData() {
  const LABELED_COLORS_INDEX = 'labeledColorsIndex';
  const LABELED_COLORS_DATA = 'labeledColorsData';
  let index;
  let data;

  return {
    get() {
      return { index, data };
    },

    save({ colorHex, labelObject }) {
      console.log('saveData', colorHex, labelObject);
      index.push(colorHex);
      data.push(labelObject);
      LocalStorageBuddy.set(LABELED_COLORS_INDEX, index);
      LocalStorageBuddy.set(LABELED_COLORS_DATA, data);
    },

    init() {
      index = LocalStorageBuddy.get(LABELED_COLORS_INDEX) || [];
      data = LocalStorageBuddy.get(LABELED_COLORS_DATA) || [];
    },
  };
})();

const App = (function buildApp() {
  const colorBoxEl = document.getElementsByClassName('color-box').item(0);
  const jsonAnchorEl = document
    .getElementsByClassName('footer__json-link')
    .item(0);
  let currentColor;

  function updateDownloadLink() {
    const { data } = Data.get();
    const jsonObject = JSON.stringify(data);
    const blob = new Blob([jsonObject], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    jsonAnchorEl.href = url;
    jsonAnchorEl.download = 'labeled-colors.json';
    jsonAnchorEl.textContent = 'Download JSON';
  }

  function saveColorLabel(button) {
    const colorHex = ColorUtil.RGBToHex(currentColor);
    const label = button.textContent.toLowerCase();
    const { red, green, blue } = currentColor;
    const labelObject = { red, green, blue, label, colorHex };
    Data.save({ colorHex, labelObject });
  }

  function handleLabelButtonClick(e) {
    saveColorLabel(e.target);
    updateDownloadLink();
    setNewColor();
    displayNewColor();
  }

  function addEventListeners() {
    const buttons = [
      ...document.getElementsByClassName('buttons-list__button'),
    ];
    buttons.forEach((button) => {
      button.addEventListener('click', handleLabelButtonClick.bind());
    });
  }

  function setNewColor() {
    currentColor = ColorUtil.getRandomRGBColor();
  }

  function displayNewColor() {
    colorBoxEl.style.backgroundColor = ColorUtil.RGBToHex(currentColor);
  }

  return {
    getIndex() {
      return Data.get().index;
    },

    getData() {
      return Data.get().data;
    },

    init() {
      Data.init();
      updateDownloadLink();
      setNewColor();
      displayNewColor();
      addEventListeners();
    },
  };
})();

const MathUtil = {
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
};

const ColorUtil = (function buildColorUtil() {
  function intToHex(int) {
    return int.toString(16).padStart(2, '0');
  }

  return {
    getRandomRGBColor() {
      const red = MathUtil.getRandomInt(255);
      const green = MathUtil.getRandomInt(255);
      const blue = MathUtil.getRandomInt(255);

      return {
        red,
        green,
        blue,
      };
    },

    getRandomHexColor() {
      const rgbColor = this.getRandomRGBColor();
      return this.RGBToHex(rgbColor);
    },

    RGBToHex({ red, green, blue }) {
      const redHex = intToHex(red);
      const greenHex = intToHex(green);
      const blueHex = intToHex(blue);

      return `#${redHex}${greenHex}${blueHex}`;
    },
  };
})();

function appendDataDownloadLink() {
  const sampleObject = {
    name: 'Andy',
    age: 102,
  };
  const jsonSampleObject = JSON.stringify(sampleObject);
  const blob = new Blob([jsonSampleObject], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'labeled-colors.json';
  a.textContent = 'Download labeled-colors.json';

  const mainContentEl = document.getElementsByClassName('main-content').item(0);
  mainContentEl.append(a);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
  handleDOMContentLoaded();
}
