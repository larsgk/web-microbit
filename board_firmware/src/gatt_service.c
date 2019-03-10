#include <zephyr/types.h>
#include <stddef.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
#include <misc/printk.h>
#include <misc/byteorder.h>
#include <zephyr.h>

#include <bluetooth/bluetooth.h>
#include <bluetooth/hci.h>
#include <bluetooth/conn.h>
#include <bluetooth/uuid.h>
#include <bluetooth/gatt.h>

#include "gatt_service.h"
#include "microbit_display.h"


static struct bt_gatt_ccc_cfg  heartbeat_ccc_cfg[BT_GATT_CCC_MAX] = {};
static u8_t notify_heartbeat;

static struct bt_gatt_ccc_cfg  data_ccc_cfg[BT_GATT_CCC_MAX] = {};
static u8_t notify_data;

// NOTE: Use a proper GATT UUID for production.
static struct bt_uuid_128 service_uuid = BT_UUID_INIT_128(
	0xf0, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
	0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12);

static struct bt_uuid_128 heartbeat_char_uuid = BT_UUID_INIT_128(
	0xf1, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
	0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12);

static struct bt_uuid_128 data_char_uuid = BT_UUID_INIT_128(
	0xf2, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
	0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12);

static struct bt_uuid_128 cmd_char_uuid = BT_UUID_INIT_128(
	0xf3, 0xde, 0xbc, 0x9a, 0x78, 0x56, 0x34, 0x12,
	0x78, 0x56, 0x34, 0x12, 0x78, 0x56, 0x34, 0x12);


typedef struct notify_msg_t {
	u8_t type;
	u8_t data[20];
	u16_t len;
} notify_msg_t;

#define NOTIFY_BUFFER_LEN_LOG2 (4)
#define NOTIFY_BUFFER_LEN (1<<NOTIFY_BUFFER_LEN_LOG2)

static struct k_work gatt_notify_work;
static notify_msg_t notify_buf[NOTIFY_BUFFER_LEN];
static u8_t next_buf_idx = 0;
static u8_t next_notify_idx = 0;

void gatt_service_heartbeat_notify();
void gatt_service_data_notify(const void *buf, u16_t len);

void send_message(u8_t type, u8_t* data, u16_t len)
{
	if (len > 20) {
		return;
	}

	notify_msg_t* msg = &notify_buf[next_buf_idx];
	next_buf_idx = (next_buf_idx+1) & (NOTIFY_BUFFER_LEN-1);

	msg->type = type;

	if (data && len) {
		msg->len = len;
		memcpy(msg->data, data, len);
	}
}

static u32_t hearbeat_count = 0;

static void send_next_notification(struct k_work *work)
{
	if (next_buf_idx == next_notify_idx) {
		k_sleep(50);
		k_work_submit(&gatt_notify_work);
		return;
	}

	notify_msg_t* msg = &notify_buf[next_notify_idx];
	next_notify_idx = (next_notify_idx+1) & (NOTIFY_BUFFER_LEN-1);

	if (msg->type == GATT_MSG_DATA) {
		gatt_service_data_notify(msg->data, msg->len);
	} else if (msg->type == GATT_MSG_HEARTBEAT) {
		hearbeat_count++;
		gatt_service_heartbeat_notify();
		printk("Heartbeat[%d]\n", hearbeat_count);
	}

	k_work_submit(&gatt_notify_work);
}

static void heartbeat_ccc_cfg_changed(const struct bt_gatt_attr *attr,
				 u16_t value)
{
	notify_heartbeat = (value == BT_GATT_CCC_NOTIFY) ? 1 : 0;
}

static void data_ccc_cfg_changed(const struct bt_gatt_attr *attr,
				 u16_t value)
{
	notify_data = (value == BT_GATT_CCC_NOTIFY) ? 1 : 0;
}


static ssize_t write_cmd(struct bt_conn *conn,
				const struct bt_gatt_attr *attr,
				const void *buf, u16_t len, u16_t offset,
				u8_t flags)
{
	if (len == 0 || len > 20) {
		return 0;
	}

	static u8_t values[32];

	memcpy(values, buf, len);

	if (values[0] == 0x01 && len == 6) {
		mb_show_bits(&values[1], 5);
	} else if (values[0] == 0x02) {
		// You can insert your own command handlers here
		// ...
	} else if (values[0] >= ' ') {
		// Assume plain text - write message on display.
		// Make sure the string is zero terminated
		values[len] = 0;
		mb_show_msg(values, false);
	}

	return len;
}

static struct bt_gatt_attr attrs[] = {
	BT_GATT_PRIMARY_SERVICE(&service_uuid),

	BT_GATT_CHARACTERISTIC(&heartbeat_char_uuid.uuid,
			       BT_GATT_CHRC_NOTIFY,
			       BT_GATT_PERM_NONE, NULL, NULL, NULL),
	BT_GATT_CCC(heartbeat_ccc_cfg, heartbeat_ccc_cfg_changed),

	BT_GATT_CHARACTERISTIC(&data_char_uuid.uuid,
			       BT_GATT_CHRC_NOTIFY,
			       BT_GATT_PERM_NONE, NULL, NULL, NULL),
	BT_GATT_CCC(data_ccc_cfg, data_ccc_cfg_changed),

	BT_GATT_CHARACTERISTIC(&cmd_char_uuid.uuid,
			       BT_GATT_CHRC_WRITE,
			       BT_GATT_PERM_WRITE, NULL, write_cmd, NULL),
};

static struct bt_gatt_service gatt_svc = BT_GATT_SERVICE(attrs);

s8_t initDone = 0;

void gatt_service_init(void)
{
	k_work_init(&gatt_notify_work, send_next_notification);
	k_work_submit(&gatt_notify_work);
	
	bt_gatt_service_register(&gatt_svc);

	initDone = 1;
}

void gatt_service_heartbeat_notify()
{
	if (!initDone)
		return;

	if (!notify_heartbeat) {
		return;
	}

	bt_gatt_notify(NULL, &attrs[1], &hearbeat_count, 2);
}

void gatt_service_data_notify(const void *buf, u16_t len)
{
	if (!initDone)
		return;

	if (!notify_data) {
		return;
	}

	bt_gatt_notify(NULL, &attrs[4], buf, len);
}
