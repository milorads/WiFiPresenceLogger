#ifndef _LED_H_
#define _LED_H_

#include <stdlib.h>
#include <stdio.h>
#include <wiringPi.h>

int* get_pins(char color);

int off(int index);

int on(int index, char color);

int blink(int index, char color, int frequency);

#endif
