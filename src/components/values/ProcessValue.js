import { __extends } from "tslib";
import React, { Component } from 'react';
import { LegacyForms } from "@grafana/ui";
var FormField = LegacyForms.FormField;
// Sets the defaults when the component is loaded
export function aggregatedStatesDefaultString() {
    return '';
}
var ProcessValue = /** @class */ (function (_super) {
    __extends(ProcessValue, _super);
    function ProcessValue(props) {
        var _this = 
        // Initialise
        _super.call(this, props) || this;
        _this.onProcessValueChange = function (event) {
            _this.setState({
                processValue: event.target.value,
            });
            console.log("processValue (after state update): ", _this.state.processValue);
            console.log("actual value (after state update): ", event.target.value);
            _this.props.onChange(event.target.value);
        };
        // Parse passed string and initialise state
        var processValue = "";
        var urlParameters = _this.props.value.split('&');
        urlParameters.map(function (parameter) {
            var keyValuePair = parameter.split('=');
            // Look for inlude running
            if (keyValuePair[0] === 'processValue') {
                processValue = keyValuePair[1];
            }
        });
        _this.state = {
            processValue: processValue,
        };
        return _this;
    }
    ProcessValue.prototype.render = function () {
        return (React.createElement("div", { className: "gf-form" },
            React.createElement("label", { className: "gf-form-label with-5 query-keyword" }, "Process Value"),
            React.createElement(FormField, { disabled: false, value: this.state.processValue, onChange: this.onProcessValueChange, label: "Process Value" })));
    };
    return ProcessValue;
}(Component));
export { ProcessValue };
//# sourceMappingURL=ProcessValue.js.map