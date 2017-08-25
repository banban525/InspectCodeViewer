import {SummaryReducer,ISummaryState} from './SummaryReducer';


var initialState:ISummaryState = {
  originalData:{
    revisionInfos:[]
  },
  selectedRevisionId:""
}



describe('Test for SummaryReducer', function() {
  it('receivedInitialData', function(){

    let action = {
      type:'receivedInitialData', 
      revisions:{
        revisionInfos:[
          {
            id:"00001",
            caption:"test",
            issueCount:100,
            link:""
          },
          {
            id:"00002",
            caption:"test2",
            issueCount:200,
            link:""
          }
        ]
      }
    };

    let newState = SummaryReducer(initialState, action);
      
    expect(newState.originalData).toBe(action.revisions);
  });
});