#ifndef __config_hw__
#define __config_hw__

// direct sensor handler
#define PIN_SENSOR_TEMPERATURE A7  // D21 digital
#define PIN_SENSOR_OIL_PRESSURE A6 // D20 analog
#define PIN_SENSOR_FUEL A5         // D19 analog
#define PIN_SENSOR_SPEED A4        // D18 analog
#define PIN_SENSOR_RPM A3          // D17 analog
#define PIN_SENSOR_VOLTAGE A2      // D16 analog

// turn signal handler
#define PIN_SIGNAL_IN_LEFT A1     // D15
#define PIN_SIGNAL_IN_RIGHT A0    // D14
#define PIN_SIGNAL_OUT_RIGHT (13) // D13
#define PIN_SIGNAL_OUT_LEFT (12)  // D12

// muxed thermocouple handler
#define PIN_MUX_OUT_A 9          // D9
#define PIN_MUX_OUT_B 8          // D8
#define PIN_MUX_OUT_C 7          // D7
#define PIN_THERMO_SENSOR_CLK 6  // D6
#define PIN_THERMO_SENSOR_CS 5   // D5
#define PIN_THERMO_SENSOR_DATA 4 // D4

// bluetooth serial
#define PIN_BLUETOOTH_TX 3 // D3
#define PIN_BLUETOOTH_RX 2 // D2

#endif