# RuuviTag + Hue

Use RuuviTags data to control Philips Hue lights.

## Install and run

Give access for nodejs to handle ble: 

```bash
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

Use NodeJS v12.

- `npm ci`
- `npm start`