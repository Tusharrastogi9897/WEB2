import React from 'react';
import './App.css';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';
import { ConfigureStore } from './redux/configureStore';
import { Provider } from 'react-redux';

const store = ConfigureStore();

function App() {

    return (
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    <Main />
                </div>
            </BrowserRouter>
        </Provider>
       );
}

export default App;
