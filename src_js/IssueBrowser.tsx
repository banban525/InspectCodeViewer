import * as React from "react";
import { Component } from "react";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { SelectableList } from "./SelectableList";
import Subheader from 'material-ui/Subheader';
import { ListItem } from "material-ui/List";
import Iframe from '../node_modules/react-iframe/index.min.js';
import * as objectAssign from 'object-assign';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import { BootstrapTable, TableHeaderColumn, Options,SelectRow,SelectRowMode } from "react-bootstrap-table";
import "jquery";
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import InfoIcon from 'material-ui/svg-icons/action/info';
import {blue500, red500, green500, lime500} from 'material-ui/styles/colors';
import {IssueGroupByTypes, IIssueBrowserState,IInspectResultsSummary,IssueIconType,IIssue,IIssueType,IGroup,IItem,IOriginalData,IssueBrowserActionDispatcher} from './IssueBrowserReducer';
import {RouteComponentProps} from 'react-router-dom';


export interface IIssueBrowserProps extends IIssueBrowserState,RouteComponentProps<any>
{
  actions:IssueBrowserActionDispatcher;
  hostWidth?:number;
  hostHeight?:number;
  selectedThermaId?:number;
}

class IssueBrowser extends Component<IIssueBrowserProps> {
  constructor(props: IIssueBrowserProps) {
    super(props);
    this.expandComponent = this.expandComponent.bind(this);
    this.formatIssuGroup = this.formatIssuGroup.bind(this);
    this.createIssueTreeElement = this.createIssueTreeElement.bind(this);
    this.createIssueGroupElement = this.createIssueGroupElement.bind(this);
    this.createIssueElement = this.createIssueElement.bind(this);
    this.createExpandComponent = this.createExpandComponent.bind(this);

    this.props.actions.getInitialData();
  }


  createIssueTreeListItem(tree: IGroup): JSX.Element[]
  {
    return tree.subGroups.map(group=>(
      <ListItem
        value={group.id}
        open={group.isOpen}
        primaryText={group.name}
        key={group.id}
        rightAvatar={<Badge badgeContent={group.badge} primary={true}/>}
        nestedItems={this.createIssueTreeListItem(group)}
        onNestedListToggle={()=>this.props.actions.onTouchTapListGroup(group)}
        onTouchTap={()=>this.props.actions.onTouchTapListGroup(group)} />
    )).concat(tree.items.map(issue=>(
      <ListItem
        value={issue.id}
        initiallyOpen={false}
        primaryText={issue.name}
        key={issue.id}
        nestedItems={[]}
       />)));
  }

  getCodePageUri():string
  {
    if(this.props.selectedRevision.id !== "" && this.props.selectedIssue.file !== "")
    {
       var result = `./revisions/${this.props.selectedRevision.id}/codes/`;
       result += `${this.props.selectedIssue.file.replace(/\\/g, "_")}.html`;
       result += `?line=${this.props.selectedIssue.line}`;
       if(this.props.selectedThermaId === 1)
       {
         result += "&therma=dark";
       }
       return result;
    }
    else
    {
      return "./empty.html"
    }
  }

  toIconElement(icon: IssueIconType):any{
    if(icon === IssueIconType.error)
    {
      return (<ErrorIcon color={red500}/>);
    }
    if(icon === IssueIconType.warning)
    {
      return (<WarningIcon color={lime500}/>);
    }
    if(icon === IssueIconType.suggestion)
    {
      return (<InfoIcon color={green500}/>);
    }
    if(icon === IssueIconType.hint)
    {
      return (<InfoIcon color={blue500}/>);
    }
    return (<span/>);
  }
  formatIssuGroup(cell:any, row:any):any {
    var group = row as IGroup
    
    return (<div>
      <div style={{textAlign:"left" ,float:"left"}}>{this.toIconElement(group.icon)}{cell}</div>
      <div style={{textAlign:"right"}}>
        <Badge
          badgeContent={group.badge}
          style={{ 
            marginRight:"12px" ,
            paddingBottom: "0px"
            }}
          primary={true}/></div>
    </div>);
  }

  expandComponent(row:any):any{
    return (
      <BootstrapTable 
        data={ row.items }
        striped
        selectRow={{
          mode: 'radio',
          bgColor: darkBaseTheme.palette.primary2Color,
          hideSelectColumn: true,
          clickToSelect: true,
          onSelect: (row: any, isSelected: boolean, e: any)=>{
            this.props.actions.onSelectedIssue(row.id as string);
            return false;
          },
          selected: [this.props.selectedIssueId]
        }}
        options={{
           paginationSize: 3,
           hideSizePerPage: true,
           withFirstAndLast: false
        } as Options}
        pagination
       >
        <TableHeaderColumn isKey dataField='id' hidden>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name'></TableHeaderColumn>
      </BootstrapTable>
    );
  }

  createIssueElement(root:IGroup):any
  {
    var isLargeData = root.items.length > 10;
    return (
      <BootstrapTable 
        data={ root.items }
        striped
        selectRow={{
          mode: 'radio',
          bgColor: darkBaseTheme.palette.primary2Color,
          hideSelectColumn: true,
          clickToSelect: true,
          onSelect: (row: any, isSelected: boolean, e: any)=>{
            this.props.actions.onSelectedIssue(row.id as string);
            return false;
          },
          selected: [this.props.selectedIssueId]
        }}
        options={{
           paginationSize: 3,
           hideSizePerPage: true,
           withFirstAndLast: false
        } as Options}
        pagination = {isLargeData}
       >
        <TableHeaderColumn isKey dataField='id' hidden>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name'></TableHeaderColumn>
      </BootstrapTable>
    );
  }
  createIssueGroupElement(root: IGroup):any{
    var isLargeData = root.subGroups.length > 10;
    return (
      <BootstrapTable 
        data={root.subGroups} 
        striped
        expandableRow={ (row)=>true }
        expandComponent={ this.createExpandComponent }
        pagination = {isLargeData}
        options={{
          paginationPosition: 'top',
          expanding: root.expandedChildren
          } as Options}
        selectRow={{
          mode:'radio',
          clickToSelect: true,
          clickToExpand: true,
          hideSelectColumn: true,
          onSelect:(row: any, isSelected: boolean, e: any)=>{
            this.props.actions.onSelectedIssueGroup(root, row);
            return false;
          }
        } as SelectRow}
      >
          <TableHeaderColumn isKey dataField='id' hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' dataFormat={this.formatIssuGroup}></TableHeaderColumn>
      </BootstrapTable>
    );
  }

  createExpandComponent(target: IGroup)
  {
    if(target.subGroups.length > 0)
    {
      return this.createIssueGroupElement(target);
    }
    else
    {
      return this.createIssueElement(target);
    }
  }

  createIssueTreeElement(root: IGroup):any{
    return (
      <BootstrapTable 
        data={root.subGroups} 
        striped
        expandableRow={ (row)=>true }
        expandComponent={ this.createExpandComponent }
        pagination
        maxHeight={(this.props.hostHeight - 24-64-72-72-128) + "px"}
        options={{
          paginationPosition: 'top',
          expanding: root.expandedChildren
          } as Options}
        selectRow={{
          mode:'radio',
          clickToSelect: true,
          clickToExpand: true,
          hideSelectColumn: true,
          onSelect:(row: any, isSelected: boolean, e: any)=>{
            this.props.actions.onSelectedIssueGroup(root, row);
            return false;
          }
        } as SelectRow}
      >
          <TableHeaderColumn isKey dataField='id' hidden>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' dataFormat={this.formatIssuGroup}></TableHeaderColumn>
      </BootstrapTable>
    );
  }

  render() {
    return (
      <div>
        <div style={{float: "left", width: "40%", height: "100%"}}>
          <SelectField
            floatingLabelText="Diff Base Rev"
            value={this.props.selectedDiffBaseRevision.id}
            onChange={(event:any, index:number, value:string)=>this.props.actions.onChangedDiffBaseRevision(index)}
            fullWidth
            style={{height:"72px"}}>
          {this.props.revisions.revisionInfos.map(revision=>{
            return (<MenuItem 
              key={"Revision_" + revision.id}
              value={revision.id} 
              primaryText={revision.caption} 
              rightAvatar={<Badge badgeContent={revision.issueCount} primary={true}/>} />)
          })}
          </SelectField>
          <SelectField
            floatingLabelText="Revisions"
            value={this.props.selectedRevision.id}
            onChange={(event:any, index:number, value:string)=>this.props.actions.onChangedRevision(index)}
            fullWidth
            style={{height:"72px"}}>
          {this.props.revisions.revisionInfos.map(revision=>{
            return (<MenuItem 
              key={"Revision_" + revision.id}
              value={revision.id} 
              primaryText={revision.caption} 
              rightAvatar={<Badge badgeContent={revision.issueCount} primary={true}/>} />)
          })}
          </SelectField>
          <SelectField
            floatingLabelText="Issues Group By"
            value={this.props.issuesGroupBy}
            onChange={(event:any, index:number, value:number)=>this.props.actions.onChangeIssuesGroupBy(value)}
            style={{height:"72px"}}
          >
            <MenuItem value={1} primaryText="Directory and File" />
            <MenuItem value={2} primaryText="Issue Type" />
            <MenuItem value={3} primaryText="Issue Category" />
          </SelectField>
          <div style={{height:(this.props.hostHeight - 24-64-72-72) + "px"}}>
            {this.createIssueTreeElement(this.props.tree)}
          </div>
          </div>
        <div style={{float: "none", width: "auto", marginLeft: "40%",height:`${this.props.hostHeight - 64}px`}}>
          <Iframe url={this.getCodePageUri()}
            width="100%"
            height="70%"
            display="initial"
            position="relative"
            allowFullScreen />
          <Paper height="200px" style={{float: "bottom"}} >
            Id:{this.props.selectedIssue.id}<br/>
            Message:{this.props.selectedIssue.message}<br/>
            Project:{this.props.selectedIssue.project}<br/>
            File:{this.props.selectedIssue.file}<br/>
            Line:{this.props.selectedIssue.line}<br/>
            Column:{this.props.selectedIssue.column}<br/>
            Url:<a target="_blank" href={this.props.selectedIssueType.wikiUrl}>{this.props.selectedIssueType.wikiUrl}</a><br/>
          </Paper>
        </div>
      </div>
    );
  }
}

export default IssueBrowser;
