const { ServiceCommand } = require('./constants');

class BaseService {
  constructor(code, type, updateInterval, eventBus) {
    this.code = code;
    this.type = type;
    this.updateInterval = updateInterval;
    this.eventBus = eventBus ?? { emit: () => { } };
    this.lastUpdate = 0;
    this.pid = null;
    this.isRunning = false;
    this.data = {};

    this.eventBus.on('service_command', (code, command) => {
      if (code === this.code) {
        this.handleCommand(command);
      }
    });
  }

  handleCommand(command) {
    console.log(`[${this.code}] handleCommand: ${command}`);
    switch (command) {
      case ServiceCommand.START:
        this.start();
        break;
      case ServiceCommand.STOP:
        this.stop();
        break;
      default:
        break
    }
  }

  setup() {
    console.log(`[${this.code}] setup`);
  }

  start() {
    console.log(`[${this.code}] starting`);
    if (this.isRunning) {
      console.log(`[${this.code}] already running`);
      return;
    }
    this.isRunning = true;
    this.pid = setInterval(() => { this.update(); }, this.updateInterval);
  }

  stop() {
    console.log(`[${this.code}] stopping`);
    if (!this.isRunning) {
      console.log(`[${this.code}] already stopped`);
      return;
    }
    clearInterval(this.pid);
    this.isRunning = false;
    this.pid = null;
  }

  toggle() {
    console.log(`[${this.code}] toggle`);
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  update() {
    console.log(`[${this.code}] update`);
    this.lastUpdate = Date.now();
    this.eventBus.emit('service_data', this.code, this.data);
  }
};

module.exports = BaseService;