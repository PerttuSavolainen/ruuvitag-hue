import ruuvi = require('node-ruuvitag');
import { discoverBridge, alertGroupLightState } from "./hue";

require('dotenv').config();

const {
  HUE_USERNAME,
  HUE_GROUP_ID,
  TEMPERATURE_THRESHOLD,
} = process.env;

ruuvi.on('found', (tag) => {
  const { id } = tag;
  console.log('Found RuuviTag, id: ' + id, JSON.stringify(tag, null, '\t'));

  tag.on('updated', async (data) => {
    const { temperature } = data;
    console.log('Got data from RuuviTag ' + tag.id + ':\n' + JSON.stringify(data, null, '\t'));
    if (temperature > +TEMPERATURE_THRESHOLD) {
      try {
        // connect to hue bridge, and update the light(s)
        const api = await discoverBridge(HUE_USERNAME);
        await alertGroupLightState(api, +HUE_GROUP_ID);

        // TODO fix it so it won't alarm all the time after threshold had been reached
        process.exit();
      } catch (err) { 
        console.error(err);
      }    
    }
  });
});
