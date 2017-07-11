import * as React from "react";
import { Component } from "react";
import {SummaryActionDispatcher, ISummaryState} from './SummaryReducer'
import {RouteComponentProps} from 'react-router-dom';

export interface ISummaryProps extends ISummaryState,RouteComponentProps<any>
{
  actions?:SummaryActionDispatcher;
}

class Summary extends Component<ISummaryProps> {
  constructor(props: ISummaryProps) {
    super(props);
  }
  render() {
    return (
      <div>
        SUMMARY
      </div>
      );
  }
}

export default Summary;
