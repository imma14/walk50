const initialState = { score: 0 }


function updateScore(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'ADD_SCORE':
            nextState = {score : state.score + action.value}
          return nextState || state
        case 'SUBSTRACT_SCORE':
            if(state.score - action.value >= 0){
                nextState = {score : state.score - action.value}
            } else {
                nextState = {score : 0}
            }
        return nextState || state
      default:
        return state
      }
  }

  export default updateScore