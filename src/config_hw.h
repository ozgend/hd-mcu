#ifndef __config_hw__
#define __config_hw__

// bluetooth serial
#define PIN_BLUETOOTH_RX 10
#define PIN_BLUETOOTH_TX 11

// turn signal handler
#define PIN_SIGNAL_IN_RIGHT A0
#define PIN_SIGNAL_IN_LEFT A1
#define PIN_SIGNAL_OUT_RIGHT 7
#define PIN_SIGNAL_OUT_LEFT 8

// muxed thermocouple handler
#define PIN_THERMO_SENSOR_CLK 6  // yellow
#define PIN_THERMO_SENSOR_CS 5   // orange
#define PIN_THERMO_SENSOR_DATA 4 // geen
#define PIN_MUX_INHIBIT 13       // brown
#define PIN_MUX_OUT_A 14         // gray
#define PIN_MUX_OUT_B 15         // purple
#define PIN_MUX_OUT_C 16         // blue

// direct sensor handler
#define PIN_SENSOR_TEMPERATURE 3   // digital
#define PIN_SENSOR_VOLTAGE A2      // analog
#define PIN_SENSOR_RPM A4          // analog
#define PIN_SENSOR_SPEED A5        // analog
#define PIN_SENSOR_FUEL A6         // analog
#define PIN_SENSOR_OIL_PRESSURE A7 // analog

#endif