const v3 = require('node-hue-api').v3;
const GroupLightState = v3.lightStates.GroupLightState;

export async function discoverBridge(userName) {
  return v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(userName);
    })
  ;
}
  
export async function alertGroupLightState(api, groupId: number): Promise<void> {
  const state = new GroupLightState()
    .on()
    .alertShort()
  ;
  await api.groups.setGroupState(groupId, state);
}
