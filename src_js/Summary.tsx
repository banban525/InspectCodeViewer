import * as React from "react";
import { Component } from "react";
import {SummaryActionDispatcher, ISummaryState} from './SummaryReducer'
import {RouteComponentProps} from 'react-router-dom';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area} from 'recharts';
import {blue500, red500, green500, lime500} from 'material-ui/styles/colors';

export interface ISummaryProps extends ISummaryState,RouteComponentProps<any>
{
  actions?:SummaryActionDispatcher;
  hostWidth?:number;
  hostHeight?:number;
}

class Summary extends Component<ISummaryProps> {
  constructor(props: ISummaryProps) {
    super(props);

    this.props.actions.getInitialData();
  }
  render() {
    return (
      <div>
        <AreaChart 
          width={this.props.hostWidth/2}
          height={(this.props.hostHeight-64)/2-32}
          data={this.props.originalData.revisionInfos}
        >
          <XAxis dataKey="id"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Area type='monotone' dataKey='current.errorIssuesCount' stackId="1" stroke='#8884d8' fill={red500} />
          <Area type='monotone' dataKey='current.warningIssuesCount' stackId="1" stroke='#82ca9d' fill={lime500} />
          <Area type='monotone' dataKey='current.suggestionIssuesCount' stackId="1" stroke='#ffc658' fill={green500} />
          <Area type='monotone' dataKey='current.hintIssuesCount' stackId="1" stroke='#ffc658' fill={blue500} />
        </AreaChart>
        <Table height={((this.props.hostHeight-64)/2-32) + "px"}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Caption</TableHeaderColumn>
              <TableHeaderColumn>Error</TableHeaderColumn>
              <TableHeaderColumn>Warning</TableHeaderColumn>
              <TableHeaderColumn>Suggestion</TableHeaderColumn>
              <TableHeaderColumn>Hint</TableHeaderColumn>
              <TableHeaderColumn>Total</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.props.originalData.revisionInfos.map(revisionInfo=>{
              return (
                <TableRow>
                  <TableRowColumn>{revisionInfo.id}</TableRowColumn>
                  <TableRowColumn>{revisionInfo.caption}</TableRowColumn>
                  <TableRowColumn>{revisionInfo.current.errorIssuesCount} ( +{revisionInfo.incresedFromPrevious.errorIssuesCount} -{revisionInfo.fixedFromPrevious.errorIssuesCount} )</TableRowColumn>
                  <TableRowColumn>{revisionInfo.current.warningIssuesCount} ( +{revisionInfo.incresedFromPrevious.warningIssuesCount}  -{revisionInfo.fixedFromPrevious.warningIssuesCount} )</TableRowColumn>
                  <TableRowColumn>{revisionInfo.current.suggestionIssuesCount} ( +{revisionInfo.incresedFromPrevious.suggestionIssuesCount}  -{revisionInfo.fixedFromPrevious.suggestionIssuesCount} )</TableRowColumn>
                  <TableRowColumn>{revisionInfo.current.hintIssuesCount} ( +{revisionInfo.incresedFromPrevious.hintIssuesCount}  -{revisionInfo.fixedFromPrevious.hintIssuesCount} )</TableRowColumn>
                  <TableRowColumn>{revisionInfo.current.errorIssuesCount + revisionInfo.current.warningIssuesCount+ revisionInfo.current.suggestionIssuesCount + revisionInfo.current.hintIssuesCount}</TableRowColumn>
                </TableRow>
              );
            })}

          </TableBody>
        </Table>
      </div>
      );
  }
}

export default Summary;
