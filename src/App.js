import React from 'react';
import Stage from './Components/Stage'
import './App.css';
import { Provider } from 'react-redux'
import Store from './Store/confgureStore'


function App() {

  return (
    <Provider store={Store}>
      <div className="App">
        <Stage />
      </div>
    </Provider>
    
  );
}

export default App; 
