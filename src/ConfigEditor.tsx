import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { JSONQueryOptions } from './types';

const { SecretFormField, FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<JSONQueryOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onCustomerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      customerId: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onServerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      serverURL: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const regex_match = event.target.value.match("^[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}$");
    const jsonData = {
      ...options.jsonData,
      apiKey: event.target.value,
      /// UUI4
      apiKeyConfigured: regex_match !== null && regex_match[0].length === 36
    };
    onOptionsChange({...options, jsonData});
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      apiKey: '',
      apiKeyConfigured: false,
    };
    onOptionsChange({ ...options, jsonData });
  };

  render() {
    const { options } = this.props;
    const { jsonData } = options;

    return (
      <div className="gf-form-group">
        <h3 className="page-heading">Customer information</h3>
        <div className="gf-form-group">
          <div className="gf-form">
            <FormField
              label="Server"
              labelWidth={6}
              inputWidth={20}
              onChange={this.onServerChange}
              value={jsonData.serverURL || ''}
              placeholder="Server URL"
            />
          </div>
          <div className="gf-form">
            <FormField
              label="Customer"
              labelWidth={6}
              inputWidth={20}
              onChange={this.onCustomerChange}
              value={jsonData.customerId || ''}
              placeholder="Customer ID"
            />
          </div>
          <div className="gf-form-inline">
            <div className="gf-form">
              <SecretFormField
                isConfigured={jsonData.apiKeyConfigured !== undefined && jsonData.apiKeyConfigured}
                value={jsonData.apiKey || ''}
                label="API Key"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                labelWidth={6}
                inputWidth={20}
                onReset={this.onResetAPIKey}
                onChange={this.onAPIKeyChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
