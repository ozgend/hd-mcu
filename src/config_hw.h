#ifndef __config_hw__
#define __config_hw__

// direct sensor handler
#define PIN_SENSOR_VOLTAGE A0   // D14    +D_VOLT
#define PIN_SENSOR_SPEED A1     // D15    +D_SPD
#define PIN_SENSOR_RPM A2       // D16    +D_RPM
#define PIN_SENSOR_RESERVED1 A3 // D17    +D_RES1
#define PIN_SENSOR_RESERVED2 A4 // D18    +D_RES2
#define PIN_SENSOR_TEMP A5      // D19    +D_TEMP

// turn signal handler
#define PIN_SIGNAL_IN_RIGHT A6  // D20    +R_SIG
#define PIN_SIGNAL_IN_LEFT A7   // D21    +L_SIG
#define PIN_SIGNAL_OUT_RIGHT 13 // D13    +R_REL
#define PIN_SIGNAL_OUT_LEFT 12  // D12    +L_REL

// muxed thermocouple handler
#define PIN_MUX_OUT_A 9          // D9    +D_XA
#define PIN_MUX_OUT_B 8          // D8    +D_XB
#define PIN_MUX_OUT_C 7          // D7    +D_XC
#define PIN_THERMO_SENSOR_CLK 6  // D6    +D_CLK
#define PIN_THERMO_SENSOR_CS 5   // D5    +D_CS
#define PIN_THERMO_SENSOR_DATA 4 // D4    +D_SO

// bluetooth serial
#define PIN_BLUETOOTH_SERIAL_TX 3 // D3    +ARD-TX
#define PIN_BLUETOOTH_SERIAL_RX 2 // D2    +ARD-RX

#endif