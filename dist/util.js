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
      return this.rgbToHex(rgbColor);
    },

    rgbToHex({ red, green, blue }) {
      const redHex = intToHex(red);
      const greenHex = intToHex(green);
      const blueHex = intToHex(blue);

      return `#${redHex}${greenHex}${blueHex}`;
    },

    hexToRgb(hexColor) {
      let hexValue;

      if (hexColor.startsWith('#')) {
        hexValue = hexColor.slice(1);
      } else {
        hexValue = hexColor;
      }

      const redHexStr = hexValue.slice(0, 2);
      const greenHexStr = hexValue.slice(2, 4);
      const blueHexStr = hexValue.slice(4, 6);

      const redInt = Number.parseInt(redHexStr, 16);
      const greenInt = Number.parseInt(greenHexStr, 16);
      const blueInt = Number.parseInt(blueHexStr, 16);

      return { red: redInt, green: greenInt, blue: blueInt };
    },
  };
})();
