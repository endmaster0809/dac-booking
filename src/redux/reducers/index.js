import { combineReducers } from 'redux';

import workspacesReducer from './workspacesReducer';
import bookingsReducer from './bookingsReducer';
import * as actionTypes from '../actions/actionTypes';
import * as statuses from '../../entities/statuses';

const INITIAL_STATE = {
    hostname: '',
    status: statuses.INITIAL,
    errorMessage: ''
};

const updateWorkspaceHostname = (state, { hostname }) => ({ ...state, hostname });

const setWorkspaceStatus = (state, { status }) => ({ ...state, status });

const setWorkspaceErrorMessage = (state, { errorMessage }) => ({ ...state, errorMessage });

const newWorkspaceReducer = (state = INITIAL_STATE, action) => {
    const handlers = {
        [actionTypes.UPDATE_WORKSPACE_HOSTNAME]: updateWorkspaceHostname,
        [actionTypes.SET_WORKSPACE_STATUS]: setWorkspaceStatus,
        [actionTypes.SET_WORKSPACE_ERROR_MESSAGE]: setWorkspaceErrorMessage
    }
    return handlers[action.type] ? handlers[action.type](state, action) : state;
};

export default combineReducers({
    newWorkspace: newWorkspaceReducer,
    workspaces: workspacesReducer,
    bookings: bookingsReducer
});