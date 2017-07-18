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

export interface ISummaryProps extends ISummaryState,RouteComponentProps<any>
{
  actions?:SummaryActionDispatcher;
}

class Summary extends Component<ISummaryProps> {
  constructor(props: ISummaryProps) {
    super(props);

    this.props.actions.getInitialData();
  }
  render() {
    return (
      <div>
        <Table>
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
