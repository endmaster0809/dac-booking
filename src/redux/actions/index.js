import * as actionTypes from './actionTypes';

export const updateWorkspaceHostname = (hostname) => ({
    type: actionTypes.UPDATE_WORKSPACE_HOSTNAME,
    hostname
});

export const addWorkspace = () => ({ type: actionTypes.ADD_WORKSPACE });

export const setWorkspaceInfo = (workspaceHost, workspaceInfo) => ({
    type: actionTypes.SET_WORKSPACE_INFO,
    workspaceHost,
    workspaceInfo
});

export const setWorkspaceStatus = (status) => ({
    type: actionTypes.SET_WORKSPACE_STATUS,
    status
});

export const setWorkspaceErrorMessage = (errorMessage) => ({
    type: actionTypes.SET_WORKSPACE_ERROR_MESSAGE,
    errorMessage
});

export const getAvailableRooms = (workspaceHost, date) => ({
    type: actionTypes.GET_AVAILABLE_ROOMS,
    workspaceHost,
    date
});

export const setAvailableRooms = (workspaceHost, date, availableRooms) => ({
    type: actionTypes.SET_AVAILABLE_ROOMS,
    workspaceHost,
    date,
    availableRooms
});

export const setAvailableRoomsStatus = (workspaceHost, availableRoomsStatus) => ({
    type: actionTypes.SET_AVAILABLE_ROOMS_STATUS,
    workspaceHost,
    availableRoomsStatus
});

export const setAvailableRoomsErrorMessage = (workspaceHost, availableRoomsErrorMessage) => ({
    type: actionTypes.SET_AVAILABLE_ROOMS_ERROR_MESSAGE,
    workspaceHost,
    availableRoomsErrorMessage
});

export const filterRoomsByName = (workspaceHost, searchedRoomName) => ({
    type: actionTypes.FILTER_ROOMS_BY_NAME,
    workspaceHost,
    searchedRoomName
});

export const filterRoomsByNextHourAvailability = (workspaceHost, nextHourAvailability) => ({
    type: actionTypes.FILTER_ROOMS_BY_NEXT_HOUR_AVAILABILITY,
    workspaceHost,
    nextHourAvailability
});

export const initBooking = (roomProps, bookingDate) => ({
    type: actionTypes.INIT_BOOKING,
    roomProps,
    bookingDate
});

export const cancelBooking = () => ({ type: actionTypes.CANCEL_BOOKING });

export const updateEventField = (field, value) => ({
    type: actionTypes.UPDATE_EVENT_FIELD,
    field,
    value
});

export const addParticipant = (participant) => ({
    type: actionTypes.ADD_PARTICIPANT,
    participant
});

export const setParticipantIndexForEdit = (participantIndex) => ({
    type: actionTypes.SET_PARTICIPANT_INDEX_FOR_EDIT,
    participantIndex
});

export const removeParticipant = (participantIndex) => ({
    type: actionTypes.REMOVE_PARTICIPANT,
    participantIndex
});

export const setBookingStatus = (bookingStatus) => ({
    type: actionTypes.SET_BOOKING_STATUS,
    bookingStatus
});

export const setBookingErrorMessage = (bookingErrorMessage) => ({
    type: actionTypes.SET_BOOKING_ERROR_MESSAGE,
    bookingErrorMessage
});

export const makeBooking = (workspaceHost) => ({
    type: actionTypes.MAKE_BOOKING,
    workspaceHost
});

export const validateBookingTime = () => ({ type: actionTypes.VALIDATE_BOOKING_TIME });

export const finishBooking = (workspaceHost, bookingProps) => ({
    type: actionTypes.FINISH_BOOKING,
    workspaceHost,
    bookingProps
});