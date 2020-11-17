import uuid from 'uuid/v4';
import dayjs from 'dayjs';
import { getStartAndEndTimeFromPeriod, compose } from '../../utils';
import * as actionTypes from '../actions/actionTypes';
import * as statuses from '../../entities/statuses';

const setWorkspaceInfo = (state, { workspaceHost, workspaceInfo }) => ({
    ...state,
    [workspaceHost]: {
        ...workspaceInfo,
        availableRoomsStatus: statuses.INITIAL
    }
});

const setAvailableRooms = (state, { workspaceHost, date, availableRooms }) => {
    const availableRoomsWithIds = availableRooms.map(room => ({ id: uuid(), ...room }));
    return {
        ...state,
        [workspaceHost]: {
            ...state[workspaceHost],
            dateForAvailableRooms: new Date(date),
            availableRoomsStatus: statuses.LOADED,
            availableRoomsErrorMessage: '',
            availableRooms: availableRoomsWithIds,
            filteredRooms: availableRoomsWithIds,
            searchedRoomName: '',
            nextHourAvailability: false
        }
    }
};

const setAvailableRoomsStatus = (state, { workspaceHost, availableRoomsStatus }) => ({
    ...state,
    [workspaceHost]: {
        ...state[workspaceHost],
        availableRoomsStatus
    }
});

const setAvailableRoomsErrorMessage = (state, { workspaceHost, availableRoomsErrorMessage }) => ({
    ...state,
    [workspaceHost]: {
        ...state[workspaceHost],
        availableRoomsErrorMessage
    }
});

const applyFilters = ({ availableRooms, searchedRoomName, nextHourAvailability }, options) => {
    const filterByName = (roomName = searchedRoomName) => (rooms) => {
        const lowerCaseRoomName = roomName.trim().toLowerCase();
        if (lowerCaseRoomName !== "") {
            return rooms.filter(({ name }) => {
                return name.toLowerCase().includes(lowerCaseRoomName)
            })
        }
        return rooms;
    };
    const filterByNextHour = (nextHour = nextHourAvailability) => (rooms) => {
        if (nextHour) {
            const currentTime = dayjs();
            const nextHourTime = currentTime.add(1, 'hour');
            return rooms.filter(room => {
                return room.avail.some(timePeriod => {
                    const { startTime, endTime } = getStartAndEndTimeFromPeriod(timePeriod, currentTime);
                    return currentTime >= startTime && nextHourTime <= endTime;
                });
            })
        }
        return rooms;
    };

    return compose(
        filterByNextHour(options.nextHourAvailability),
        filterByName(options.searchedRoomName)
    )(availableRooms);
}

const filterRoomsByName = (state, { workspaceHost, searchedRoomName }) => {
    const filteredRooms = applyFilters(state[workspaceHost], { searchedRoomName });
    return {
        ...state,
        [workspaceHost]: {
            ...state[workspaceHost],
            searchedRoomName,
            filteredRooms
        }
    }
};

const filterRoomsByNextHourAvailability = (state, { workspaceHost, nextHourAvailability }) => {
    const filteredRooms = applyFilters(state[workspaceHost], { nextHourAvailability });
    return {
        ...state,
        [workspaceHost]: {
            ...state[workspaceHost],
            nextHourAvailability,
            filteredRooms
        }
    }
};

const updateAvailablePeriods = (avail, start, end) => {
    return avail.reduce((acc, timePeriod) => {
        const { startTime, endTime } = getStartAndEndTimeFromPeriod(timePeriod, start);

        if (start.isSame(startTime) && end.isSame(endTime)) {
            return acc;
        } else if (start.isSame(startTime) && end.isBefore(endTime)) {
            return acc.concat(`${end.format('H:mm')} - ${endTime.format('H:mm')}`);
        } else if (start.isAfter(startTime) && end.isSame(endTime)) {
            return acc.concat(`${startTime.format('H:mm')} - ${start.format('H:mm')}`);
        } else if (start.isAfter(startTime) && end.isBefore(endTime)) {
            return acc.concat(
                `${startTime.format('H:mm')} - ${start.format('H:mm')}`,
                `${end.format('H:mm')} - ${endTime.format('H:mm')}`
            );
        } else {
            return acc.concat(timePeriod);
        }
    }, []);
}

const updateRoomAvailability = (state, { workspaceHost, bookingProps }) => {
    const workspace = state[workspaceHost];
    const { roomId, time_start, time_end } = bookingProps;
    const updateRoomList = (roomList) => roomList.map(room => room.id === roomId
        ? { ...room, avail: updateAvailablePeriods(room.avail, time_start, time_end) }
        : room
    );

    return {
        ...state,
        [workspaceHost]: {
            ...workspace,
            availableRooms: updateRoomList(workspace.availableRooms),
            filteredRooms: updateRoomList(workspace.filteredRooms)
        }
    }
};

const workspacesReducer = (state = {}, action) => {
    const handlers = {
        [actionTypes.SET_WORKSPACE_INFO]: setWorkspaceInfo,
        [actionTypes.SET_AVAILABLE_ROOMS]: setAvailableRooms,
        [actionTypes.SET_AVAILABLE_ROOMS_STATUS]: setAvailableRoomsStatus,
        [actionTypes.SET_AVAILABLE_ROOMS_ERROR_MESSAGE]: setAvailableRoomsErrorMessage,
        [actionTypes.FILTER_ROOMS_BY_NAME]: filterRoomsByName,
        [actionTypes.FILTER_ROOMS_BY_NEXT_HOUR_AVAILABILITY]: filterRoomsByNextHourAvailability,
        [actionTypes.FINISH_BOOKING]: updateRoomAvailability
    }
    return handlers[action.type] ? handlers[action.type](state, action) : state;
};

export default workspacesReducer;