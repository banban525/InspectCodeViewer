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

injectTapEventPlugin();

enum IssueGroupByTypes{
  ProjectAndFile = 1,
  IssueType = 2,
  IssueCategory = 3,
}
interface IAppState{
  issuesGroupBy?:IssueGroupByTypes;
  selectedIssueId?:string;
  selectedIssue? : IIssue;
  tree?: IGroup;
  originalData?: IOriginalData,
  hostWidth?:number;
  hostHeight?:number;
  selectedRevision?: IRevisionInfo;
  revisions?:IInspectResultsSummary;
  selectedThermaId?:number;
}
interface IInspectResultsSummary
{
  revisionInfos:IRevisionInfo[]
}
interface IRevisionInfo{
  id:string;
  caption:string;
  issueCount:number;
}

interface IIssueType{
  id:string;
  category:string;
  categoryId:string;
  description:string;
  severity:string;
  wikiUrl:string;
}

interface IIssue{
  id:string;
  typeId:string;
  file:string;
  offset:string;
  line:string;
  message:string;
  project:string;
  column:number;
}

interface IOriginalData{
  issueTypes:IIssueType[];
  issues:IIssue[];
}

interface IGroup{
  id:string;
  name:string;
  subGroups:IGroup[];
  items:IItem[];
  isOpen:boolean;
  badge:string;
}
interface IItem{
  id:string;
  name:string;
  badge:string;
}

declare var __data: any;

class App extends Component<any, IAppState> {
  resizeTimer: any= null;
  interval = Math.floor(1000 / 60 * 10);

  constructor(props: any) {
    super(props);
    this.onChangeIssuesGroupBy = this.onChangeIssuesGroupBy.bind(this);
    this.onSelectedIssueId = this.onSelectedIssueId.bind(this);
    this.onTouchTapListGroup = this.onTouchTapListGroup.bind(this);
    this.onResized = this.onResized.bind(this);
    this.onTouchTapListGroup = this.onTouchTapListGroup.bind(this);
    this.onChangedRevision = this.onChangedRevision.bind(this);
    this.onChangedTherma = this.onChangedTherma.bind(this);
    this.getInitialData = this.getInitialData.bind(this);

    // var revisions:IRevisionInfo[] = [
    //     {
    //       id:"5c8ba098fdb04703952f118ee0463894",
    //       caption:"2017-06-20(0123456789012345)",
    //       issueCount: 123
    //     },
    //     {
    //       id:"64cfcd49fe6145d7b96df72c3438a291",
    //       caption:"2017-06-20(543210987654321)",
    //       issueCount: 123
    //     }
    //   ];
    
    this.state = {
      issuesGroupBy:1, 
      selectedIssue:{
        id:"",
        file:"",
        line:"0",
        message:"",
        offset:"0",
        project:"",
        typeId:"",
        column:0
      }, 
      originalData:{
        issues:[],
        issueTypes:[]
      },
      tree: this.createTree([], [], IssueGroupByTypes.IssueType),
      hostWidth:window.innerWidth, 
      hostHeight:window.innerHeight,
      revisions:{
        revisionInfos:[]
      },
      selectedRevision:{
        id:"",
        issueCount:0,
        caption:""
      },
      selectedThermaId:Number(localStorage["InspectCodeViewer.thermaId"] || 0)
    };

    window.addEventListener("resize", (): void => {
      if (this.resizeTimer !== null) {
        clearTimeout(this.resizeTimer as NodeJS.Timer);
      }
      this.resizeTimer = setTimeout(() => {
        this.onResized();
      }, this.interval);
    });

    this.getInitialData();
  }

  getInitialData():void{
    this.getAjaxData("./revisions/summary.js", summaryData=>{
      var revisions:IInspectResultsSummary = summaryData;
      this.setState({revisions:revisions});
    });
  }

  onResized():void{
    document.getElementById("app").style.height = window.innerHeight.toString() + "px";
    this.setState({hostWidth:window.innerWidth, hostHeight:window.innerHeight});
  }

  createTree(issues:IIssue[], issueTypes:IIssueType[], issueGroupBy:IssueGroupByTypes): IGroup{
     var dic : {[key:string]:IIssue[]} = {};
      issues.map(issue=>{
        if(!(issue.typeId in dic))
        {
          dic[issue.typeId] = [];
        }
        dic[issue.typeId] = dic[issue.typeId].concat([issue]);
      });

      var sortedList = Object.keys(dic).map(_=>dic[_]).sort((a,b)=>{
        if(a.length>b.length){return -1;}
        if(a.length<b.length){return 1;}
        return 0;
      })
      console.log(sortedList);

      var result :IGroup[] = [];
      for(var issuesGroup of sortedList){
        var issueTypeId = issuesGroup[0].typeId;
        var group:IGroup = {
          id: issueTypeId,
          isOpen: false,
          name: issueTypes.filter(issueType=>issueType.id === issueTypeId)[0].description,
          items: issuesGroup.map(issue=>{return {
            id: "ISSUE_" + issue.id,
            name: `${issue.file}:${issue.line}`,
            badge: ""
          }; }),
          subGroups:[],
          badge: issuesGroup.length.toString()
        };
        result = result.concat([group]);
      }
      return {
        id: "",
        name: "",
        isOpen: true,
        subGroups: result,
        items:[],
        badge:""
      };
  }

  onChangeIssuesGroupBy(event:any, index:number, value:number):void {
      this.setState({issuesGroupBy:value});
  }

  onSelectedIssueId(value:string):void {
    if(value.match(/^ISSUE_/) !== null)
    {

      // クリックされたのがissueなら選択する
      var id = value.replace("ISSUE_", "");
      var selectedIssue = this.state.originalData.issues.filter(issue=>issue.id === id)[0];
 
      this.setState({selectedIssueId:value, selectedIssue: selectedIssue});
    }
    else
    {

    }
  }

  updateGroups(tree:IGroup, updateTarget:IGroup):IGroup
  {
    if(tree.id === updateTarget.id){
      return updateTarget;
    }
    var isUpdated:boolean = false;
    var newSubGroups = tree.subGroups.map(group=>{
      var newGroup = this.updateGroups(group, updateTarget);
      if(newGroup !== null){
        isUpdated = true;
        return newGroup;
      }
      else
      {
        return group;
      }
    });
    if(isUpdated)
    {
      return {
        id: tree.id,
        isOpen: tree.isOpen,
        items: tree.items,
        name: tree.name,
        subGroups:newSubGroups,
        badge: tree.badge
      }
    }
    else{
      return null;
    }
  }

  searchGroup(tree:IGroup, id:string):IGroup
  {
    if(tree.id === id){
      return tree;
    }
    var results = tree.subGroups
      .map(group => this.searchGroup(group, id))
      .filter(group => group !== null);
    if(results.length != 0)
    {
      return results[0]
    }
    return null;
  }

  onTouchTapListGroup(selectedGroup:IGroup): void{
    
    //クリックされたのがGroupならopen状態を反転する
    selectedGroup = objectAssign({}, selectedGroup, {isOpen:!selectedGroup.isOpen});
    var newTree = this.updateGroups(this.state.tree, selectedGroup);

    this.setState({tree: newTree});
  }

  createIssueTreeListItem(tree: IGroup): JSX.Element[]
  {
    return tree.subGroups.map(group=>(
      <ListItem
        value={group.id}
        open={group.isOpen}
        primaryText={group.name}
        key={group.id}
        rightAvatar={<Badge badgeContent={group.items.length} primary={true}/>}
        nestedItems={this.createIssueTreeListItem(group)}
        onNestedListToggle={()=>this.onTouchTapListGroup(group)}
        onTouchTap={()=>this.onTouchTapListGroup(group)} />
    )).concat(tree.items.map(issue=>(
      <ListItem
        value={issue.id}
        initiallyOpen={false}
        primaryText={issue.name}
        key={issue.id}
        nestedItems={[]}
       />)));
  }
  onChangedRevision(event:any, index:number, value:string):void{
    var selectedRevision = this.state.revisions.revisionInfos[index];

    this.getAjaxData(`./revisions/${selectedRevision.id}/data.js`, originalData=>{
      var data:IOriginalData = originalData;
      this.setState({
        selectedIssue:data.issues[0], 
        originalData:data,
        tree: this.createTree(data.issues, data.issueTypes, IssueGroupByTypes.IssueType)
      });
    });

    this.setState({selectedRevision:selectedRevision});
  }

  getAjaxData(url:string, callback:(data:any)=>void):void
  {
    var s = document.createElement("script");
    s.src = url;
    s.onload = () => {
      callback(__data);
    }

    var ele = document.getElementById("script");
    ele.appendChild(s);

  }

  getCodePageUri():string
  {
    if(this.state.selectedRevision.id !== "" && this.state.selectedIssue.file !== "")
    {
       var result = `./revisions/${this.state.selectedRevision.id}/codes/`;
       result += `${this.state.selectedIssue.file.replace(/\\/g, "_")}.html`;
       result += `?line=${this.state.selectedIssue.line}`;
       if(this.state.selectedThermaId === 1)
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
  onChangedTherma(event:any, index:number, value:number):void{
    localStorage["InspectCodeViewer.thermaId"] = value;
    this.setState({selectedThermaId:value});
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.selectedThermaId===0?lightBaseTheme:darkBaseTheme)}>
        <div>
        <AppBar title="Inspect code viewer" style={{height:"64px"}} iconElementRight={
          <SelectField
            value={this.state.selectedThermaId}
            onChange={this.onChangedTherma}
            >
            <MenuItem value={0} primaryText="Light" />
            <MenuItem value={1} primaryText="Dark" />
            </SelectField>
        } />
          <Paper style={{height: (this.state.hostHeight - 24-64) + "px", overflow:"hidden"}}>
          <div style={{float: "left", width: "30%", height: "100%", overflowY: "scroll"}}>
            <SelectField
            floatingLabelText="Revisions"
            value={this.state.selectedRevision.id}
            onChange={this.onChangedRevision}
            fullWidth
            >
            {this.state.revisions.revisionInfos.map(revision=>{
              return (<MenuItem 
                value={revision.id} 
                primaryText={revision.caption} 
                rightAvatar={<Badge badgeContent={revision.issueCount} primary={true}/>} />)
            })}
            </SelectField>

          <SelectableList 
            defaultValue={this.state.selectedIssueId} 
            onIndexChanged={this.onSelectedIssueId}>
            <Subheader>
              <SelectField
              floatingLabelText="Issues Group By"
              value={this.state.issuesGroupBy}
              onChange={this.onChangeIssuesGroupBy}
              >
                <MenuItem value={1} primaryText="Directory and File" />
                <MenuItem value={2} primaryText="Issue Type" />
                <MenuItem value={3} primaryText="Issue Category" />
              </SelectField>
            </Subheader>
            {this.createIssueTreeListItem(this.state.tree)}
          </SelectableList>
        </div>
        <div style={{float: "none", width: "auto", marginLeft: "30%",height:`${this.state.hostHeight - 64}px`}}>
          <Iframe url={this.getCodePageUri()}
            width="100%"
            height="70%"
            display="initial"
            position="relative"
            allowFullScreen />
          <Paper height="200px" style={{float: "bottom"}} >
            Id:{this.state.selectedIssue.id}<br/>
            Message:{this.state.selectedIssue.message}<br/>
            Project:{this.state.selectedIssue.project}<br/>
            File:{this.state.selectedIssue.file}<br/>
            Line:{this.state.selectedIssue.line}<br/>
            Column:{this.state.selectedIssue.column}<br/>
          </Paper>
        </div>
        </Paper>
      </div>
    </MuiThemeProvider>
    );
  }
}

export default App;
