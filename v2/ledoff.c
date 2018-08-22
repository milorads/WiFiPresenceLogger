#include "led.h"

int main(int argc, char* argv[]) {
	int ret;
	if (wiringPiSetup() != 0) {
		printf("Setup error!");
		exit(-1);
	}
	if (argc != 2) {
		printf("Argument number should be 1");
		exit(-2);
	}
	ret = off(atoi(argv[1]));
	if (ret == 1)
		printf("Index out of range");
	return ret;
}
