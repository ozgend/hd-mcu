/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

const MUX_CHANNEL_SIZE = 8;

// C B A - channel
const MUX_CHANNEL_SELECT = [
  [LOW, LOW, LOW], // ch 0
  [LOW, LOW, HIGH], // ch 1
  [LOW, HIGH, LOW], // ch 2
  [LOW, HIGH, HIGH], // ch 3
  [HIGH, LOW, LOW], // ch 4
  [HIGH, LOW, HIGH], // ch 5
  [HIGH, HIGH, LOW], // ch 6
  [HIGH, HIGH, HIGH], // ch 7
];

export interface HC4051Options {
  pinData?: number;
  pinA: number;
  pinB: number;
  pinC: number;
  pinInhibit?: number;
  connectedChannels?: number[];
  connectedChannelSize?: number;
}

export class HC4051 {
  private pinData?: number;
  private pinA: number;
  private pinB: number;
  private pinC: number;
  private pinInhibit?: number;
  private connectedChannels: number[];
  private connectedChannelSize: number;

  constructor(options: HC4051Options) {
    this.pinData = options.pinData;
    this.pinA = options.pinA;
    this.pinB = options.pinB;
    this.pinC = options.pinC;
    this.pinInhibit = options.pinInhibit;
    this.connectedChannels = options.connectedChannels || [0, 1, 2, 3, 4, 5, 6, 7];
    this.connectedChannelSize = options.connectedChannels ? options.connectedChannels.length : options.connectedChannelSize || MUX_CHANNEL_SIZE;
  }

  init() {
    pinMode(this.pinA, OUTPUT);
    pinMode(this.pinB, OUTPUT);
    pinMode(this.pinC, OUTPUT);
    if (this.pinData !== undefined) {
      pinMode(this.pinData, INPUT);
    }
    if (this.pinInhibit !== undefined) {
      pinMode(this.pinInhibit, OUTPUT);
    }
    this.enableChannelIndex(0);
  }

  enableChannel(channel: number): boolean {
    if (this.connectedChannels.indexOf(channel) < 0) {
      console.error(`HC4051: channel not connected: ${channel} (connected: ${this.connectedChannels})`);
      return false;
    }
    return this.enableChannelIndex(this.connectedChannels.indexOf(channel));
  }

  enableChannelIndex(chIndex: number): boolean {
    if (chIndex >= MUX_CHANNEL_SIZE) {
      console.error(`HC4051: channel out of range: ${chIndex} (max: ${MUX_CHANNEL_SIZE - 1})`);
      return false;
    }
    if (this.pinInhibit !== undefined) {
      digitalWrite(this.pinInhibit, LOW);
    }
    digitalWrite(this.pinC, MUX_CHANNEL_SELECT[chIndex][0]);
    digitalWrite(this.pinB, MUX_CHANNEL_SELECT[chIndex][1]);
    digitalWrite(this.pinA, MUX_CHANNEL_SELECT[chIndex][2]);
    return true;
  }

  disableAll() {
    if (this.pinInhibit !== undefined) {
      digitalWrite(this.pinInhibit, HIGH);
    }
  }
}