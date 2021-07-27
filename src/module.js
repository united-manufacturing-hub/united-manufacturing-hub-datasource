import { DataSourcePlugin } from '@grafana/data';
//import { DataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
var DataSource = require("DataSource");
export var plugin = new DataSourcePlugin(DataSource)
    .setConfigEditor(ConfigEditor)
    .setQueryEditor(QueryEditor);
//# sourceMappingURL=module.js.map