const initialState = { step: 0 }


function updateStep(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'UPDATE_STEP':
            nextState = {step : action.value}
          return nextState || state
      default:
        return state
      }
  }

  export default updateStep