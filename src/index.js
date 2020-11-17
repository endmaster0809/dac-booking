import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import App from './containers/App';
import appReducer from './redux/reducers';
import rootSaga from './sagas';
import { throttle } from './utils';
import { saveState, loadState } from './utils/persistState';
import * as colors from './entities/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.deepPurple
        },
        secondary: {
            main: colors.green
        },
        error: {
            main: colors.red
        }
    }
});

const composeEnchancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const persistedState = loadState();
const enchancers = composeEnchancers(
    applyMiddleware(sagaMiddleware)
);
const store = createStore(
    appReducer,
    persistedState,
    enchancers
);

store.subscribe(throttle(() => saveState(store.getState()), 5000));

sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);