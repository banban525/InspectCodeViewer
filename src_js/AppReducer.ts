import {Store} from 'redux';
import App from './App';
import * as objectAssign from 'object-assign';


export interface IAppState{
  hostWidth?:number;
  hostHeight?:number;
  selectedThermaId?:number;
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
}


const initialAppState: IAppState = {
  hostWidth:window.innerWidth, 
  hostHeight:window.innerHeight,
  selectedThermaId:Number(localStorage["InspectCodeViewer.themaId"] || 0)
};


export function AppReducer(state: IAppState = initialAppState, action: any) {
  switch (action.type) 
  {
  case 'onResized':
    document.getElementById("app").style.height = window.innerHeight.toString() + "px";
    return objectAssign({}, state, {hostWidth:window.innerWidth, hostHeight:window.innerHeight});
  case 'onChangedThema':
    localStorage["InspectCodeViewer.themaId"] = action.value;
    return objectAssign({}, state,{selectedThermaId:action.value});
  default:
    return state;
  }
}


