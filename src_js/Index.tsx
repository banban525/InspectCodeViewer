import * as React from 'react';
import *  as ReactDOM from "react-dom";
import { createStore, combineReducers,compose,applyMiddleware  } from "redux";
import { Provider,connect } from "react-redux";

import App from "./App";
import {AppReducer, AppActionDispatcher,IAppState} from "./AppReducer"


const rootReducer = combineReducers({ AppReducer });
const store = createStore(rootReducer);

store.subscribe(() => console.log(store.getState()));



function mapStateToProps(state : any) {
  return state.AppReducer;
}

declare var __data: any;
function myAjax(url:string, onRecieved:(data:any)=>void):void {
    var s = document.createElement("script");
    s.src = url;
    s.onload = () => {
      onRecieved(__data);
    }

    var ele = document.getElementById("script");
    ele.appendChild(s);
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions:new AppActionDispatcher(dispatch, ()=>(store.getState() as any).AppReducer as IAppState, myAjax)
  }
}



var AppComponent = connect(
  mapStateToProps,
  mapDispatchToProps)(App);


ReactDOM.render(
    <Provider store={store}>
    <AppComponent />
    </Provider>
    ,document.getElementById("app")
);
