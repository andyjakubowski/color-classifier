function handleDOMContentLoaded() {
  appendDataDownloadLink();
}

const MathUtil = {
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
};

const getRandomRGBColor = function getRandomRGBColor() {
  const red = MathUtil.getRandomInt(255);
  const green = MathUtil.getRandomInt(255);
  const blue = MathUtil.getRandomInt(255);

  return {
    red,
    green,
    blue,
  };
};

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
