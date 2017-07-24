
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
export interface IRevisionInfo{
  id:string;
  caption:string;
  issueCount:number;
  current?:RevisionIssuesInfo;
  incresedFromPrevious?:RevisionIssuesInfo;
  incresedFromFirst?:RevisionIssuesInfo;
  fixedFromPrevious?:RevisionIssuesInfo;
  fixedFromFirst?:RevisionIssuesInfo;
}

export interface RevisionIssuesInfo{
    errorIssuesCount:number;
    warningIssuesCount:number;
    suggestionIssuesCount:number;
    hintIssuesCount:number;
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