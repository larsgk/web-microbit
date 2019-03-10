#ifndef __MICROBIT_DISPLAY_H__
#define __MICROBIT_DISPLAY_H__

void mb_show_smiley(bool happy);
void mb_show_msg(const char* msg, bool block);
void mb_show_bits(const u8_t* buf, u16_t len);
void mb_show_ready_animation();

#endif
