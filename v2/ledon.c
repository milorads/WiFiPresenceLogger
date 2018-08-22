#include "led.h"

int main(int argc, char* argv[]) {
	int ret;
	if (wiringPiSetup() != 0) {
		printf("Setup error!");
		exit(-1);
	}
	if (argc != 3) {
		printf("Argument number should be 2");
		exit(-2);
	}
	ret = on(atoi(argv[1]), argv[2][0]);
	if (ret == 1) {
		printf("Index out of range");
	}
	if (ret == 2) {
		printf("Color not recognized");
	}
	return ret;
}
