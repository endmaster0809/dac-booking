import { all, takeLatest, call, put, select } from "redux-saga/effects";
import * as API from '../api';
import * as actions from '../redux/actions';
import * as actionTypes from '../redux/actions/actionTypes';
import * as statuses from '../entities/statuses';

function* addWorkspace() {
    const workspaceHost = yield select(({ newWorkspace }) => newWorkspace.hostname);
    yield put(actions.setWorkspaceStatus(statuses.FETCHING));
    const { data = {}, err } = yield call(API.getWorkspaceInfo, workspaceHost);

    if (err || data.error) {
        yield all([
            put(actions.setWorkspaceStatus(statuses.ERROR)),
            put(actions.setWorkspaceErrorMessage(
                (data.error && data.error.text) ||
                'Oops... Some error occured. Please make sure the hostname is correct and try again'
            ))
        ]);
    } else {
        yield all([
            put(actions.setWorkspaceInfo(workspaceHost, data)),
            put(actions.setWorkspaceStatus(statuses.LOADED)),
            put(actions.setWorkspaceStatus(statuses.INITIAL)),
            put(actions.setWorkspaceErrorMessage(''))
        ]);
    }
}

function* getAvailableRooms({ workspaceHost, date = Date.now() }) {
    yield put(actions.setAvailableRoomsStatus(workspaceHost, statuses.FETCHING));

    const { data = {}, err } = yield call(API.getRooms, workspaceHost, date);

    if (err || data.error) {
        yield all([
            put(actions.setAvailableRoomsStatus(workspaceHost, statuses.ERROR)),
            put(actions.setAvailableRoomsErrorMessage(
                workspaceHost,
                (data.error && data.error.text) ||
                'Oops... Loading available rooms failed. Please try again'
            ))
        ]);
    } else {
        yield put(actions.setAvailableRooms(workspaceHost, date, data));
    }
}

function* makeBooking({ workspaceHost }) {
    yield all([
        put(actions.setBookingStatus(statuses.FETCHING)),
        put(actions.setBookingErrorMessage('')),
        put(actions.validateBookingTime())
    ]);

    const { timeValidation, currentBooking } = yield select(({ bookings }) => bookings);

    if (timeValidation.isValid) {
        const { date, time_start, time_end, title, description, room, passes, roomId } = currentBooking;
        const { data = {}, err } = yield call(API.bookRoom, workspaceHost, {
            booking: {
                date,
                time_start: time_start.valueOf(),
                time_end: time_end.valueOf(),
                title,
                description,
                room
            },
            passes
        });

        if (err || data.error) {
            yield all([
                put(actions.setBookingStatus(statuses.ERROR)),
                put(actions.setBookingErrorMessage(
                    (data.error && data.error.text) ||
                    'Oops... Some error occured. Please make sure all provided data is correct and try again'
                ))
            ]);
        } else {
            yield all([
                put(actions.setBookingStatus(statuses.LOADED)),
                put(actions.finishBooking(workspaceHost, { roomId, time_start, time_end }))
            ]);
        }
    } else {
        yield put(actions.setBookingStatus(statuses.INITIAL));
    }

}

export default function* rootSaga() {
    yield all([
        takeLatest(actionTypes.ADD_WORKSPACE, addWorkspace),
        takeLatest(actionTypes.GET_AVAILABLE_ROOMS, getAvailableRooms),
        takeLatest(actionTypes.MAKE_BOOKING, makeBooking),
    ])
}