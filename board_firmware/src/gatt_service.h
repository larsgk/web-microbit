#ifndef __GATT_SERVICE_H__
#define __GATT_SERVICE_H__

void gatt_service_init(void);
void send_message(u8_t type, u8_t* data, u16_t len);

enum {
    GATT_MSG_NONE,
    GATT_MSG_HEARTBEAT,
    GATT_MSG_DATA
};

#endif
