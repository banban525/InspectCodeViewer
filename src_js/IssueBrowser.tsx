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
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import FilterListIcon from 'material-ui/svg-icons/content/filter-list';
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {MuiTheme} from 'material-ui/styles';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import DropDownMenu from 'material-ui/DropDownMenu';

import {blue500, red500, green500, lime500} from 'material-ui/styles/colors';
import {IssueGroupByTypes, IInspectResultsSummary,IIssue,IIssueType,IOriginalData,IssueSeverity} from './CommonData';
import { IIssueBrowserState,IssueIconType,IGroup,IItem,IssueBrowserActionDispatcher,DiffMode} from './IssueBrowserReducer';
import {RouteComponentProps} from 'react-router-dom';
import * as querystring from 'query-string';
import {LocationDescriptorObject} from 'history';

export interface IIssueBrowserProps extends IIssueBrowserState,RouteComponentProps<any>
{
  actions:IssueBrowserActionDispatcher;
  hostWidth?:number;
  hostHeight?:number;
  selectedThermaId?:number;
  muiThema?: MuiTheme;
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

    var queyparameters = this.props.location.search
    var revisionId = this.props.match.params.revid;
    var parsed  = querystring.parse(queyparameters);
    var hideStr:string = "";
    if(parsed.hidefilter !== undefined)
    {
      hideStr = parsed.hidefilter;
    }
    var diffMode:DiffMode = DiffMode.Normal;
    if(parsed.diff !== undefined)
    {
      var diffStr:string = parsed.diff;
      if(diffStr === "incresedFromPrevious")
      {
        diffMode = DiffMode.IncresedFromPrevious;
      }
      else if(diffStr === 'fixedFromPrevious')
      {
        diffMode = DiffMode.FixedFromPrevious;
      }
      else if(diffStr === 'incresedFromFirst')
      {
        diffMode = DiffMode.IncresedFromFirst;
      }
      else if(diffStr === 'fixedFromFirst')
      {
        diffMode = DiffMode.FixedFromFirst;
      }
    }
    this.props.actions.getInitialData2(revisionId, diffMode, "", hideStr);
  }


  getCodePageUri():string
  {
    if(this.props.selectedRevision.id === "" || this.props.selectedIssue.file === "")
    {
      return "./empty.html"
    }

    var revisionDataToShow = this.props.selectedRevision;
    if(this.props.diffMode === DiffMode.FixedFromFirst || this.props.diffMode === DiffMode.FixedFromPrevious)
    {
      revisionDataToShow = this.props.selectedDiffBaseRevision;
    }

    var result = `./revisions/${revisionDataToShow.id}/codes/`;
    result += `${this.props.selectedIssue.file.replace(/\\/g, "_")}.html`;
    result += `?line=${this.props.selectedIssue.line}`;
    if(this.props.selectedThermaId === 1)
    {
      result += "&therma=dark";
    }
    return result;
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
    var isLargeData = row.items.length > 10;
    return (
      <BootstrapTable 
        data={ row.items }
        striped
        pagination={isLargeData}
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
          paginationPosition: 'top',
          hideSizePerPage: true,
          withFirstAndLast: false,
          paginationPanel: this.createNavigationFactory(row.id, row.items.length),
          page:row.pageNo,
          pageStartIndex:1
        } as Options}
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
        pagination={isLargeData}
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
          paginationPosition: 'top',
          hideSizePerPage: true,
          withFirstAndLast: false,
          paginationPanel: this.createNavigationFactory(root.id, root.items.length),
          page:root.pageNo,
          pageStartIndex:1
        } as Options}
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
        pagination={isLargeData}
        options={{
          paginationPosition: 'top',
          paginationPanel: this.createNavigationFactory(root.id, root.subGroups.length),
          page:root.pageNo,
          pageStartIndex:1,
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
  createNavigationFactory(parentId:any, totalCount:number) : (props:any)=>any
  {
    let renderPaginationPanel = (props:any) => {
      let curPageNo = props.currPage;
      let pageStartIndex = props.pageStartIndex;
      let sizePerPage = props.sizePerPage;
      let totalPageCount = Math.ceil(totalCount / sizePerPage);
      let navigationButtonStyle:any = {width:"36px", minWidth:"36px", margin:"4px"};
      return (
        <div>
          <div>
            <FlatButton 
              key={`${parentId}_page_0`} 
              style={navigationButtonStyle} 
              onTouchTap={ () => {
                //props.changePage(1);
                this.props.actions.onChangePage(parentId, 1);
                } }>|&lt;</FlatButton>
            {
              Array.apply(null, {length: 5}).map((val:any,index:number)=>{
                let pageNo = curPageNo + index-2;
                let disabled = pageNo <= 0 || totalPageCount < pageNo;
                return (
                  <FlatButton 
                    backgroundColor={pageNo === curPageNo ? this.muiTheme.palette.primary1Color : "transparent"}
                    key={`${parentId}_page_${pageNo}`}
                    disabled={disabled }
                    style={navigationButtonStyle} 
                    onTouchTap={ () => {
                      //props.changePage(pageNo);
                      this.props.actions.onChangePage(parentId, pageNo);
                      } }>{disabled?"-":pageNo}</FlatButton>);
              })
            }
            <FlatButton 
              style={navigationButtonStyle} 
              onTouchTap={ () => {
                //props.changePage(totalPageCount);
                this.props.actions.onChangePage(parentId, totalPageCount);
                } }>&gt;|</FlatButton>
          </div>
        </div>
      );
    }
    return renderPaginationPanel;
  }

  createIssueTreeElement(root: IGroup):any{
    return (
      <BootstrapTable 
        data={root.subGroups} 
        striped
        expandableRow={ (row)=>true }
        expandComponent={ this.createExpandComponent }
        maxHeight={(this.props.hostHeight - 24-64-72-72-128) + "px"}
        pagination
        options={{
          paginationPosition: 'top',
          sizePerPage:10,
          expanding: root.expandedChildren,
          paginationPanel: this.createNavigationFactory(root.id, root.subGroups.length),
          page:root.pageNo,
          pageStartIndex:1
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

  createUri(selectedRevisionId:string, issueId:string, diffMode:number, showError:boolean,showWarning:boolean,showSuggestion:boolean,showHint:boolean):LocationDescriptorObject{
    var search="";
    if(!showError){ search += 'error,'; }
    if(!showWarning){ search += 'warning,'; }
    if(!showSuggestion){ search += 'suggestion,'; }
    if(!showHint){ search += 'hint,'; }

    if(search !== "")
    {
      search = "?hidefilter="+search;
    }
    return {
      pathname:`/issues/${selectedRevisionId}`,
      search:search
    };
  }

  muiTheme:MuiTheme;
  render() {
    this.muiTheme = darkBaseTheme;
    if(this.props.selectedThermaId === 0)
    {
      this.muiTheme = lightBaseTheme;
    }
    let activeToggleButtonStyle:any = {width:"36px", minWidth:"36px", margin:"4px",backgroundColor:this.muiTheme.palette.clockCircleColor};
    let inactiveToggleButtonStyle:any = {width:"36px", minWidth:"36px", margin:"4px"};

    return (
      <div>
        <div style={{float: "left", width: "40%", height: "100%"}}>
          <Toolbar style={{backgroundColor:darkBaseTheme.palette.clockCircleColor}} >
            <ToolbarGroup firstChild={true}>
              <SelectField
                floatingLabelText="Revisions"
                value={this.props.selectedRevision.id}
                onChange={(event:any, index:number, value:string)=>this.props.actions.onChangedRevision(index)}
                style={{height:"72px"}}>
              {this.props.revisions.revisionInfos.map(revision=>{
                return (<MenuItem 
                  key={"Revision_" + revision.id}
                  value={revision.id} 
                  primaryText={revision.id} 
                  rightAvatar={<Badge badgeContent={revision.issueCount} primary={true}/>} />)
              })}
              </SelectField>
            </ToolbarGroup>
            <ToolbarGroup>
              <SelectField
                floatingLabelText="Issues filter"
                value={this.props.diffMode}
                onChange={(event:any, index:number, value:number)=>this.props.actions.onChangeDiffMode(value)}
                style={{height:"72px"}}
              >
                <MenuItem value={0} primaryText="All issues" />
                <MenuItem value={1} primaryText="Incresed issues from previous revision" />
                <MenuItem value={2} primaryText="Incresed issues from first revision" />
                <MenuItem value={3} primaryText="Fixed issues from previous revision" />
                <MenuItem value={4} primaryText="Fixed issues from first revision" />
              </SelectField>
            </ToolbarGroup>
          </Toolbar>
          <Toolbar style={{backgroundColor:darkBaseTheme.palette.clockCircleColor}}>
            <ToolbarGroup firstChild={true}>
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

              <FlatButton 
                style={this.props.showErrorIssues?activeToggleButtonStyle:inactiveToggleButtonStyle} 
                icon={<ErrorIcon color={red500}/>}
                onTouchTap={()=>{
                  this.props.history.replace(
                    this.createUri(this.props.selectedRevision.id, 
                    this.props.selectedIssueId,
                    this.props.diffMode,
                    !this.props.showErrorIssues,
                    this.props.showWarningIssues,
                    this.props.showSuggestionIssues,
                    this.props.showHintIssues));

                    this.props.actions.onToggleShowErrorIssues();
                  }}/>
              <FlatButton 
                style={this.props.showWarningIssues?activeToggleButtonStyle:inactiveToggleButtonStyle} 
                icon={<WarningIcon color={lime500}/>}
                onTouchTap={()=>{
                  this.props.history.replace(
                    this.createUri(this.props.selectedRevision.id, 
                    this.props.selectedIssueId,
                    this.props.diffMode,
                    this.props.showErrorIssues,
                    !this.props.showWarningIssues,
                    this.props.showSuggestionIssues,
                    this.props.showHintIssues));
                    
                    this.props.actions.onToggleShowWarningIssues();
                  }}/>
              <FlatButton 
                style={this.props.showSuggestionIssues?activeToggleButtonStyle:inactiveToggleButtonStyle} 
                icon={<InfoIcon color={green500}/>}
                onTouchTap={()=>{
                  this.props.history.replace(
                    this.createUri(this.props.selectedRevision.id, 
                    this.props.selectedIssueId,
                    this.props.diffMode,
                    this.props.showErrorIssues,
                    this.props.showWarningIssues,
                    !this.props.showSuggestionIssues,
                    this.props.showHintIssues));
                    
                    this.props.actions.onToggleShowSuggestionIssues();
                  }}/>
              <FlatButton 
                style={this.props.showHintIssues?activeToggleButtonStyle:inactiveToggleButtonStyle} 
                icon={<InfoIcon color={blue500}/>}
                onTouchTap={()=>{
                  this.props.history.replace(
                    this.createUri(this.props.selectedRevision.id, 
                    this.props.selectedIssueId,
                    this.props.diffMode,
                    this.props.showErrorIssues,
                    this.props.showWarningIssues,
                    this.props.showSuggestionIssues,
                    !this.props.showHintIssues));
                    
                    this.props.actions.onToggleShowHintIssues();
                  }}/>
            </ToolbarGroup>
            <ToolbarGroup>
              <IconButton onTouchTap={()=>{this.props.actions.onMovePreviousIssue();}}>
                <ArrowUpIcon />
              </IconButton>
              <IconButton onTouchTap={()=>{this.props.actions.onMoveNextIssue();}}>
                <ArrowDownIcon />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
          {/*<SelectField
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
          </SelectField>*/}

          <div style={{height:(this.props.hostHeight - 24-64-72-72) + "px"}}>
            {this.createIssueTreeElement(this.props.tree)}
          </div>
          </div>
        <div style={{float: "none", width: "auto", marginLeft: "40%",height:`${this.props.hostHeight - 64}px`}}>
          <iframe src={this.getCodePageUri()} // ReSharper ignore TsResolvedFromInaccessibleModule
            width="100%"
            height="70%"
            style={{
              display:"initial",
              position:"relative"
            }}
            allowFullScreen />
          <Paper height="200px" style={{float: "bottom"}} >
            Id:{this.props.selectedIssue.id}<br/>
            Message:{this.props.selectedIssue.message}<br/>
            Project:{this.props.selectedIssue.project}<br/>
            File:{this.props.selectedIssue.file} ({this.props.selectedIssue.line}:{this.props.selectedIssue.column})<br/>
            Url:<a target="_blank" href={this.props.selectedIssueType.wikiUrl}>{this.props.selectedIssueType.wikiUrl}</a><br/>
          </Paper>
        </div>


      </div>
    );
  }
  mode:number = 0;
}

export default muiThemeable()(IssueBrowser);
