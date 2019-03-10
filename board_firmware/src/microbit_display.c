#include <zephyr.h>
#include <misc/printk.h>
#include <gpio.h>
#include <device.h>
#include <string.h>

#include <display/mb_display.h>

#include "microbit_display.h"

static struct mb_image smiley_happy = 
	MB_IMAGE({ 0, 1, 0, 1, 0 },
			{ 0, 1, 0, 1, 0 },
			{ 0, 0, 0, 0, 0 },
			{ 1, 0, 0, 0, 1 },
			{ 0, 1, 1, 1, 0 });

static struct mb_image smiley_sad =
	MB_IMAGE({ 0, 1, 0, 1, 0 },
			{ 0, 1, 0, 1, 0 },
			{ 0, 0, 0, 0, 0 },
			{ 0, 1, 1, 1, 0 },
			{ 1, 0, 0, 0, 1 });

static const struct mb_image animation[] = {
	MB_IMAGE({ 0, 0, 0, 0, 0 },
			{ 0, 0, 0, 0, 0 },
			{ 0, 0, 1, 0, 0 },
			{ 0, 0, 0, 0, 0 },
			{ 0, 0, 0, 0, 0 }),
	MB_IMAGE({ 0, 0, 0, 0, 0 },
			{ 0, 1, 1, 1, 0 },
			{ 0, 1, 1, 1, 0 },
			{ 0, 1, 1, 1, 0 },
			{ 0, 0, 0, 0, 0 }),
	MB_IMAGE({ 1, 1, 1, 1, 1 },
			{ 1, 1, 1, 1, 1 },
			{ 1, 1, 0, 1, 1 },
			{ 1, 1, 1, 1, 1 },
			{ 1, 1, 1, 1, 1 }),
	MB_IMAGE({ 1, 1, 1, 1, 1 },
			{ 1, 0, 0, 0, 1 },
			{ 1, 0, 0, 0, 1 },
			{ 1, 0, 0, 0, 1 },
			{ 1, 1, 1, 1, 1 }),
};

void mb_show_smiley(bool happy)
{
	struct mb_display *disp = mb_display_get();

	/* Show a smiley-face */
	mb_display_image(disp, MB_DISPLAY_MODE_SINGLE, K_SECONDS(2),
        happy ? &smiley_happy : &smiley_sad, 1);
	k_sleep(K_SECONDS(2));
}

void mb_show_msg(const char* msg, bool block)
{
	struct mb_display *disp = mb_display_get();

	mb_display_print(disp, MB_DISPLAY_MODE_DEFAULT, K_MSEC(300), "%s", msg);
	if (block) {
		k_sleep(K_MSEC(300) * (strlen(msg)+1));
	}
}

void mb_show_bits(const u8_t* buf, u16_t len)
{
	struct mb_display *disp = mb_display_get();

	struct mb_image pixel = {};
	for (int y = 0; y < 5 && y < len; y++) {
			pixel.row[y] = buf[y] & 0x1f; // Only use first 5 bits.
	}
	mb_display_image(disp, MB_DISPLAY_MODE_SINGLE, K_FOREVER, &pixel, 1);
}

void mb_show_ready_animation()
{
	struct mb_display *disp = mb_display_get();
	/* Show a sequential animation */
	mb_display_image(disp, MB_DISPLAY_MODE_DEFAULT,
			 K_MSEC(150), animation, ARRAY_SIZE(animation));
	k_sleep(K_MSEC(150) * ARRAY_SIZE(animation));
}