import { __assign, __extends } from "tslib";
import React, { PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
var SecretFormField = LegacyForms.SecretFormField, FormField = LegacyForms.FormField;
var ConfigEditor = /** @class */ (function (_super) {
    __extends(ConfigEditor, _super);
    function ConfigEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onCustomerChange = function (event) {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            var jsonData = __assign(__assign({}, options.jsonData), { customerId: event.target.value });
            onOptionsChange(__assign(__assign({}, options), { jsonData: jsonData }));
        };
        _this.onServerChange = function (event) {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            var jsonData = __assign(__assign({}, options.jsonData), { serverURL: event.target.value });
            onOptionsChange(__assign(__assign({}, options), { jsonData: jsonData }));
        };
        _this.onAPIKeyChange = function (event) {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            var regex_match = event.target.value.match("^[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}$");
            var jsonData = __assign(__assign({}, options.jsonData), { apiKey: event.target.value, 
                /// UUI4
                apiKeyConfigured: regex_match !== null && regex_match[0].length === 36 });
            onOptionsChange(__assign(__assign({}, options), { jsonData: jsonData }));
        };
        _this.onResetAPIKey = function () {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            var jsonData = __assign(__assign({}, options.jsonData), { apiKey: '', apiKeyConfigured: false });
            onOptionsChange(__assign(__assign({}, options), { jsonData: jsonData }));
        };
        return _this;
    }
    ConfigEditor.prototype.render = function () {
        var options = this.props.options;
        var jsonData = options.jsonData;
        return (React.createElement("div", { className: "gf-form-group" },
            React.createElement("h3", { className: "page-heading" }, "Customer information"),
            React.createElement("div", { className: "gf-form-group" },
                React.createElement("div", { className: "gf-form" },
                    React.createElement(FormField, { label: "Server", labelWidth: 6, inputWidth: 20, onChange: this.onServerChange, value: jsonData.serverURL || '', placeholder: "Server URL" })),
                React.createElement("div", { className: "gf-form" },
                    React.createElement(FormField, { label: "Customer", labelWidth: 6, inputWidth: 20, onChange: this.onCustomerChange, value: jsonData.customerId || '', placeholder: "Customer ID" })),
                React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(SecretFormField, { isConfigured: jsonData.apiKeyConfigured !== undefined && jsonData.apiKeyConfigured, value: jsonData.apiKey || '', label: "API Key", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", labelWidth: 6, inputWidth: 20, onReset: this.onResetAPIKey, onChange: this.onAPIKeyChange }))))));
    };
    return ConfigEditor;
}(PureComponent));
export { ConfigEditor };
//# sourceMappingURL=ConfigEditor.js.map