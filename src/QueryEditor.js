import { __assign, __extends } from "tslib";
import React, { PureComponent } from 'react';
import { Button, Input, Select } from '@grafana/ui';
import { defaultQuery } from './types';
import { AggregatedStates, aggregatedStatesDefaultString } from 'components/values/AggregatedStates';
import { defaults } from 'lodash';
import { ProcessValue } from "./components/values/ProcessValue";
var QueryEditor = /** @class */ (function (_super) {
    __extends(QueryEditor, _super);
    function QueryEditor(props) {
        var _this = _super.call(this, props) || this;
        // Event handler for the location dropdown
        _this.onLocationChange = function (event) {
            // Prevent change if the currently selected location was reclicked
            if (event.value === _this.state.selectedLocation.index) {
                return;
            }
            // Update the state with the selected location. When the location
            // changes, everything else resets.
            _this.setState({
                selectedLocation: { label: event.label || '', index: event.value || 0 },
                selectedAsset: { label: '', index: 0 },
                selectedValue: { label: '', index: 0 },
                parameterString: '',
                uriPathExtension: '',
            });
            // Update the location-related assets from the server
            _this.props.datasource.getAssets(event.label || '', _this.setAssetsOptions);
        };
        // This assumes that the server resturns an array of strings:
        // ['asset1', 'asset2', ...]
        _this.setAssetsOptions = function (assetArray) {
            // Get the last asset
            var assetIndex = _this.state.selectedAsset.index;
            // Update state with new asset options
            var newAssetLabel = assetArray[assetIndex];
            var newAssetOptions = assetArray.map(function (asset, index) {
                return { label: asset, value: index };
            });
            _this.setState({
                selectedAsset: { label: newAssetLabel, index: assetIndex },
                assetOptions: newAssetOptions,
            });
            // Get the location-asset-related values from the server
            _this.props.datasource.getValues(_this.state.selectedLocation.label, newAssetLabel, _this.setValueOptions);
        };
        // Event handler for the asset dropdown
        _this.onAssetChange = function (event) {
            // Prevent change if the currently selected asset was reclicked
            if (event.value === _this.state.selectedAsset.index) {
                return;
            }
            // Update the state with the selected asset. If the asset changes
            // only the value and the parameter string are reset.
            _this.setState({
                selectedAsset: { label: event.label || '', index: event.value || 0 },
                selectedValue: { label: '', index: 0 },
                parameterString: '',
                uriPathExtension: '',
            });
            // Get the location-asset-related values from the server
            _this.props.datasource.getValues(_this.state.selectedLocation.label, event.label || '', _this.setValueOptions);
        };
        // Update the state with the selected asset
        _this.setValueOptions = function (valueArray) {
            // Get the last value
            var valueIndex = _this.state.selectedValue.index;
            // Update state with new value options
            var newValue = { label: valueArray[valueIndex] || '', index: valueIndex };
            // Renaming value to metric inside this function because
            // the options object has a 'value' key.
            var newValueOptions = valueArray.map(function (metric, index) {
                return { label: metric, value: index };
            });
            _this.setState({
                selectedValue: newValue,
                valueOptions: newValueOptions,
            });
            // Update the default parameter string and update the chart
            _this.setParameters(newValue);
        };
        // Handle value dropdown changes
        _this.onValueChange = function (event) {
            // Prevent change if the currently selected asset was reclicked
            if (event.value === _this.state.selectedValue.index) {
                return;
            }
            // Update the state with the selected value. If the value changes
            // only the paremeter string is reset
            var newValue = { label: event.label || '', index: event.value || 0 };
            _this.setState({
                selectedValue: newValue,
                parameterString: '',
            });
            // Get the location-asset-value-related parameters
            _this.setParameters(newValue);
        };
        _this.setParameters = function (value) {
            var newParameterString = _this.state.parameterString;
            if (value.label === 'aggregatedStates') {
                if (_this.state.parameterString === '') {
                    newParameterString = aggregatedStatesDefaultString();
                    _this.setState({
                        parameterString: newParameterString,
                    });
                }
            }
            // Get the location-asset-value-related datapoints from the server
            // and update the default parameter string
            _this.updateChart(value, newParameterString, '');
        };
        // Handle parameters change
        _this.onParametersChange = function (parameterString) {
            console.log(parameterString);
            // Update the state with the new parameters
            var newParameterString = parameterString;
            _this.setState({
                parameterString: newParameterString,
            });
            // Update chart
            _this.updateChart(_this.state.selectedValue, newParameterString, '');
        };
        // Handle urlPathExtension change
        _this.onuriPathExtensionChange = function (uriPathExtension) {
            console.log("onuriPathExtensionChange", uriPathExtension);
            // Update the state with the new parameters
            _this.setState({
                uriPathExtension: uriPathExtension,
            });
            // Update chart
            _this.updateChart(_this.state.selectedValue, '', uriPathExtension);
        };
        // Get value-related parameters
        _this.getParameterComponents = function () {
            if (_this.state.selectedValue.label === 'process_yourProcessValueName') {
                return (React.createElement("div", null,
                    React.createElement("span", { className: "gf-form-pre" }, "Process Value parameters"),
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(ProcessValue, { value: _this.state.uriPathExtension, onChange: _this.onuriPathExtensionChange }))));
            }
            else if (_this.state.selectedValue.label === 'aggregatedStates') {
                return (React.createElement("div", null,
                    React.createElement("span", { className: "gf-form-pre" }, "Value parameters"),
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(AggregatedStates, { value: _this.state.parameterString, onChange: _this.onParametersChange }))));
            }
            else {
                _this.setState({
                    parameterString: '',
                });
                return React.createElement("div", null);
            }
        };
        // Update chart values. The value parameter is required to avoid
        // waiting for the state to be updated asynchronously
        _this.updateChart = function (value, parameterString, uriPathExtension) {
            if (parameterString === void 0) { parameterString = ''; }
            if (uriPathExtension === void 0) { uriPathExtension = ''; }
            var _a = _this.props, onChange = _a.onChange, query = _a.query, onRunQuery = _a.onRunQuery;
            onChange(__assign(__assign({}, query), { location: _this.state.selectedLocation, asset: _this.state.selectedAsset, value: value, parameterString: parameterString, labelsField: _this.state.labelsField, uriPathExtension: uriPathExtension }));
            // executes the query
            onRunQuery();
        };
        _this.onLabelsFieldNameChange = function (event) {
            // Update the labels field
            _this.setState({
                labelsField: event.target.value,
            });
        };
        _this.useColumnAsFieldNames = function (_) {
            // Update the chart
            _this.updateChart(_this.state.selectedValue, _this.state.parameterString);
        };
        // Default values while we wait for the server's response
        // Using this.props.query... to restore the previous values
        var query = defaults(_this.props.query, defaultQuery);
        _this.state = {
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
        _this.props.datasource.getLocations(function (locationArray) {
            console.log("Got locations: ", locationArray);
            // Get default or previous value
            var locationIndex = _this.state.selectedLocation.index;
            // Update state with new location options
            var newLocationLabel = locationArray[locationIndex];
            var newLocationOptions = locationArray.map(function (location, index) {
                return { label: location, value: index };
            });
            _this.setState({
                selectedLocation: { label: newLocationLabel, index: locationIndex },
                locationOptions: newLocationOptions,
            });
            // Get from server the assets related to the chosen location
            _this.props.datasource.getAssets(newLocationLabel, _this.setAssetsOptions);
        });
        return _this;
    }
    QueryEditor.prototype.render = function () {
        var customParameters = this.getParameterComponents();
        return (React.createElement("div", { className: "gf-form-group" },
            React.createElement("span", { className: "gf-form-pre" }, "Query parameters"),
            React.createElement("div", { className: "gf-form" },
                React.createElement("label", { className: "gf-form-label" }, "Location"),
                React.createElement(Select, { options: this.state.locationOptions, onChange: this.onLocationChange, value: this.state.selectedLocation.index }),
                React.createElement("label", { className: "gf-form-label" }, "Asset"),
                React.createElement(Select, { options: this.state.assetOptions, onChange: this.onAssetChange, value: this.state.selectedAsset.index }),
                React.createElement("label", { className: "gf-form-label" }, "Value"),
                React.createElement(Select, { options: this.state.valueOptions, onChange: this.onValueChange, value: this.state.selectedValue.index })),
            customParameters,
            React.createElement("span", { className: "gf-form-pre" }, "Transformations"),
            React.createElement("div", { className: "gf-form" },
                React.createElement("label", { className: "gf-form-label" }, "Labels field"),
                React.createElement(Input, { css: "", placeholder: "Name of the field to be used as column names.", onChange: this.onLabelsFieldNameChange, value: this.state.labelsField }),
                React.createElement(Button, { onClick: this.useColumnAsFieldNames }, "Apply"))));
    };
    return QueryEditor;
}(PureComponent));
export { QueryEditor };
//# sourceMappingURL=QueryEditor.js.map