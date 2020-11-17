import dayjs from 'dayjs';
import * as actionTypes from '../actions/actionTypes';
import * as statuses from '../../entities/statuses';
import { getStartAndEndTimeFromPeriod } from '../../utils';
import validate, {
    startIsBeforeThanEnd,
    startIsInFuture,
    timeIntervalIsCorrect,
    timeIntervalIsAvailable,
    VALID
} from '../../utils/validation';

const TIME_SLOT = 15;

const INITIAL_STATE = {
    bookingDialogOpen: false,
    bookingStatus: statuses.INITIAL,
    bookingErrorMessage: '',
    currentAvailablePeriods: [],
    participantIndexForEdit: undefined,
    currentBooking: {
        date: undefined,
        time_start: undefined,
        time_end: undefined,
        title: '',
        description: '',
        room: '',
        roomId: undefined,
        passes: []
    },
    timeValidation: VALID,
    recentBookings: []
};

const getTimeRegardingTimeSlot = () => {
    const currentTime = dayjs();
    const minutes = currentTime.minute();
    return currentTime.minute(TIME_SLOT - (minutes % TIME_SLOT) + minutes).second(0);
};

const initializeBooking = (state, { roomProps, bookingDate }) => {
    const { id, name, avail = [] } = roomProps;
    const bookingTime = getTimeRegardingTimeSlot();
    const date = dayjs(bookingDate);
    const dateIsToday = date.isSame(bookingTime, 'date');
    const currentAvailablePeriods = avail.reduce((acc, timePeriod) => {
        const { startTime, endTime } = getStartAndEndTimeFromPeriod(timePeriod, date);

        if (!dateIsToday || bookingTime.isBefore(startTime)) {
            return acc.concat({ startTime, endTime });
        } else if (bookingTime.isAfter(startTime) && bookingTime.isBefore(endTime)) {
            return acc.concat({ startTime: bookingTime, endTime });
        } else {
            return acc;
        }
    }, []);

    const time_start = currentAvailablePeriods[0].startTime;
    const time_end = time_start.add(TIME_SLOT, 'minute');

    return {
        ...state,
        bookingDialogOpen: true,
        bookingStatus: statuses.INITIAL,
        currentAvailablePeriods,
        currentBooking: {
            ...state.currentBooking,
            room: name,
            roomId: id,
            date: date.valueOf(),
            time_start,
            time_end
        }
    }
};

const cancelBooking = (state) => ({
    ...INITIAL_STATE,
    recentBookings: state.recentBookings
});

const setBookingStatus = (state, { bookingStatus }) => ({
    ...state,
    bookingStatus
});

const setBookingErrorMessage = (state, { bookingErrorMessage }) => ({
    ...state,
    bookingErrorMessage
});

const updateEventField = (state, { field, value }) => ({
    ...state,
    timeValidation: field === 'time_start' || field === 'time_end' ? VALID : state.timeValidation,
    currentBooking: {
        ...state.currentBooking,
        [field]: value
    }
});

const validateBookingTime = (state) => {
    const { currentAvailablePeriods, currentBooking: { time_start, time_end } } = state;
    const timeValidation = validate([
        startIsBeforeThanEnd(`Booking end time should be later than start time on at least ${TIME_SLOT} minutes`),
        startIsInFuture('Booking start time cannot be in the past'),
        timeIntervalIsCorrect('Booking is available only between 7:00 and 19:00'),
        timeIntervalIsAvailable('Room is not available during chosen time interval')
    ])({ start: time_start, end: time_end, currentAvailablePeriods, TIME_SLOT });

    return { ...state, timeValidation };
};

const addParticipant = (state, { participant }) => {
    const { participantIndexForEdit, currentBooking } = state;
    const passes = participantIndexForEdit !== undefined
        ? [
            ...currentBooking.passes.slice(0, participantIndexForEdit),
            participant,
            ...currentBooking.passes.slice(participantIndexForEdit + 1)
        ]
        : currentBooking.passes.concat(participant);

    return {
        ...state,
        currentBooking: { ...currentBooking, passes }
    };
};

const setParticipantIndexForEdit = (state, { participantIndex }) => ({
    ...state,
    participantIndexForEdit: participantIndex
});

const removeParticipant = (state, { participantIndex }) => {
    const { passes } = state.currentBooking;
    return {
        ...state,
        currentBooking: {
            ...state.currentBooking,
            passes: [...passes.slice(0, participantIndex), ...passes.slice(participantIndex + 1)]
        }
    }
};

const finishBooking = (state) => ({
    ...INITIAL_STATE,
    bookingStatus: state.bookingStatus,
    recentBookings: state.recentBookings.concat(state.currentBooking)
});

const bookingsReducer = (state = INITIAL_STATE, action) => {
    const handlers = {
        [actionTypes.INIT_BOOKING]: initializeBooking,
        [actionTypes.CANCEL_BOOKING]: cancelBooking,
        [actionTypes.SET_BOOKING_STATUS]: setBookingStatus,
        [actionTypes.SET_BOOKING_ERROR_MESSAGE]: setBookingErrorMessage,
        [actionTypes.UPDATE_EVENT_FIELD]: updateEventField,
        [actionTypes.VALIDATE_BOOKING_TIME]: validateBookingTime,
        [actionTypes.ADD_PARTICIPANT]: addParticipant,
        [actionTypes.REMOVE_PARTICIPANT]: removeParticipant,
        [actionTypes.SET_PARTICIPANT_INDEX_FOR_EDIT]: setParticipantIndexForEdit,
        [actionTypes.FINISH_BOOKING]: finishBooking
    }
    return handlers[action.type] ? handlers[action.type](state, action) : state;
};

export default bookingsReducer;