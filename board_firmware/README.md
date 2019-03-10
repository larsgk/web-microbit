# MicroBit firmware for the workshop
Note: before building the firmware, make sure you have installed the latest Zephyr SDK and cloned the zephyr repo.

Instructions here: https://docs.zephyrproject.org/latest/getting_started/getting_started.html

Then:

Open a terminal, go to the cloned zephyr folder and run ```source zephyr-env.sh``` to setup env.

Go to the cloned ```web-microbit/board_firmware``` folder.

## Make the build dir and configure
```
mkdir build
cd build
cmake -GNinja -DBOARD=bbc_microbit ..
```

## Build
```
ninja
```

## Flash
```
copy the resulting zephyr/zephyr.hex to the board and wait for flashing to finish (a few seconds)
```

# Unique identifiers

## BLE
When multiple devices with the same name is in range, the Web Bluetooth scan will show the BLE mac address also.

