import React, { ChangeEvent, Component } from 'react';
import { LegacyForms } from '@grafana/ui';
const { FormField } = LegacyForms;

type Props = {
  value: string;
  onChange: Function;
};

type State = {
  processValue: string;
};

// Sets the defaults when the component is loaded
export function aggregatedStatesDefaultString(): string {
  return '';
}

export class ProcessValue extends Component<Props, State> {
  constructor(props: any) {
    // Initialise
    super(props);

    // Parse passed string and initialise state
    let processValue = '';
    const urlParameters = this.props.value.split('&');
    urlParameters.map((parameter) => {
      const keyValuePair = parameter.split('=');
      // Look for inlude running
      if (keyValuePair[0] === 'processValue') {
        processValue = keyValuePair[1];
      }
    });
    this.state = {
      processValue: processValue,
    };
  }

  onProcessValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      processValue: event.target.value,
    });
    console.log('processValue (after state update): ', this.state.processValue);
    console.log('actual value (after state update): ', event.target.value);
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <div className="gf-form">
        <label className="gf-form-label with-5 query-keyword">Process Value</label>
        <FormField
          disabled={false}
          value={this.state.processValue}
          onChange={this.onProcessValueChange}
          label={'Process Value'}
        />
      </div>
    );
  }
}
