import ruuvi = require('node-ruuvitag');
import { debounce } from "debounce";

import { discoverBridge, alertGroupLightState } from "./hue";

require('dotenv').config();

interface IRuuviTag {
  _events: any;
  _eventsCount: number;
  id: string;
  on: Function;
}

interface IRuuviTagData {
  dataFormat: number; 
  rssi: number; 
  humidity: number; 
  temperature: number;
  pressure: number;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  battery: number;
}

const {
  HUE_USERNAME,
  HUE_GROUP_ID,
  TEMPERATURE_THRESHOLD,
} = process.env;

const handleRuuviTagData = async (tagId: string, data: IRuuviTagData) => {
  const { temperature } = data;
  console.log(`Got data from RuuviTag: ${tagId} ${JSON.stringify(data, null, '\t')}`);

  if (temperature > +TEMPERATURE_THRESHOLD) {
    try {
      // connect to hue bridge, and update the light(s)
      const api = await discoverBridge(HUE_USERNAME);
      await alertGroupLightState(api, +HUE_GROUP_ID);

      // TODO fix it so it won't alarm all the time after threshold had been reached
      // process.exit(0);
    } catch (err) { 
      console.error(err);
    }    
  }
};

ruuvi.on('found', (tag: IRuuviTag) => {
  console.log('Found tag with id: ' + tag.id);
  tag.on('updated', debounce((data: IRuuviTagData) => handleRuuviTagData.apply(null, [tag.id, data]), 2000, true));
});
