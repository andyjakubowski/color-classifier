const MathUtil = {
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
};

const ColorUtil = (function buildColorUtil() {
  return {
    intToHex(int) {
      return int.toString(16).padStart(2, '0');
    },

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
      const redHex = this.intToHex(red);
      const greenHex = this.intToHex(green);
      const blueHex = this.intToHex(blue);

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

    hexToHsl(hexColor) {
      const rgbColor = this.hexToRgb(hexColor);
      return this.rgbToHsl(rgbColor);
    },

    rgbToHsl({ red: r, green: g, blue: b }) {
      // This function taken from this CSS Tricks article:
      // https://css-tricks.com/converting-color-spaces-in-javascript/

      // Make r, g, and b fractions of 1
      r /= 255;
      g /= 255;
      b /= 255;

      // Find greatest and smallest channel values
      let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

      // Calculate hue
      // No difference
      if (delta == 0) h = 0;
      // Red is max
      else if (cmax == r) h = ((g - b) / delta) % 6;
      // Green is max
      else if (cmax == g) h = (b - r) / delta + 2;
      // Blue is max
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      // Make negative hues positive behind 360°
      if (h < 0) {
        h += 360;
      }

      // Calculate lightness
      l = (cmax + cmin) / 2;

      // Calculate saturation
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      // Multiply l and s by 100
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      return { h, s, l };
    },
  };
})();
