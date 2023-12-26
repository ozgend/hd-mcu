#ifndef __config_hw__
#define __config_hw__

// serial
#define SERIAL_BAUD_COM 9600
#define SERIAL_BAUD_BT 9600
#define SERIAL_WRITE_AT_ONCE true

// bluetooth serial
#define PIN_SOFT_SERIAL_RX GP5 //       D2    +RX to bt's TX  +serial
#define PIN_SOFT_SERIAL_TX GP4 //       D3    +TX to bt's RX  +serial

// peripherals
#define P_HAS_BLUETOOTH false
#define P_HAS_TURN_SIGNAL true
#define P_HAS_DIRECT_SENSOR false
#define P_HAS_MUX_SENSOR false

// turn signal module +TSM
#define PIN_SIGNAL_OUT_LEFT 14  //  D15   +L_REL    +digital
#define PIN_SIGNAL_OUT_RIGHT 15 //  D16   +R_REL    +digital
#define PIN_SIGNAL_IN_RIGHT PIN_A0  //  D20   +R_SIG    +analog
#define PIN_SIGNAL_IN_LEFT PIN_A1   //  D21   +L_SIG    +analog

// direct sensor +DCT
#define PIN_SENSOR_VOLTAGE 16 //    D14   +D_VOLT   +analog
#define PIN_SENSOR_RPM 17     //    D17   +D_RPM    +???
#define PIN_SENSOR_SPEED 18   //    D18   +D_SPD    +???
#define PIN_SENSOR_TEMP 19    //    D19   +D_TEMP   +digital

// muxed thermocouple +MUX
#define PIN_MUX_OUT_A 9          // D9    +D_XA     +digital
#define PIN_MUX_OUT_B 8          // D8    +D_XB     +digital
#define PIN_MUX_OUT_C 7          // D7    +D_XC     +digital
#define PIN_THERMO_SENSOR_CLK 6  // D6    +D_CLK    +digital
#define PIN_THERMO_SENSOR_CS 5   // D5    +D_CS     +digital
#define PIN_THERMO_SENSOR_DATA 4 // D4    +D_SO     +digital

#endif