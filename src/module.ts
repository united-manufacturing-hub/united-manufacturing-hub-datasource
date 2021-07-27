import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { JSONQuery, JSONQueryOptions } from './types';
const DataSource = require("DataSource")

export const plugin = new DataSourcePlugin<typeof DataSource, JSONQuery, JSONQueryOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);

