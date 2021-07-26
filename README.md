# United Manufacturing Hub Datasource

---

## What is United Manufacturing Hub Datasource?
UMH Datasource provides an Grafana 8.X compatible plugin, allowing easy data extraction from the UMH factoryinsight microservice.


## Installation
### Build from source
1. Install dependencies
```BASH
yarn install
```
2. Build plugin in development mode or run in watch mode
```BASH
yarn dev
```
3. Build plugin in production mode
```BASH
yarn build
```
4. Move the resulting dist folder into your grafana plugins directory
 - Windows: ```C:\Program Files\GrafanaLabs\grafana\data\plugins```
 - Linux: ```/var/lib/grafana/plugins```
5. You need to [enable development](https://grafana.com/docs/grafana/latest/administration/configuration/) mode to load unsigned plugins

### From Grafana's plugin store
TODO
