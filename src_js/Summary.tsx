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
import {AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area,ComposedChart,Bar,ReferenceLine} from 'recharts';
import {blue500, red500, green500, lime500} from 'material-ui/styles/colors';
import {Link} from 'react-router-dom';

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
        <ComposedChart 
          width={this.props.hostWidth/2}
          height={(this.props.hostHeight-64)/2-32}
          data={this.props.originalData.revisionInfos}
        >
          <XAxis dataKey="id"/>
          <YAxis/>
          <Tooltip labelStyle={{color:"gray"}}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <ReferenceLine 
            x={this.props.selectedRevisionId} 
            stroke="green" 
            isFront={true} />
          {/*<Bar dataKey="current.warningIssuesCount" barSize={10} fill="#413e00" />*/}
          <Area type='monotone' name="error"      dataKey='current.errorIssuesCount' stackId="1" stroke='#8884d8' fill={red500} />
          <Area type='monotone' name="warning"    dataKey='current.warningIssuesCount' stackId="1" stroke='#82ca9d' fill={lime500} />
          <Area type='monotone' name="suggestion" dataKey='current.suggestionIssuesCount' stackId="1" stroke='#ffc658' fill={green500} />
          <Area type='monotone' name="hint"       dataKey='current.hintIssuesCount' stackId="1" stroke='#ffc658' fill={blue500} />
        </ComposedChart>
        <Table 
          height={((this.props.hostHeight-64)/2-32) + "px"} 
          onRowSelection={(selectedRows:number[])=>{
            if(selectedRows.length !== 0)
            {
              this.props.actions.onChangeSelectedRevisionId(this.props.originalData.revisionInfos[selectedRows[0]].id);
            }
            else
            {
              this.props.actions.onChangeSelectedRevisionId("");
            }
            }}
            >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Caption</TableHeaderColumn>
              <TableHeaderColumn>Total</TableHeaderColumn>
              <TableHeaderColumn>Error</TableHeaderColumn>
              <TableHeaderColumn>Warning</TableHeaderColumn>
              <TableHeaderColumn>Suggestion</TableHeaderColumn>
              <TableHeaderColumn>Hint</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.props.originalData.revisionInfos.map(revisionInfo=>{
              return (
                <TableRow key={`rev_${revisionInfo.id}`} selected={revisionInfo.id === this.props.selectedRevisionId}>
                  <TableRowColumn><Link to={`/issues/${revisionInfo.id}`}>{revisionInfo.id}</Link></TableRowColumn>
                  <TableRowColumn>{revisionInfo.caption}</TableRowColumn>
                  <TableRowColumn>
                    <Link to={`/issues/${revisionInfo.id}/`}>{revisionInfo.current.errorIssuesCount + revisionInfo.current.warningIssuesCount+ revisionInfo.current.suggestionIssuesCount + revisionInfo.current.hintIssuesCount}</Link>
                  </TableRowColumn>
                  <TableRowColumn>
                    <Link to={`/issues/${revisionInfo.id}?hidefilter=warning,suggestion,hint`}>{revisionInfo.current.errorIssuesCount}</Link>
                    <span style={{marginLeft:"1em"}}/>
                    ( <Link to={`/issues/${revisionInfo.id}?hidefilter=warning,suggestion,hint&diff=incresedFromPrevious`}>+{revisionInfo.incresedFromPrevious.errorIssuesCount}</Link>
                    <span style={{marginLeft:"1em"}}/>
                    <Link to={`/issues/${revisionInfo.id}?hidefilter=warning,suggestion,hint&diff=fixedFromPrevious`}>-{revisionInfo.fixedFromPrevious.errorIssuesCount}</Link> )
                  </TableRowColumn>
                  <TableRowColumn>
                    <Link to={`/issues/${revisionInfo.id}?hidefilter=error,suggestion,hint`}>{revisionInfo.current.warningIssuesCount}</Link>
                    <span style={{marginLeft:"1em"}}/>
                    ( <Link to={`/issues/${revisionInfo.id}?hidefilter=error,suggestion,hint&diff=incresedFromPrevious`}>+{revisionInfo.incresedFromPrevious.warningIssuesCount}</Link>
                    <span style={{marginLeft:"1em"}}/>
                    <Link to={`/issues/${revisionInfo.id}?hidefilter=error,suggestion,hint&diff=fixedFromPrevious`}>-{revisionInfo.fixedFromPrevious.warningIssuesCount}</Link> )
                  </TableRowColumn>
                  <TableRowColumn>
                    <Link to={`/issues/${revisionInfo.id}?hidefilter=error,warning,hint`}>{revisionInfo.current.suggestionIssuesCount}</Link>
                    <span style={{marginLeft:"1em"}}/>
                    ( <Link to={`/issues/${revisionInfo.id}?hidefilter=error,warning,hint&diff=incresedFromPrevious`}>+{revisionInfo.incresedFromPrevious.suggestionIssuesCount}</Link>
                    <span style={{marginLeft:"1em"}}/>
                    <Link to={`/issues/${revisionInfo.id}?hidefilter=error,warning,hint`}>-{revisionInfo.fixedFromPrevious.suggestionIssuesCount}</Link> )
                  </TableRowColumn>
                  <TableRowColumn>
                    <Link to={`/issues/${revisionInfo.id}?hidefilter=error,warning,suggestion`}>{revisionInfo.current.hintIssuesCount}</Link>
                    <span style={{marginLeft:"1em"}}/>
                    ( <Link to={`/issues/${revisionInfo.id}?hidefilter=error,warning,suggestion&diff=incresedFromPrevious`}>+{revisionInfo.incresedFromPrevious.hintIssuesCount}</Link>
                    <span style={{marginLeft:"1em"}}/>
                    <Link to={`/issues/${revisionInfo.id}?hidefilter=error,warning,suggestion&diff=fixedFromPrevious`}>-{revisionInfo.fixedFromPrevious.hintIssuesCount}</Link> )
                  </TableRowColumn>
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
