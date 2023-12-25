// port of https://github.com/adafruit/MAX6675-library/blob/master/max6675.cpp

class MAX6675 {
  constructor(clk, cs, miso) {
    this.clk = clk;
    this.cs = cs;
    this.miso = miso;
  }

  init() {
    try {
      pinMode(this.clk, OUTPUT);
      pinMode(this.cs, OUTPUT);
      pinMode(this.miso, INPUT);
      digitalWrite(this.cs, HIGH);
      return true;
    }
    catch (err) {
      console.log(err);
      return false;
    }
  }

  readCelcius() {
    digitalWrite(this.cs, LOW);
    let value = this.readSpi();
    value <<= 8;
    value |= this.readSpi();
    digitalWrite(this.cs, HIGH);

    if (value & 0x4) {
      // no thermocouple attached!
      return null;
    }

    value >>= 3;

    return value * 0.25;
  }

  readFahrenheit() {
    return this.readCelcius() * 1.8 + 32;
  }

  readSpi() {
    let i;
    let d = 0;
    for (i = 7; i >= 0; i--) {
      digitalWrite(this.clk, LOW);
      if (digitalRead(this.miso)) {
        d |= (1 << i);
      }
      digitalWrite(this.clk, HIGH);
    }
    return d;
  }
}

module.exports = MAX6675;