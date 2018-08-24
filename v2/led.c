#include "led.h"

int NUMBER_OF_LEDS = 2;
float CYCLE_STEP = 1024.0 / 100;

int PINS[][3] = {
	{23, 24, 25},
	{27, 28, 29}
};

int* get_pins(char color) {
	int* pins = calloc(3, sizeof(int));
	switch (color) {
	case 'r':
		pins[0] = 75; break;
	case 'g':
		pins[1] = 75; break;
	case 'b':
		pins[2] = 100; break;
	case 'y':
		pins[0] = 85; pins[1] = 100; break;
	case 'p':
		pins[0] = 25; pins[2] = 100; break;
	case 'c':
		pins[1] = 70; pins[2] = 100; break;
	case 'w':
		pins[0] = 60; pins[1] = 100; pins[2] = 100; break;
	}
	return pins;
}


int off(int index) {
	int i;
	if (index < 0 || index >= NUMBER_OF_LEDS)
		return 1;
	for (i = 0; i < 3; ++i) {
		pinMode(PINS[index][i], OUTPUT);
		digitalWrite(PINS[index][i], 0);
	}
	return 0;
}


int on(int index, char color) {
	int i, * pins;
	
	if (index < 0 || index >= NUMBER_OF_LEDS)
		return 1;
	if (pins[0] == 0 && pins[1] == 0 && pins[2] == 0)
		return 2;
	off(index);
	pins = get_pins(color);
	
	if (pins[0] != 0) {
		if (pins[0] == 100 || index == 1) {
			pinMode(PINS[index][0], OUTPUT);
			digitalWrite(PINS[index][0], 1);
		} else {
			pinMode(PINS[index][0], PWM_OUTPUT);
			pwmWrite(PINS[index][0], CYCLE_STEP * pins[0]);
		}
	}
	if (pins[1] != 0) {
		if (pins[1] == 100 || index == 1) {
			pinMode(PINS[index][1], OUTPUT);
			digitalWrite(PINS[index][1], 1);
		} else {
			pinMode(PINS[index][1], PWM_OUTPUT);
			pwmWrite(PINS[index][1], CYCLE_STEP * pins[1]);
		}
	}
	if (pins[2] != 0) {
		if (pins[2] == 100 || index == 1) {
			pinMode(PINS[index][2], OUTPUT);
			digitalWrite(PINS[index][2], 1);
		} else {
			pinMode(PINS[index][2], PWM_OUTPUT);
			pwmWrite(PINS[index][2], CYCLE_STEP * pins[2]);
		}
	}
	free(pins);
	return 0;
}