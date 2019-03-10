# Workshop on Web Bluetooth, LitElement and Zephyr on BBC MicroBit

## Making a future proof IoT project by leveraging great technologies

IoT can be really hard, there are plenty of hardware options out there, with a multitude of OSes to choose from - and that is not even thinking about how to get data to and from the device!

In this workshop, we have decided to use the BBC MicroBit (with an onboard nRF51822 from Nordic Semiconductor), which supports Bluetooth Smart for communication. Nordic is a market leader in Bluetooth products and even have new products that work with cellular (eg. LTE) as well. The Nordic hardware is relatively cheap (different price points), super stable and has really good support. 

The BBC MicroBit can be connected to a host system USB port (using a micro-USB cable) for power, flashing (USB Mass Storage) and debug traces (USB CDC).

As the OS, we will use the RTOS Zephyr, a new OS that aims at becoming the Linux for IoT. Zephyr works across a wide range of devices from different manufacturers and will be the OS of choice for all future Nordic products.

An IoT product is unfortunately not worth much without a companion application, so we will be building one too - using modern web technology such as Web Bluetooth and we will be creating the user interface using mostly vanilla HTML, CSS, JavaScript, with a bit of help from the awesome LitElement project.


## Firmware
* Based on Zephyr
* Built for the BBC MicroBit (nRF51822)
* Uses BLE GATT for communication
* Button press sends notification, BLE CMD (write) sets the LEDs

## Web Demo
* Based on LitElement
* Uses Web Bluetooth to communicate with BBC MicroBit boards (flashed with the firmware from this repo)

## Prerequisites
Note: Prebuilt firmware is available if you just want to focus on the web part.

### LitElement
Documentation is here: https://lit-element.polymer-project.org

Note: you will need node/npm and the polymer-cli as a minimum

### Zephyr
https://docs.zephyrproject.org/latest/getting_started/getting_started.html

## Build and Flash
To build the firmware, follow the instructions here:
https://docs.zephyrproject.org/latest/boards/arm/bbc_microbit/doc/board.html

To flash the device, just copy the resulting ```build/zephyr/zephyr.hex``` to the device (mass storage)

## Credits

A special thanks to

https://github.com/carlescufi ( https://twitter.com/carlescufi ), 

https://github.com/lemrey and 

https://github.com/kenchris ( https://twitter.com/kennethrohde )

for help with quirks in

https://github.com/zephyrproject-rtos/zephyr/ ( https://twitter.com/ZephyrIoT ) and

https://github.com/Polymer/lit-element ( https://twitter.com/polymer , https://twitter.com/justinfagnani )
