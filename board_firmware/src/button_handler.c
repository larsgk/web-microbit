#include <zephyr.h>
#include <misc/printk.h>
#include <gpio.h>
#include <device.h>

#include "gatt_service.h"
#include "button_handler.h"

struct device *button_device;

u8_t data_buf[3];

static void button_pressed(struct device *dev, struct gpio_callback *cb,
		 uint32_t pins)
{
    u8_t btn = -1;
    u32_t val;

    if (pins & BIT(SW0_GPIO_PIN))
    {
        btn = 0;
        gpio_pin_read(button_device, SW0_GPIO_PIN, &val);
    }
    else if(pins & BIT(SW1_GPIO_PIN))
    {
        btn = 1;
        gpio_pin_read(button_device, SW1_GPIO_PIN, &val);
    }
    if (btn != -1)
    {
        data_buf[0] = 0x10; // BTN ACTION
        data_buf[1] = btn;
        data_buf[2] = val == 1 ? 0 : 1;
        send_message(GATT_MSG_DATA, data_buf, 3);
    	printk("Buttons[%s] %s\n", btn == 0 ? "LEFT" : "RIGHT", val == 1 ? "RELEASED" : "PRESSED");
    }
}

void button_handler_init()
{	static struct gpio_callback button_cb;

	button_device = device_get_binding(SW0_GPIO_CONTROLLER);
	gpio_pin_configure(button_device, SW0_GPIO_PIN, (GPIO_DIR_IN | GPIO_INT | GPIO_INT_EDGE | GPIO_PUD_PULL_UP | GPIO_INT_DEBOUNCE | GPIO_INT_DOUBLE_EDGE));
	gpio_pin_configure(button_device, SW1_GPIO_PIN, (GPIO_DIR_IN | GPIO_INT | GPIO_INT_EDGE | GPIO_PUD_PULL_UP | GPIO_INT_DEBOUNCE | GPIO_INT_DOUBLE_EDGE));
	gpio_init_callback(&button_cb, button_pressed, BIT(SW0_GPIO_PIN) | BIT(SW1_GPIO_PIN));
	gpio_add_callback(button_device, &button_cb);
	gpio_pin_enable_callback(button_device, SW0_GPIO_PIN);
	gpio_pin_enable_callback(button_device, SW1_GPIO_PIN);
}

