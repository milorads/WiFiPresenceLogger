#include "led.h"

int SETUP_EXC = -1;
int ARG_EXC = -2;

int main(int argc, char* argv[]) {
	int res, i;
	if (wiringPiSetup() != 0) {
		printf("Setup error!\n");
		return SETUP_EXC;
	}
	if (argc > 2) {
		printf("Error! Argument number should be 1.\n");
		return ARG_EXC;
	}
	if (argc < 2) {
		for (i = 0; i < NUMBER_OF_LEDS; ++i)
			off(i);
		return EXIT_SUCCESS;
	}
	res = off(atoi(argv[1]));
	if (res == INDEX_EXC) {
		printf("Error! Index out of range.\n");
		return INDEX_EXC;
	}
	return EXIT_SUCCESS;
}
