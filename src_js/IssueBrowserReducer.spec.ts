import {IssueBrowserReducer,IIssueBrowserState, IssueBrowserActionDispatcher} from './IssueBrowserReducer';
import {IInspectResultsSummary} from './CommonData';
import * as sinon from "sinon";

describe('Test for IssueBrowserActionDispatcher', function() {
  var dispatcher:IssueBrowserActionDispatcher;
  var dispatch:sinon.SinonSpy;
  var getState:sinon.SinonSpy;
  var myAjax:sinon.SinonSpy;
  
  beforeEach(function() {
    dispatch = sinon.spy();
    getState = sinon.spy();
    myAjax = sinon.spy();

    dispatcher = new IssueBrowserActionDispatcher(
      dispatch as (action:any)=>void, 
      getState as ()=>IIssueBrowserState, 
      myAjax as (url:string, callback:(data:any)=>void)=>void);
  });

  it('onChangeIssuesGroupBy', function(){
    dispatcher.onChangeIssuesGroupBy(1);

    expect(dispatch.calledOnce).toBe(true);
    expect(dispatch.getCall(0).args[0]).toEqual({type:"onChangeIssuesGroupBy", value:1});
  });

  it('getInitialData', ()=>{
    dispatcher.getInitialData();

    expect(dispatch.callCount).toBe(0);
    
    expect(myAjax.callCount).toBe(1);
    expect(myAjax.getCall(0).args[0]).toEqual("./revisions/summary.js");

    //callback
    let data:IInspectResultsSummary ={
      revisionInfos:[]
    };
    (myAjax.getCall(0).args[1] as (data:any)=>void)(data);


    expect(dispatch.callCount).toBe(1);
    expect(dispatch.getCall(0).args[0]).toEqual({type:"receivedInitialData", revisions: data});
  })
});