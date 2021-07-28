import React, {ChangeEvent, MouseEvent, PureComponent} from 'react';
import {Button, Input, Select} from '@grafana/ui';
import {QueryEditorProps, SelectableValue} from '@grafana/data';
import {defaultQuery, JSONQuery, JSONQueryOptions} from './types';

import {AggregatedStates, aggregatedStatesDefaultString} from 'components/values/AggregatedStates';
import {defaults} from 'lodash';
import {ProcessValue} from "./components/values/ProcessValue";
import {DataSource} from "./datasource";

type Props = QueryEditorProps<DataSource, JSONQuery, JSONQueryOptions>;
type State = {
  selectedLocation: { label: string; index: number };
  selectedAsset: { label: string; index: number };
  selectedValue: { label: string; index: number };
  labelsField: string;
  locationOptions: Array<SelectableValue<number>>;
  assetOptions: Array<SelectableValue<number>>;
  valueOptions: Array<SelectableValue<number>>;
  parameterString: string;
  uriPathExtension: string;
};

export class QueryEditor extends PureComponent<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    // Default values while we wait for the server's response
    // Using this.props.query... to restore the previous values
    const query = defaults(this.props.query, defaultQuery);
    this.state = {
      selectedLocation: query.location,
      selectedAsset: query.asset,
      selectedValue: query.value,
      labelsField: query.labelsField,
      locationOptions: [{ label: '', value: 0 }],
      assetOptions: [{ label: '', value: 0 }],
      valueOptions: [{ label: '', value: 0 }],
      parameterString: query.parameterString,
      uriPathExtension: query.uriPathExtension,
    };

    // Get locations related to the configured customer
    // This assumes that the server resturns an array of strings:
    // ['location1', 'location2', ...]
    this.props.datasource.getLocations((locationArray: any[]) => {
      console.log("Got locations: ", locationArray)
      // Get default or previous value
      const locationIndex = this.state.selectedLocation.index;

      // Update state with new location options
      const newLocationLabel = locationArray[locationIndex];
      const newLocationOptions = locationArray.map((location, index) => {
        return { label: location, value: index };
      });
      this.setState({
        selectedLocation: { label: newLocationLabel, index: locationIndex },
        locationOptions: newLocationOptions,
      });

      // Get from server the assets related to the chosen location
      this.props.datasource.getAssets(newLocationLabel, this.setAssetsOptions);
    });
  }

  // Event handler for the location dropdown
  onLocationChange = (event: SelectableValue<number>) => {
    // Prevent change if the currently selected location was reclicked
    if (event.value === this.state.selectedLocation.index) {
      return;
    }

    // Update the state with the selected location. When the location
    // changes, everything else resets.
    this.setState({
      selectedLocation: { label: event.label || '', index: event.value || 0 },
      selectedAsset: { label: '', index: 0 },
      selectedValue: { label: '', index: 0 },
      parameterString: '',
      uriPathExtension: '',
    });
    // Update the location-related assets from the server
    this.props.datasource.getAssets(event.label || '', this.setAssetsOptions);
  };

  // This assumes that the server resturns an array of strings:
  // ['asset1', 'asset2', ...]
  setAssetsOptions = (assetArray: any[]) => {
    // Get the last asset
    const assetIndex = this.state.selectedAsset.index;

    // Update state with new asset options
    const newAssetLabel = assetArray[assetIndex];
    const newAssetOptions = assetArray.map((asset, index) => {
      return { label: asset, value: index };
    });
    this.setState({
      selectedAsset: { label: newAssetLabel, index: assetIndex },
      assetOptions: newAssetOptions,
    });

    // Get the location-asset-related values from the server
    this.props.datasource.getValues(this.state.selectedLocation.label, newAssetLabel, this.setValueOptions);
  };

  // Event handler for the asset dropdown
  onAssetChange = (event: SelectableValue<number>) => {
    // Prevent change if the currently selected asset was reclicked
    if (event.value === this.state.selectedAsset.index) {
      return;
    }

    // Update the state with the selected asset. If the asset changes
    // only the value and the parameter string are reset.
    this.setState({
      selectedAsset: { label: event.label || '', index: event.value || 0 },
      selectedValue: { label: '', index: 0 },
      parameterString: '',
      uriPathExtension: '',
    });

    // Get the location-asset-related values from the server
    this.props.datasource.getValues(this.state.selectedLocation.label, event.label || '', this.setValueOptions);
  };

  // Update the state with the selected asset
  setValueOptions = (valueArray: any[]) => {
    // Get the last value
    const valueIndex = this.state.selectedValue.index;

    // Update state with new value options
    const newValue = { label: valueArray[valueIndex] || '', index: valueIndex };
    // Renaming value to metric inside this function because
    // the options object has a 'value' key.
    const newValueOptions = valueArray.map((metric, index) => {
      return { label: metric, value: index };
    });
    this.setState({
      selectedValue: newValue,
      valueOptions: newValueOptions,
    });

    // Update the default parameter string and update the chart
    this.setParameters(newValue);
  };

  // Handle value dropdown changes
  onValueChange = (event: SelectableValue<number>) => {
    // Prevent change if the currently selected asset was reclicked
    if (event.value === this.state.selectedValue.index) {
      return;
    }

    // Update the state with the selected value. If the value changes
    // only the paremeter string is reset
    const newValue = { label: event.label || '', index: event.value || 0 };
    this.setState({
      selectedValue: newValue,
      parameterString: '',
    });

    // Get the location-asset-value-related parameters
    this.setParameters(newValue);
  };

  setParameters = (value: { label: string; index: number }) => {
    let newParameterString = this.state.parameterString;
    if (value.label === 'aggregatedStates') {
      if (this.state.parameterString === '') {
        newParameterString = aggregatedStatesDefaultString();
        this.setState({
          parameterString: newParameterString,
        });
      }
    }

    // Get the location-asset-value-related datapoints from the server
    // and update the default parameter string
    this.updateChart(value, newParameterString,'');
  };

  // Handle parameters change
  onParametersChange = (parameterString: string) => {
    console.log(parameterString);
    // Update the state with the new parameters
    const newParameterString = parameterString;
    this.setState({
      parameterString: newParameterString,
    });

    // Update chart
    this.updateChart(this.state.selectedValue, newParameterString,'');
  };

  // Handle urlPathExtension change
  onuriPathExtensionChange = (uriPathExtension: string) => {
    console.log("onuriPathExtensionChange", uriPathExtension);
    // Update the state with the new parameters
    this.setState({
      uriPathExtension: uriPathExtension,
    });

    // Update chart
    this.updateChart(this.state.selectedValue, '',uriPathExtension);
  };


  // Get value-related parameters
  getParameterComponents = () => {
    if (this.state.selectedValue.label === 'process_yourProcessValueName'){
      return (
          <div>
            <span className="gf-form-pre">Process Value parameters</span>
            <div className="gf-form">
              <ProcessValue value={this.state.uriPathExtension} onChange={this.onuriPathExtensionChange} />
            </div>
          </div>
      );
    }else if (this.state.selectedValue.label === 'aggregatedStates') {
      return (
          <div>
            <span className="gf-form-pre">Value parameters</span>
            <div className="gf-form">
              <AggregatedStates value={this.state.parameterString} onChange={this.onParametersChange}/>
            </div>
          </div>
      );
    } else {
      this.setState({
        parameterString: '',
      });
      return <div/>;
    }
  };

  // Update chart values. The value parameter is required to avoid
  // waiting for the state to be updated asynchronously
  updateChart = (value: { label: string; index: number }, parameterString = '', uriPathExtension = '') => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({
      ...query,
      location: this.state.selectedLocation,
      asset: this.state.selectedAsset,
      value: value,
      parameterString: parameterString,
      labelsField: this.state.labelsField,
      uriPathExtension: uriPathExtension
    });
    // executes the query
    onRunQuery();
  };

  onLabelsFieldNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Update the labels field
    this.setState({
      labelsField: event.target.value,
    });
  };

  useColumnAsFieldNames = (_: MouseEvent<HTMLButtonElement>) => {
    // Update the chart
    this.updateChart(this.state.selectedValue, this.state.parameterString);
  };

  render() {
    let customParameters = this.getParameterComponents();
    return (
      <div className="gf-form-group">
        <span className="gf-form-pre">Query parameters</span>
        <div className="gf-form">
          <label className="gf-form-label">Location</label>
          <Select
            options={this.state.locationOptions}
            onChange={this.onLocationChange}
            value={this.state.selectedLocation.index}
          />
          <label className="gf-form-label">Asset</label>
          <Select
            options={this.state.assetOptions}
            onChange={this.onAssetChange}
            value={this.state.selectedAsset.index}
          />
          <label className="gf-form-label">Value</label>
          <Select
            options={this.state.valueOptions}
            onChange={this.onValueChange}
            value={this.state.selectedValue.index}
          />
        </div>
        {customParameters}
        <span className="gf-form-pre">Transformations</span>
        <div className="gf-form">
          <label className="gf-form-label">Labels field</label>
          <Input css={""}
            placeholder="Name of the field to be used as column names."
            onChange={this.onLabelsFieldNameChange}
            value={this.state.labelsField}
          />
          <Button onClick={this.useColumnAsFieldNames}>Apply</Button>
        </div>
      </div>
    );
  }
}
