export const VALID = { isValid: true, errorMsg: '' };

export const notEmpty = (errorMsg) => (value) => {
    const isValid = value !== ''
    return isValid ? VALID : { isValid, errorMsg };
};

export const isEmail = (errorMsg) => (value) => {
    const regexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isValid = regexp.test(value);
    return isValid ? VALID : { isValid, errorMsg };
};

export const isPhone = (errorMsg) => (value) => {
    const regexp = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    const isValid = regexp.test(value);
    return isValid ? VALID : { isValid, errorMsg };
};

export const startIsBeforeThanEnd = (errorMsg) => ({ start, end, TIME_SLOT }) => {
    const isValid = start.isBefore(end) && end.diff(start, 'minute') >= TIME_SLOT;
    return isValid ? VALID : { isValid, errorMsg };
};

export const startIsInFuture = (errorMsg) => ({ start }) => {
    const isValid = start.isAfter(Date.now());
    return isValid ? VALID : { isValid, errorMsg };
};

export const timeIntervalIsCorrect = (errorMsg) => ({ start, end }) => {
    const isValid = start >= start.hour(7).minute(0) && end <= end.hour(19).minute(0);
    return isValid ? VALID : { isValid, errorMsg };
};

export const timeIntervalIsAvailable = (errorMsg) => ({ start, end, currentAvailablePeriods }) => {
    const isValid = currentAvailablePeriods.some(({ startTime, endTime }) => {
        return start >= startTime && end <= endTime;
    });
    return isValid ? VALID : { isValid, errorMsg };
};

const validate = (validator) => (value) => {
    if (Array.isArray(validator)) {
        return validator.reduce((acc, validator) => {
            return acc.isValid ? validator(value) : acc;
        }, VALID);
    }
    return validator(value);
};

export default validate;