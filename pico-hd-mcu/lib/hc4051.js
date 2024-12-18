const MUX_CHANNEL_SIZE = 8;

// C B A - channel
const MUX_CHANNEL_SELECT = [
  [LOW, LOW, LOW],    // ch 0
  [LOW, LOW, HIGH],   // ch 1
  [LOW, HIGH, LOW],   // ch 2
  [LOW, HIGH, HIGH],  // ch 3
  [HIGH, LOW, LOW],   // ch 4
  [HIGH, LOW, HIGH],  // ch 5
  [HIGH, HIGH, LOW],  // ch 6
  [HIGH, HIGH, HIGH]  // ch 7
];

class HC4051 {
  constructor(options) {
    this.pinData = options.pinData;
    this.pinA = options.pinA;
    this.pinB = options.pinB;
    this.pinC = options.pinC;
    this.pinInhibit = options.pinInhibit;
    this.connectedChannels = options.connectedChannels || [0, 1, 2, 3, 4, 5, 6, 7];
    if (options.connectedChannels) {
      this.connectedChannelSize = options.connectedChannels.length;
    }
    else {
      this.connectedChannelSize = options.connectedChannelSize || MUX_CHANNEL_SIZE;
    }
  }

  init() {
    pinMode(this.pinA, OUTPUT);
    pinMode(this.pinB, OUTPUT);
    pinMode(this.pinC, OUTPUT);
    if (this.pinData) {
      pinMode(this.pinData, INPUT);
    }
    if (this.pinInhibit) {
      pinMode(this.pinInhibit, OUTPUT);
    }
    this.enableChannelIndex(0);
  }

  enableChannel(channel) {
    if (this.connectedChannels.indexOf(channel) < 0) {
      console.error(`HC4051: channel not connected: ${channel} (connected: ${this.connectedChannels})`);
      return false;
    }
    return this.enableChannelIndex(this.connectedChannels.indexOf(channel));
  }

  enableChannelIndex(chIndex) {
    if (chIndex >= MUX_CHANNEL_SIZE) {
      console.error(`HC4051: channel out of range: ${chIndex} (max: ${MUX_CHANNEL_SIZE - 1})`);
      return false;
    }
    if (this.pinInhibit) {
      digitalWrite(this.pinInhibit, LOW);
    }
    digitalWrite(this.pinC, MUX_CHANNEL_SELECT[chIndex][0]);
    digitalWrite(this.pinB, MUX_CHANNEL_SELECT[chIndex][1]);
    digitalWrite(this.pinA, MUX_CHANNEL_SELECT[chIndex][2]);
    return true;
  }

  disableAll() {
    if (this.pinInhibit) {
      digitalWrite(this.pinInhibit, HIGH);
    }
  }
}

module.exports = HC4051;