import * as objectAssign from 'object-assign';


export interface IAppState{
  hostWidth?:number;
  hostHeight?:number;
  selectedThermaId?:number;
  isDrawerOpened?:boolean;
}

export class AppActionDispatcher
{
  dispatch: (action:any)=>any;
  getState: ()=>IAppState;
  constructor(dispatch:(action:any)=>any, getState: ()=>IAppState)
  {
    this.dispatch = dispatch;
    this.getState = getState;
  }
  onResized():any{
    this.dispatch( {type:"onResized"});
  }
  onChangedThema(value:number):void{
    this.dispatch( {type:"onChangedThema", value:value});
  }
  onChangeDrawerOpened(isOpened:boolean):void{
    this.dispatch({type:'onChangeDrawerOpened', isOpened:isOpened});
  }
  onOpenSummaryPage():void{
    this.dispatch({type:'onOpenSummaryPage'});
  }
  onOpenIssueBrowerPage():void{
    this.dispatch({type:'onOpenIssueBrowerPage'});
  }
}


const initialAppState: IAppState = {
  hostWidth:window.innerWidth, 
  hostHeight:window.innerHeight,
  selectedThermaId:Number(localStorage["InspectCodeViewer.themaId"] || 0),
  isDrawerOpened:false
};


export function appReducer(state: IAppState = initialAppState, action: any) {
  switch (action.type) 
  {
  case 'onResized':
    document.getElementById("app").style.height = window.innerHeight.toString() + "px";
    return objectAssign({}, state, {hostWidth:window.innerWidth, hostHeight:window.innerHeight});
  case 'onChangedThema':
    localStorage["InspectCodeViewer.themaId"] = action.value;
    return objectAssign({}, state,{selectedThermaId:action.value});
  case 'onChangeDrawerOpened':
    return objectAssign({}, state,{isDrawerOpened:action.isOpened});
  case 'onOpenSummaryPage':
    return objectAssign({}, state,{isDrawerOpened:false});
  case 'onOpenIssueBrowerPage':
    return objectAssign({}, state,{isDrawerOpened:false});
  default:
    return state;
  }
}


