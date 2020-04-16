import  {combineReducers} from 'redux'
import stepReducer from './stepReducer'
import scoreReducer from './scoreReducer'

const rootReducer = combineReducers({
	stepReducer : stepReducer,
	scoreReducer : scoreReducer,
})

export default rootReducer
