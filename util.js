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
