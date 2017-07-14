import * as objectAssign from 'object-assign';

export enum IssueGroupByTypes{
  ProjectAndFile = 1,
  IssueType = 2,
  IssueCategory = 3,
}
export interface IIssueBrowserState{
  issuesGroupBy?:IssueGroupByTypes;
  selectedIssueId?:string;
  selectedIssue? : IIssue;
  selectedIssueType?: IIssueType;
  tree?: IGroup;
  originalData?: IOriginalData,
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
export interface IInspectResultsSummary
{
  revisionInfos:IRevisionInfo[]
}
export interface IRevisionInfo{
  id:string;
  caption:string;
  issueCount:number;
}

export interface IIssueType{
  id:string;
  category:string;
  categoryId:string;
  description:string;
  severity:string;
  wikiUrl:string;
}

export interface IIssue{
  id:string;
  typeId:string;
  file:string;
  offset:string;
  line:string;
  message:string;
  project:string;
  column:number;
}

export interface IOriginalData{
  issueTypes:IIssueType[];
  issues:IIssue[];
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
    this.dispatch({type:"onChangedRevision", index:index});
    
    var selectedRevision = this.getState().revisions.revisionInfos[index];

    this.myAjax(`./revisions/${selectedRevision.id}/data.js`, (data:IOriginalData)=>{
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
  originalData:{
    issues:[],
    issueTypes:[]
  },
  currentData:{
    issues:[],
    issueTypes:[]
  },
  diffBaseData:{
    issues:[],
    issueTypes:[]
  },
  tree: createTree([], [], [], IssueGroupByTypes.IssueType, true,true,true,true),
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
  showErrorIssues:boolean,
  showWarningIssues:boolean,
  showSuggestionIssues:boolean,
  showHintIssues:boolean): IGroup
  {

  let targetIssues:IIssue[] = issues.filter(issue=>{
    return !diffBaseIssues.some((value) => value.id === issue.id);
  })
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
  case 'receivedInitialData':
    return objectAssign({}, state, {revisions:action.revisions});
  case 'onChangeIssuesGroupBy':
    var newtree = createTree(
      state.currentData.issues, 
      state.diffBaseData.issues, 
      state.currentData.issueTypes, 
      action.value,
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
      var selectedIssue = state.currentData.issues.filter(issue=>issue.id === id)[0];
      var selectedIssueType = state.currentData.issueTypes.filter(issueType=>issueType.id == selectedIssue.typeId)[0];
      
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

  case 'onChangedRevision':
    var selectedRevision = state.revisions.revisionInfos[action.index];

    return objectAssign({}, state, {selectedRevision:selectedRevision});
  case 'revievedRevisionData':
    var data:IOriginalData = action.data;
    var tree = createTree(
      data.issues, 
      state.diffBaseData.issues,
      data.issueTypes, 
      state.issuesGroupBy,
      state.showErrorIssues,
      state.showWarningIssues,
      state.showSuggestionIssues,
      state.showHintIssues);

    tree.expandedChildren = [tree.subGroups[0].id]
    
    return objectAssign({}, state, {
      selectedIssue:data.issues[0], 
      selectedIssueType:data.issueTypes.filter(_=>_.id === data.issues[0].typeId)[0],
      originalData:data,
      currentData:data,
      tree: tree
    });
  case 'onChangedDiffBaseRevision':
    var selectedRevision = state.revisions.revisionInfos[action.index];

    return objectAssign({}, state, {selectedDiffBaseRevision:selectedRevision});

  case 'revievedDiffBaseRevisionData':
    var diffBaseData:IOriginalData = action.data;
    var tree = createTree(
      state.currentData.issues, 
      diffBaseData.issues,
      state.currentData.issueTypes, 
      state.issuesGroupBy,
      state.showErrorIssues,
      state.showWarningIssues,
      state.showSuggestionIssues,
      state.showHintIssues);

    return objectAssign({}, state, {
      diffBaseData:diffBaseData,
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
      var selectedIssue = state.currentData.issues.filter(issue=>issue.id === id)[0];
      var selectedIssueType = state.currentData.issueTypes.filter(issueType=>issueType.id == selectedIssue.typeId)[0];
      
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
      state.showErrorIssues,
      state.showWarningIssues,
      state.showSuggestionIssues,
      !state.showHintIssues);
    return objectAssign({}, state,{showHintIssues:!state.showHintIssues, tree:tree});
  default:
    return state;
  }
}


