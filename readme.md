# hd-mcu

## bluetooth supported mcu for harley davidson with raspberry pi pico

### features

- [x] hardware serial
  - [x] raw ft232 usb serial
- [x] bluetooth serial
  - [x] raw bluetooth serial (hc-06 @ 9600 bps)
  - [x] mobile app
- [ ] obd2/canbus
  - [ ] available pids
- [x] polling/broadcasting
  - [x] reduced power consumption
  - [x] reduced cpu clock usage
- [x] turn signal flasher module
  - [x] left/right turn signal flasher
  - [x] hazard flasher
  - [x] flash on startup
  - [x] adjustable flash rate
- [x] supported sensor inputs
  - [x] multiplexed thermocouples
    - [x] up to 8 thermocouples
  - [x] direct sensor inputs
    - [x] uptime counter (onboard)
    - [x] voltage sensor (onboard)
    - [x] temperature sensor (onboard)
    - [x] rpm sensor (optional)
    - [x] speed sensor (optional)
    - [x] aux \*2 (optional)

### software

**mobile app**

- react-native
  - [x] android
  - [ ] ios

**mcu firmware**

- node/js via [kalumajs](https://kalumajs.org/docs/getting-started)
- FLASH: 2044/24 kb
- SRAM: 264 total, 184/57 kb

### hardware

- raspberry pi pico
  - [pinout](https://pico.pinout.xyz/)
  - [datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)
- hc-06 bluetooth module
  - [datasheet](https://www.olimex.com/Products/Components/RF/BLUETOOTH-SERIAL-HC-06/resources/hc06.pdf)
- cd4051 multiplexer
  - [datasheet](https://www.ti.com/lit/ds/symlink/cd4051b.pdf)
- l298n h-bridge driver module
  - [datasheet](https://www.st.com/resource/en/datasheet/l298.pdf)
- max6675 thermocouple digitizer
  - [datasheet](https://datasheets.maximintegrated.com/en/ds/MAX6675.pdf)
- k-type thermocouple
- 5805 voltage regulator
- 33k resistor
- 10k resistor
- 7.5k resistor
- 4.7k resistor
- 1k resistor
- 1n4001 diode

### pcb

**front**
![front](./pcb/pico-hd-mcu-v2/pcb-front.png)

**back**
![back](./pcb/pico-hd-mcu-v2/pcb-back.png)

**blueprint**
![raw](./pcb/pico-hd-mcu-v2/pcb-blueprint.png)

### mobile app ui

![back](./doc/mobile-app.gif)
