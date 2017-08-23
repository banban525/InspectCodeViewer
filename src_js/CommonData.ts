
export enum IssueGroupByTypes{
  ProjectAndFile = 1,
  IssueType = 2,
  IssueCategory = 3,
}

export enum IssueSeverity{
  Error = 1,
  Warning = 2,
  Suggestion = 3,
  Hint = 4
}


export interface IInspectResultsSummary
{
  revisionInfos:IRevisionInfo[]
}

export namespace IInspectResultsSummary{
  export let Empty:IInspectResultsSummary ={
    revisionInfos:[]
  };
}

export interface IRevisionInfo{
  id:string;
  caption:string;
  issueCount:number;
  link:string;
  current?:RevisionIssuesInfo;
  incresedFromPrevious?:RevisionIssuesInfo;
  incresedFromFirst?:RevisionIssuesInfo;
  fixedFromPrevious?:RevisionIssuesInfo;
  fixedFromFirst?:RevisionIssuesInfo;
}

export namespace IRevisionInfo{
  export let Empty:IRevisionInfo = {
    id:"",
    caption:"",
    issueCount:0,
    link:""
  };
}

export interface RevisionIssuesInfo{
    errorIssuesCount:number;
    warningIssuesCount:number;
    suggestionIssuesCount:number;
    hintIssuesCount:number;
}

export namespace RevisionIssuesInfo{
  export let Empty:RevisionIssuesInfo = {
    errorIssuesCount:0,
    warningIssuesCount:0,
    suggestionIssuesCount:0,
    hintIssuesCount:0
  }
}

export interface IIssueType{
  id:string;
  category:string;
  categoryId:string;
  description:string;
  severity:string;
  wikiUrl:string;
}

export namespace IIssueType{
  export let Empty:IIssueType={
    id:"",
    category:"",
    categoryId:"",
    description:"",
    severity:"",
    wikiUrl:""
  };
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

export namespace IIssue{
  export let Empty:IIssue={
    id:"",
    typeId:"",
    file:"",
    offset:"",
    line:"",
    message:"",
    project:"",
    column:0
  };
}


export interface IOriginalData{
  issueTypes:IIssueType[];
  issues:IIssue[];
  metaInfo:IRevisionInfo
}

export namespace IOriginalData{
  export let Empty:IOriginalData={
    issueTypes:[],
    issues:[],
    metaInfo:IRevisionInfo.Empty
  };
}