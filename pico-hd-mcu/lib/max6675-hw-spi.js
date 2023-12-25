// refs
// https://github.com/zhenek-kreker/MAX6675/blob/master/MAX6675.cpp
// https://github.com/adafruit/MAX6675-library/blob/master/max6675.cpp

const { GPIO } = require('gpio');
const { SPI } = require('spi');

const MAX6675_BPS = 1000000;
const MAX6675_OPEN_BIT = 0x04;
const MAX6675_CONVERSION_RATIO = 0.25;
let MAX6675_READER_CMD = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0];

class MAX6675 {
  constructor(sck, cs, miso, mode, bus, baudrate) {
    this.sck = sck;
    this.cs = cs;
    this.miso = miso;
    this.mode = mode || SPI.MODE_0;
    this.bus = bus || 0;
    this.baudrate = baudrate || MAX6675_BPS;
  }

  init() {
    try {
      this.spiCs = new GPIO(this.cs, OUTPUT);
      this.spiCs.write(LOW);
      this.spiBus = new SPI(this.bus, { mode: this.mode, baudrate: this.baudrate, bitorder: SPI.MSB, sck: this.sck, clk: this.sck, miso: this.miso, mosi: -1 });
      console.log('MAX6675: init');
      console.log(this.spiCs);
      console.log(this.spiBus);
      return true;
    }
    catch (err) {
      console.log(err);
      return false;
    }
  }

  close() {
    if (this.spiBus) {
      console.log('MAX6675: close')
      this.spiBus.close();
    }
  }

  readCelcius() {
    console.log('MAX6675: readCelcius');

    let bytes = this.readRaw();

    if (bytes & MAX6675_OPEN_BIT) {
      console.error('MAX6675: no thermocouple attached!');
      return null;
    }
    const value = (bytes >> 3) * MAX6675_CONVERSION_RATIO;
    return value;
  }

  readFahrenheit() {
    return this.readCelcius() * 1.8 + 32;
  }

  readRaw() {
    return this.readRaw2();
  }

  readRaw1() {
    this.spiCs.write(LOW);
    delay(10);
    const sent = this.spiBus.send(new Uint8Array(MAX6675_READER_CMD));
    console.log(`MAX6675: readRaw.sent: ${sent}b`);

    this.spiCs.write(HIGH);
    delay(10);

    let bytes = this.spiBus.recv(16);

    if (bytes === null) {
      console.error('MAX6675: recv error');
    }

    console.log(`MAX6675: readRaw.bytes: ${bytes} length: ${bytes.length}`);

    return bytes;
  }

  readRaw2() {
    this.spiCs.write(LOW);
    delay(10);

    let bytes = this.spiBus.transfer(new Uint8Array([...MAX6675_READER_CMD, ...MAX6675_READER_CMD]));
    console.log(`MAX6675: readRaw.bytes: ${bytes} length: ${bytes.length}`);

    delay(10);
    this.spiCs.write(HIGH);
    return bytes;
  }
}

module.exports = MAX6675;