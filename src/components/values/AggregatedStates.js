import { __extends } from 'tslib';
import React, { Component } from 'react';
import { Switch } from '@grafana/ui';
// Sets the defaults when the component is loaded
export function aggregatedStatesDefaultString() {
  return '&includeRunning=false';
}
var AggregatedStates = /** @class */ (function (_super) {
  __extends(AggregatedStates, _super);
  function AggregatedStates(props) {
    var _this =
      // Initialise
      _super.call(this, props) || this;
    _this.onIncludeRunningChange = function () {
      var parameterString = '&includeRunning=' + !_this.state.includeRunning;
      _this.setState({
        includeRunning: !_this.state.includeRunning,
      });
      _this.props.onChange(parameterString);
    };
    // Parse passed string and initialise state
    var initialState = false;
    try {
      var urlParameters = _this.props.value.split('&');
      urlParameters.map(function (parameter) {
        var keyValuePair = parameter.split('=');
        // Look for inlude running
        if (keyValuePair[0] === 'includeRunning') {
          if (keyValuePair[1] === 'true' || keyValuePair[1] === 'True') {
            initialState = true;
          }
        }
      });
    } catch (_a) {
      console.log('Wrong aggregatedStates parameters. It must either be includeRunning=true or includeRunning=false ');
    }
    _this.state = {
      includeRunning: initialState,
    };
    return _this;
  }
  AggregatedStates.prototype.render = function () {
    return React.createElement(
      'div',
      { className: 'gf-form' },
      React.createElement('label', { className: 'gf-form-label with-5 query-keyword' }, 'Include Running'),
      React.createElement(Switch, {
        css: '',
        disabled: false,
        value: this.state.includeRunning,
        onChange: this.onIncludeRunningChange,
      })
    );
  };
  return AggregatedStates;
})(Component);
export { AggregatedStates };
//# sourceMappingURL=AggregatedStates.js.map
