import * as React from 'react';
import *  as ReactDOM from "react-dom";
import { createStore, combineReducers,compose,applyMiddleware  } from "redux";
import { Provider,connect } from "react-redux";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import {
  HashRouter as Router,
  Route,
  Link,
  withRouter,
  Switch,
  Redirect
} from 'react-router-dom'
import * as objectAssign from 'object-assign';

import App from "./App";
import {IAppProps} from "./App";
import {appReducer as AppReducer, AppActionDispatcher,IAppState} from "./AppReducer"
import IssueBrowser from './IssueBrowser';
import {IssueBrowserReducer, IssueBrowserActionDispatcher, IIssueBrowserState} from "./IssueBrowserReducer";
import {IIssueBrowserProps} from './IssueBrowser';
import {RouteComponentProps} from 'react-router-dom';
import * as H from 'history';
import Summary from './Summary';
import {ISummaryProps} from './Summary';
import {SummaryReducer,SummaryActionDispatcher,ISummaryState} from './SummaryReducer';

const rootReducer = combineReducers({ AppReducer,IssueBrowserReducer,SummaryReducer });
const store = createStore(rootReducer);

store.subscribe(() => console.log(store.getState()));




declare var __data: any;
var isScriptBlockWorking = false;
var ajaxQueue:any[] = [];
function myAjax(url:string, onRecieved:(data:any)=>void):void {
  if(isScriptBlockWorking)
  {
    ajaxQueue.push({
      url:url,
      onRecieved:onRecieved
    });
    return;
  }
  isScriptBlockWorking = true;
  var s:any = document.createElement("script");
  s.src = url;
  s.onload = () => {
    onRecieved(__data);
    isScriptBlockWorking = false;
    if(ajaxQueue.length !== 0){
      var command = ajaxQueue.pop();
      myAjax(command.url, command.onRecieved);
    }
  }

  var ele = document.getElementById("script");
  ele.appendChild(s);
}

function mapAppStateToProps(state : any, ownProps:RouteComponentProps<any>):IAppProps {
  var result = objectAssign({}, state.AppReducer, {history:ownProps.history}) as IAppProps;
  return result;
}

function mapAppDispatchToProps(dispatch: any):any {
  return {
    actions:new AppActionDispatcher(dispatch, ()=>(store.getState() as any).AppReducer as IAppState)
  }
}

function mapIssueBrowserStateToProps(state : any, ownProps:RouteComponentProps<any>):IIssueBrowserProps {
  return objectAssign(
    {},
    state.IssueBrowserReducer, 
    {
      hostWidth:state.AppReducer.hostWidth, 
      hostHeight:state.AppReducer.hostHeight,
      selectedThermaId:state.AppReducer.selectedThermaId
    },
    ownProps);
}

function mapIssueBrowserDispatchToProps(dispatch: any):any {
  return {
    actions:new IssueBrowserActionDispatcher(dispatch, ()=>(store.getState() as any).IssueBrowserReducer as IIssueBrowserState, myAjax)
  }
}

function mapSummaryStateToProps(state : any, ownProps:RouteComponentProps<any>):ISummaryProps {
  return objectAssign(
    {},
    state.SummaryReducer,
    {
      hostWidth:state.AppReducer.hostWidth, 
      hostHeight:state.AppReducer.hostHeight
    },
    ownProps);
}

function mapSummaryDispatchToProps(dispatch: any):any {
  return {
    actions:new SummaryActionDispatcher(dispatch, ()=>(store.getState() as any).SummaryReducer as ISummaryState, myAjax)
  }
}




var SummaryTemp = connect(
  mapSummaryStateToProps,
  mapSummaryDispatchToProps)(Summary);
var SummaryContainer = withRouter(SummaryTemp);


var AppContainer = connect(
  mapAppStateToProps,
  mapAppDispatchToProps)(App)
var AppComponent = withRouter(AppContainer) as React.ComponentClass<any>;

var IssueBrowserContainer = withRouter(connect(
  mapIssueBrowserStateToProps,
  mapIssueBrowserDispatchToProps)(IssueBrowser));



injectTapEventPlugin();

ReactDOM.render(
    <Provider store={store}>
      <Router>
        <AppComponent>
          <Switch>
            <Route exact path="/" component={SummaryContainer}/>
            <Route exact path="/issues/:revid/:issueid/" component={IssueBrowserContainer}/>
            <Route exact path="/issues/:revid/" component={IssueBrowserContainer}/>
            <Route exact path="/issues" component={IssueBrowserContainer}/>
          </Switch>
        </AppComponent>
      </Router>
    </Provider>
    ,document.getElementById("app")
);
