#ifndef _LED_H_
#define _LED_H_

#include <stdlib.h>
#include <stdio.h>
#include <wiringPi.h>

typedef unsigned char byte;

extern int NUMBER_OF_LEDS;
extern float CYCLE_STEP;
extern short PINS[][3];

extern int INDEX_EXC;
extern int COLOR_EXC;

byte* get_pins(char color);

int off(int index);
int on(int index, char color);

#endif
