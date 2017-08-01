
import {IInspectResultsSummary} from "./CommonData";
import * as objectAssign from 'object-assign';

export interface ISummaryState{
  originalData:IInspectResultsSummary;
  selectedRevisionId?:string;
}

export class SummaryActionDispatcher
{
  dispatch: (action:any)=>any;
  getState: ()=>ISummaryState;
  myAjax: (url:string, callback: (data:any)=>void)=>void;

  constructor(dispatch:(action:any)=>any, getState: ()=>ISummaryState, myAjax: (url:string, callback: (data:any)=>void)=>void)
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
  onChangeSelectedRevisionId(id:string):void{
    this.dispatch({type:'onChangeSelectedRevisionId', id:id});
  }
}


const initialSummaryState: ISummaryState = {
  originalData:{
    revisionInfos:[]
  }
};


export function SummaryReducer(state: ISummaryState = initialSummaryState, action: any) {
  switch(action.type)
  {
  case 'receivedInitialData':
    return objectAssign({}, state, {originalData:action.revisions});
  case 'onChangeSelectedRevisionId':
    return objectAssign({}, state, {selectedRevisionId:action.id});
  default:
    return state;
  }
}
