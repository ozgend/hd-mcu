// port of https://github.com/adafruit/MAX6675-library/blob/master/max6675.cpp

//  BITS       DESCRIPTION
//  ------------------------------
//       00    three state ?
//       01    device ID ?
//       02    INPUT OPEN
//  03 - 14    TEMPERATURE (RAW)
//       15    SIGN

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
    console.log('MAX6675: readCelcius');
    digitalWrite(this.cs, LOW);
    let value = this.readSpi();
    console.log('MAX6675: read-1', value);
    value <<= 8;
    console.log('MAX6675: shift-8', value);
    value |= this.readSpi();
    console.log('MAX6675: read-2', value);
    digitalWrite(this.cs, HIGH);

    if (value & 0x4) {
      // no thermocouple attached!
      console.error('MAX6675: no thermocouple attached!');
      return null;
    }

    value >>= 3;

    return value * 0.25;
  }

  readFahrenheit() {
    return this.readCelcius() * 1.8 + 32;
  }

  readSpi() {
    let bytes = [];
    for (i = 15; i >= 0; i--) {
      digitalWrite(this.clk, HIGH);
      delay(10);
      bytes[i] = analogRead(this.miso);
      delay(10);
      digitalWrite(this.clk, LOW);
    }
    console.log(`MAX6675: readSpi: ${bytes}`);
    return d;
  }

  close() {
    // nothing to do
  }

}

module.exports = MAX6675;