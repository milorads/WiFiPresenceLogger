#include "led.h"

int SETUP_EXC = -1;
int ARG_EXC = -2;

int main(int argc, char* argv[]) {
	int res;
	if (wiringPiSetup() != 0) {
		printf("Setup error!\n");
		return SETUP_EXC;
	}
	if (argc != 3) {
		printf("Error! Argument number should be 2.\n");
		return ARG_EXC;
	}
	res = on(atoi(argv[1]), argv[2][0]);
	if (res == INDEX_EXC) {
		printf("Error! Index out of range.\n");
		return INDEX_EXC;
	}
	if (res == COLOR_EXC) {
		printf("Error! Color not recognized.\n");
		return COLOR_EXC;
	}
	return EXIT_SUCCESS;
}
