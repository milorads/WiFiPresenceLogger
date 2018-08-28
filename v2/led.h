#ifndef _LED_H_
#define _LED_H_

#include <stdlib.h>
#include <stdio.h>
#include <wiringPi.h>

extern int NUMBER_OF_LEDS;
extern float CYCLE_STEP;
extern int PINS[][3];

extern int INDEX_EXC;
extern int COLOR_EXC;

int* get_pins(char color);

int off(int index);
int on(int index, char color);

#endif
