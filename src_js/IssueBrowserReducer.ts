import * as objectAssign from 'object-assign';
import {IssueGroupByTypes, IIssue, IIssueType, IOriginalData, IRevisionInfo, IInspectResultsSummary} from "./CommonData"

export interface IIssueBrowserState{
  issuesGroupBy?:IssueGroupByTypes;
  selectedIssueId?:string;
  selectedIssue? : IIssue;
  selectedIssueType?: IIssueType;
  tree?: IGroup;
  currentData?: IOriginalData,
  diffBaseData?: IOriginalData,
  selectedRevision?: IRevisionInfo;
  selectedDiffBaseRevision: IRevisionInfo;
  revisions?:IInspectResultsSummary;
  selectedThermaId?:number;
  diffMode?:number;
  showErrorIssues?:boolean;
  showWarningIssues?:boolean;
  showSuggestionIssues?:boolean;
  showHintIssues?:boolean;
}

export enum DiffMode{
  Normal = 0,
  IncresedFromPrevious = 1,
  IncresedFromFirst = 2,
  FixedFromPrevious = 3,
  FixedFromFirst = 4
}

export enum IssueIconType
{
  none,
  error,
  warning,
  suggestion,
  hint,
}
export interface IGroup{
  id:string;
  name:string;
  subGroups:IGroup[];
  items:IItem[];
  isOpen:boolean;
  badge:string;
  expandedChildren:string[];
  icon:IssueIconType;
}
export interface IItem{
  id:string;
  name:string;
  badge:string;
  icon:IssueIconType;
}



export class IssueBrowserActionDispatcher
{
  dispatch: (action:any)=>any;
  getState: ()=>IIssueBrowserState;
  myAjax: (url:string, callback: (data:any)=>void)=>void;
  constructor(dispatch:(action:any)=>any, getState: ()=>IIssueBrowserState, myAjax: (url:string, callback: (data:any)=>void)=>void)
  {
    this.dispatch = dispatch;
    this.getState = getState;
    this.myAjax = myAjax;
  }
  getInitialData(): void{
    this.myAjax("./revisions/summary.js", (revisions:IInspectResultsSummary)=>{
      this.dispatch( {type:"receivedInitialData", revisions: revisions});
    });
  }
  getInitialData2(currentRevisionId:string, diffMode:DiffMode, currentIssueId:string, hideFilter:string): void{
    if(this.getState().revisions.revisionInfos.length === 0)
    {
      this.myAjax("./revisions/summary.js", (revisions:IInspectResultsSummary)=>{
        this.dispatch( {type:"receivedInitialData", revisions: revisions});

        if(diffMode === DiffMode.FixedFromFirst || diffMode === DiffMode.IncresedFromFirst)
        {
          var getRevisionId = revisions.revisionInfos[0].id;
          this.myAjax(`./revisions/${getRevisionId}/data.js`, (data:IOriginalData)=>{
            this.dispatch( {type:"revievedDiffBaseRevisionData", data:data});
          });
        }
        else if(diffMode === DiffMode.FixedFromPrevious || diffMode === DiffMode.IncresedFromPrevious)
        {
          var index = revisions.revisionInfos.indexOf(
            revisions.revisionInfos.filter(_=>_.id === currentRevisionId)[0]);
          if(index > 0)
          {
            var getRevisionId = revisions.revisionInfos[index-1].id;

            this.myAjax(`./revisions/${getRevisionId}/data.js`, (data:IOriginalData)=>{
              this.dispatch( {type:"revievedDiffBaseRevisionData", data:data});
            });
          }
        }

        this.myAjax(`./revisions/${currentRevisionId}/data.js`, (data:IOriginalData)=>{
          this.dispatch( {type:"revievedRevisionData", data:data});
        });
      });
    }
    else
    {
      if(diffMode === DiffMode.FixedFromFirst || diffMode === DiffMode.IncresedFromFirst)
      {
        var getRevisionId = this.getState().revisions.revisionInfos[0].id;
        this.myAjax(`./revisions/${getRevisionId}/data.js`, (data:IOriginalData)=>{
          this.dispatch( {type:"revievedDiffBaseRevisionData", data:data});
        });
      }
      else if(diffMode === DiffMode.FixedFromPrevious || diffMode === DiffMode.IncresedFromPrevious)
      {
        var index = this.getState().revisions.revisionInfos.indexOf(
          this.getState().revisions.revisionInfos.filter(_=>_.id === currentRevisionId)[0]);
        
        if(index > 0){
          var getRevisionId = this.getState().revisions.revisionInfos[index-1].id;

          this.myAjax(`./revisions/${getRevisionId}/data.js`, (data:IOriginalData)=>{
            this.dispatch( {type:"revievedDiffBaseRevisionData", data:data});
          });
          
        }
      }
      this.myAjax(`./revisions/${currentRevisionId}/data.js`, (data:IOriginalData)=>{
        this.dispatch( {type:"revievedRevisionData", data:data});
      });
    }
    this.dispatch({type:"getInitialData2", 
      currentRevisionId:currentRevisionId, 
      diffMode:diffMode, 
      currentIssueId:currentIssueId, 
      hideFilter:hideFilter});
  }
  onChangeIssuesGroupBy(value:number):void {
    this.dispatch( {type:"onChangeIssuesGroupBy", value:value});
  }
  onSelectedIssueId(value:string):void {
    this.dispatch( {type:"onSelectedIssueId", value:value});
  }
  onSelectedIssue(id:string):void{
    this.dispatch({type:"onSelectedIssue", id:id});
  }
  onTouchTapListGroup(selectedGroup:IGroup):void{
    this.dispatch( {type:"onTouchTapListGroup", selectedGroup:selectedGroup});
  }
  onChangedRevision(index:number):void{
    this.onChangedRevisionId(this.getState().revisions.revisionInfos[index].id);
  }
  onChangedRevisionId(revisionId:string):void{
    this.dispatch({type:"onChangedRevisionId", revisionId:revisionId});
    
    this.myAjax(`./revisions/${revisionId}/data.js`, (data:IOriginalData)=>{
      this.dispatch( {type:"revievedRevisionData", data:data});
    }); 
  }

  onChangedDiffBaseRevision(index:number):void{
    this.dispatch({type:"onChangedDiffBaseRevision", index:index});

    var selectedRevision = this.getState().revisions.revisionInfos[index];

    this.myAjax(`./revisions/${selectedRevision.id}/data.js`, (data:IOriginalData)=>{
      this.dispatch( {type:"revievedDiffBaseRevisionData", data:data});
    });
  }
  onChangedTherma(value:number):void{
    this.dispatch( {type:"onChangedTherma", value:value});
  }
  nSelectedIssue(row:IItem):void{
    this.dispatch( {type:"onSelectedIssue", row:row});
  }
  onSelectedIssueGroup(parent:IGroup, row:any):void{
    this.dispatch( {type:"onSelectedIssueGroup", parent:parent, row:row});
  }
  onChangeDiffMode(value:number):void{
    this.dispatch({type:"onChangeDiffMode", value:value});
  }
  onToggleShowErrorIssues():void{
    this.dispatch({type:'onToggleShowErrorIssues'});
  }
  onToggleShowWarningIssues():void{
    this.dispatch({type:'onToggleShowWarningIssues'});
  }
  onToggleShowSuggestionIssues():void{
    this.dispatch({type:'onToggleShowSuggestionIssues'});
  }
  onToggleShowHintIssues():void{
    this.dispatch({type:'onToggleShowHintIssues'});
  }
  setIssuesFilter(error:boolean, warning:boolean, suggestion:boolean, hint:boolean){
    this.dispatch({type:'setIssuesFilter', error:error, warning:warning, suggestion:suggestion, hint:hint});
  }
}





const initialIssueBrowserState: IIssueBrowserState = {
  issuesGroupBy:IssueGroupByTypes.IssueType, 
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
  selectedIssueType:{
    id:"",
    category:"",
    categoryId:"",
    description:"",
    severity:"",
    wikiUrl:""
  },
  currentData:{
    issues:[],
    issueTypes:[],
    metaInfo:{
      id:"",
      caption:"",
      issueCount:0
    }
  },
  diffBaseData:{
    issues:[],
    issueTypes:[],
    metaInfo:{
      id:"",
      caption:"",
      issueCount:0
    }
  },
  tree: createTree([], [], [], IssueGroupByTypes.IssueType, DiffMode.Normal, true,true,true,true),
  revisions:{
    revisionInfos:[]
  },
  selectedRevision:{
    id:"",
    issueCount:0,
    caption:""
  },
  selectedDiffBaseRevision:{
    id:"",
    issueCount:0,
    caption:""
  },
  diffMode:0,
  showErrorIssues:true,
  showWarningIssues:true,
  showSuggestionIssues:true,
  showHintIssues:true
};


function toIconType(severity:string):IssueIconType
{
  if(severity === "ERROR")
  {
    return IssueIconType.error;
  }
  if(severity === "WARNING")
  {
    return IssueIconType.warning;
  }
  if(severity === "SUGGESTION")
  {
    return IssueIconType.suggestion;
  }
  if(severity === "HINT")
  {
    return IssueIconType.hint;
  }
  return IssueIconType.none;
}

function createTree(
  issues:IIssue[], 
  diffBaseIssues:IIssue[], 
  issueTypes:IIssueType[], 
  issueGroupBy:IssueGroupByTypes,
  diffMode:DiffMode,
  showErrorIssues:boolean,
  showWarningIssues:boolean,
  showSuggestionIssues:boolean,
  showHintIssues:boolean): IGroup
{

  let targetIssues:IIssue[] = issues;
  if(diffMode === DiffMode.FixedFromFirst || diffMode === DiffMode.FixedFromPrevious)
  {
    targetIssues = diffBaseIssues.filter(issue=>{
      return !issues.some((value) => value.id === issue.id);
    });
  }
  else if(diffMode === DiffMode.IncresedFromFirst || diffMode === DiffMode.IncresedFromPrevious)
  {
    targetIssues = issues.filter(issue=>{
      return !diffBaseIssues.some((value) => value.id === issue.id);
    });
  }

  let filteredIssueTypes = issueTypes;

  
  if(showErrorIssues === false)
  {
    filteredIssueTypes = filteredIssueTypes.filter(issueType=>issueType.severity !== "ERROR");
  }
  if(showWarningIssues === false)
  {
    filteredIssueTypes = filteredIssueTypes.filter(issueType=>issueType.severity !== "WARNING");
  }
  if(showSuggestionIssues === false)
  {
    filteredIssueTypes = filteredIssueTypes.filter(issueType=>issueType.severity !== "SUGGESTION");
  }
  if(showHintIssues === false)
  {
    filteredIssueTypes = filteredIssueTypes.filter(issueType=>issueType.severity !== "HINT");
  }
  targetIssues = targetIssues.filter(issue=>filteredIssueTypes.some(issueType=>issueType.id === issue.typeId));

  if(issueGroupBy === IssueGroupByTypes.IssueType)
  {
    var dic : {[key:string]:IIssue[]} = {};
    targetIssues.map(issue=>{
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

    var result :IGroup[] = [];
    for(var issuesGroup of sortedList){
      var issueTypeId = issuesGroup[0].typeId;
      var issueType = issueTypes.filter(issueType=>issueType.id === issueTypeId)[0];
      var group:IGroup = {
        id: issueTypeId,
        isOpen: false,
        name: issueType.description,
        items: issuesGroup.map(issue=>{return {
          id: "ISSUE_" + issue.id,
          name: `${issue.file}:${issue.line}`,
          badge: "",
          icon: toIconType(issueType.severity)
        }; }),
        subGroups:[],
        badge: issuesGroup.length.toString(),
        expandedChildren:[],
        icon: toIconType(issueType.severity)
      };
      result = result.concat([group]);
    }
    return {
      id: "",
      name: "",
      isOpen: true,
      subGroups: result,
      items:[],
      badge:"",
      expandedChildren:[],
      icon:IssueIconType.none
    };
  }
  else if(issueGroupBy === IssueGroupByTypes.ProjectAndFile)
  {
    //Group by Project
    var dic : {[key:string]:IIssue[]} = {};
    targetIssues.map(issue=>{
      if(!(issue.project in dic))
      {
        dic[issue.project] = [];
      }
      dic[issue.project] = dic[issue.project].concat([issue]);
    });
    //Group by file
    var dic2 : {[key:string]:{[key:string]:IIssue[]}} = {}
    Object.keys(dic).map(project=>{
      var dicTemp : {[key:string]:IIssue[]} = {}
      dic[project].map(issue=>{
        if(!(issue.file in dicTemp))
        {
          dicTemp[issue.file] = [];
        }
        dicTemp[issue.file] = dicTemp[issue.file].concat([issue]);
      })
      dic2[project] = dicTemp;
    })
    console.log(dic2);

    var list = Object.keys(dic2).map(project=>{
      var issuesGroupbyFile:{[key:string]:IIssue[]} = dic2[project];
      var issueSum:number = 0;
      return {
        id: project,
        isOpen: false,
        name: project,
        items: [],
        subGroups: Object.keys(issuesGroupbyFile).map(file=>{
          issueSum += issuesGroupbyFile[file].length;
          return {
            id: file,
            isOpen: false,
            name: file,
            items: issuesGroupbyFile[file].map(issue=>{
              var issueType = issueTypes.filter(issueType=>issueType.id === issue.typeId)[0];
              return {
                id: "ISSUE_" + issue.id,
                name: `${issue.message}`,
                badge: "",
                icon:toIconType(issueType.severity)
              }
            }),
            subGroups:[],
            badge: issuesGroupbyFile[file].length.toString(),
            expandedChildren:[],
            icon:IssueIconType.none
          };
        }),
        badge: issueSum.toString(),
        expandedChildren:[],
        icon:IssueIconType.none
      };
    });
    return {
      id: "",
      name: "",
      isOpen: true,
      subGroups: list,
      items:[],
      badge:"",
      expandedChildren:[],
      icon:IssueIconType.none
    };
  }
}

function searchGroup(tree:IGroup, id:string):IGroup
{
  if(tree.id === id){
    return tree;
  }
  var results = tree.subGroups
    .map(group => searchGroup(group, id))
    .filter(group => group !== null);
  if(results.length != 0)
  {
    return results[0]
  }
  return null;
}

function updateGroups(tree:IGroup, updateTarget:IGroup):IGroup
{
  if(tree.id === updateTarget.id){
    return updateTarget;
  }
  var isUpdated:boolean = false;
  var newSubGroups = tree.subGroups.map(group=>{
    var newGroup = updateGroups(group, updateTarget);
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
      badge: tree.badge,
      expandedChildren:tree.expandedChildren,
      icon:tree.icon
    }
  }
  else{
    return null;
  }
}

export function IssueBrowserReducer(state: IIssueBrowserState = initialIssueBrowserState, action: any) {

  switch (action.type) 
  {
  case 'getInitialData2':

    return objectAssign({}, state, {
      diffMode:action.diffMode, 
      selectedIssueId:action.currentIssueId, 
      showErrorIssues:action.hideFilter.indexOf("error") < 0,
      showWarningIssues:action.hideFilter.indexOf("warning") < 0,
      showSuggestionIssues:action.hideFilter.indexOf("suggestion") < 0,
      showHintIssues:action.hideFilter.indexOf("hint") < 0,
    });
  case 'receivedInitialData':
    return objectAssign({}, state, {revisions:action.revisions});
  case 'onChangeIssuesGroupBy':
    var newtree = createTree(
      state.currentData.issues, 
      state.diffBaseData.issues, 
      state.currentData.issueTypes, 
      action.value,
      state.diffMode,
      state.showErrorIssues,
      state.showWarningIssues,
      state.showSuggestionIssues,
      state.showHintIssues
      );
    return objectAssign({}, state, {issuesGroupBy:action.value, tree:newtree});
  case 'onSelectedIssueId':
    if(action.value.match(/^ISSUE_/) !== null)
    {
      // クリックされたのがissueなら選択する
      var id = action.value.replace("ISSUE_", "");

      var currentIssues = state.currentData.issues;
      var currentIssueTypes = state.currentData.issueTypes;
      if(state.diffMode === DiffMode.FixedFromFirst || state.diffMode === DiffMode.FixedFromPrevious)
      {
        currentIssues = state.diffBaseData.issues;
        currentIssueTypes = state.diffBaseData.issueTypes;
      }

      var selectedIssue = currentIssues.filter(issue=>issue.id === id)[0];
      var selectedIssueType = currentIssueTypes.filter(issueType=>issueType.id == selectedIssue.typeId)[0];
      
      return objectAssign({}, state, {selectedIssueId:action.value, selectedIssue: selectedIssue, selectedIssueType:selectedIssueType});
    }
    else
    {
      return state;
    }

  case 'onTouchTapListGroup':
    var newSelectedGroup = objectAssign({}, action.selectedGroup, {isOpen:!action.selectedGroup.isOpen});
    var newTree = updateGroups(state.tree, newSelectedGroup);
    return objectAssign({}, state, {tree: newTree});

  case 'onChangedRevisionId':
    var selectedRevision = state.revisions.revisionInfos.filter(rev=>rev.id === action.revisionId)[0];
    if(selectedRevision === undefined)
    {
      return state;
    }
    return objectAssign({}, state, {selectedRevision:selectedRevision});
    
  case 'revievedRevisionData':
    var data:IOriginalData = action.data;
    var tree = createTree(
      data.issues, 
      state.diffBaseData.issues,
      data.issueTypes, 
      state.issuesGroupBy,
      state.diffMode,
      state.showErrorIssues,
      state.showWarningIssues,
      state.showSuggestionIssues,
      state.showHintIssues);
    
    //state.selectedRevision.id !== data.

    return objectAssign({}, state, {
      selectedIssue:data.issues[0], 
      selectedIssueType:data.issueTypes.filter(_=>_.id === data.issues[0].typeId)[0],
      currentData:data,
      selectedRevision:data.metaInfo,
      tree: tree
    });
  case 'onChangedDiffBaseRevision':
    var selectedRevision = state.revisions.revisionInfos[action.index];

    return objectAssign({}, state, {
      selectedDiffBaseRevision:selectedRevision, 
      selectedDiffBaseRevisionId:selectedRevision
    });

  case 'revievedDiffBaseRevisionData':
    var diffBaseData:IOriginalData = action.data;
    var tree = createTree(
      state.currentData.issues, 
      diffBaseData.issues,
      state.currentData.issueTypes, 
      state.issuesGroupBy,
      state.diffMode,
      state.showErrorIssues,
      state.showWarningIssues,
      state.showSuggestionIssues,
      state.showHintIssues);

    return objectAssign({}, state, {
      diffBaseData:diffBaseData,
      selectedDiffBaseRevision:diffBaseData.metaInfo,
      tree: tree
    });
  case 'onChangedTherma':
    localStorage["InspectCodeViewer.themaId"] = action.value;
    return objectAssign({}, state,{selectedThermaId:action.value});

  case 'onSelectedIssue':
    var id = action.id.toString();

    if(id.match(/^ISSUE_/) !== null)
    {
      // クリックされたのがissueなら選択する
      id = id.replace("ISSUE_", "");

      var currentIssues = state.currentData.issues;
      var currentIssueTypes = state.currentData.issueTypes;
      if(state.diffMode === DiffMode.FixedFromFirst || state.diffMode === DiffMode.FixedFromPrevious)
      {
        currentIssues = state.diffBaseData.issues;
        currentIssueTypes = state.diffBaseData.issueTypes;
      }

      var selectedIssue = currentIssues.filter(issue=>issue.id === id)[0];
      var selectedIssueType = currentIssueTypes.filter(issueType=>issueType.id == selectedIssue.typeId)[0];
      
      return objectAssign({}, state, {selectedIssueId:action.id, selectedIssue: selectedIssue, selectedIssueType:selectedIssueType});
    }
    else
    {
      return state;
    }

  case 'onSelectedIssueGroup':
    var selectedGroup:IGroup = action.row;
    var newExpandedChildren:string[] = [selectedGroup.id];

    if(action.parent.expandedChildren[0] === selectedGroup.id)
    {
      return state;
    }

    var newParent = objectAssign({}, action.parent,{expandedChildren:newExpandedChildren});
    var newTree = updateGroups(state.tree, newParent);
    return objectAssign({}, state, {tree:newTree});
  case 'onChangeDiffMode':
    return objectAssign({}, state,{diffMode:action.value});
  case 'onToggleShowErrorIssues':
    var tree = createTree(
      state.currentData.issues, 
      state.diffBaseData.issues,
      state.currentData.issueTypes, 
      state.issuesGroupBy,
      state.diffMode,
      !state.showErrorIssues,
      state.showWarningIssues,
      state.showSuggestionIssues,
      state.showHintIssues);
    return objectAssign({}, state,{showErrorIssues:!state.showErrorIssues, tree:tree});
  case 'onToggleShowWarningIssues':
    var tree = createTree(
      state.currentData.issues, 
      state.diffBaseData.issues,
      state.currentData.issueTypes, 
      state.issuesGroupBy,
      state.diffMode,
      state.showErrorIssues,
      !state.showWarningIssues,
      state.showSuggestionIssues,
      state.showHintIssues);
    return objectAssign({}, state,{showWarningIssues:!state.showWarningIssues, tree:tree});
  case 'onToggleShowSuggestionIssues':
    var tree = createTree(
      state.currentData.issues, 
      state.diffBaseData.issues,
      state.currentData.issueTypes, 
      state.issuesGroupBy,
      state.diffMode,
      state.showErrorIssues,
      state.showWarningIssues,
      !state.showSuggestionIssues,
      state.showHintIssues);
    return objectAssign({}, state,{showSuggestionIssues:!state.showSuggestionIssues, tree:tree});
  case 'onToggleShowHintIssues':
    var tree = createTree(
      state.currentData.issues, 
      state.diffBaseData.issues,
      state.currentData.issueTypes, 
      state.issuesGroupBy,
      state.diffMode,
      state.showErrorIssues,
      state.showWarningIssues,
      state.showSuggestionIssues,
      !state.showHintIssues);
    return objectAssign({}, state,{showHintIssues:!state.showHintIssues, tree:tree});
  case 'setIssuesFilter':
    var tree = createTree(
      state.currentData.issues, 
      state.diffBaseData.issues,
      state.currentData.issueTypes, 
      state.issuesGroupBy,
      state.diffMode,
      action.error,
      action.warning,
      action.suggestion,
      action.hint);
    return objectAssign({}, state, {
      showErrorIssues:action.error,
      showWarningIssues:action.warning,
      showSuggestionIssues:action.suggestion,
      showHintIssues:action.hint,
      tree:tree
    });

  default:
    return state;
  }
}


