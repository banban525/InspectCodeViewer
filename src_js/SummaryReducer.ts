
export interface ISummaryState{
  temp?:boolean;
}

export class SummaryActionDispatcher
{
  dispatch: (action:any)=>any;
  getState: ()=>ISummaryState;
  constructor(dispatch:(action:any)=>any, getState: ()=>ISummaryState)
  {
    this.dispatch = dispatch;
    this.getState = getState;
  }
}


const initialSummaryState: ISummaryState = {
  temp:false
};


export function SummaryReducer(state: ISummaryState = initialSummaryState, action: any) {
  switch(action.type)
  {
  default:
    return state;
  }
}
