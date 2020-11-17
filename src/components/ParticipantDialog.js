import React, { useReducer, useEffect } from 'react';
import propTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import validate, { notEmpty, isEmail, isPhone, VALID } from '../utils/validation';

const emptyParticipant = { name: '', email: '', number: '' };

const fieldValidators = {
    name: notEmpty('Participant name cannot be empty'),
    email: [notEmpty('Email address cannot be empty'), isEmail('Email address is not correct')],
    number: [notEmpty('Phone number cannot be empty'), isPhone('Phone number is not correct')],
};

const init = (participant = emptyParticipant) => {
    return Object.keys(participant).reduce((accState, key) => ({
        ...accState,
        [key]: { value: participant[key], ...VALID }
    }), {});
};
const updateState = (state, { field, value }) => ({
    ...state,
    [field]: { ...state[field], value }
});
const validateState = (state, { field }) => {
    const { value } = state[field];
    const validation = validate(fieldValidators[field])(value);
    return {
        ...state,
        [field]: { ...validation, value }
    };
};
const reinitState = (state, action) => init(action.state);

const reducer = (state, action) => {
    const handlers = { updateState, validateState, reinitState };
    return handlers[action.type] ? handlers[action.type](state, action) : state;
};


const ParticipantDialog = ({ open, participant, addParticipant, closeDialog }) => {
    const smallViewPort = useMediaQuery('(max-width: 766px)');
    const [state, dispatch] = useReducer(reducer, participant, init);

    const { name, email, number } = state;
    const addButtonDisabled = Object.keys(state).some(field => state[field].value === '' || !state[field].isValid);

    const fieldChangeHandler = ({ target }) => dispatch({ type: 'updateState', field: target.name, value: target.value })
    const fieldBlurHandler = ({ target }) => dispatch({ type: 'validateState', field: target.name })
    const closeDialogHandler = () => {
        dispatch({ type: 'reinitState' });
        closeDialog();
    };
    const addParticipantHandler = () => {
        const participantObject = Object.keys(state).reduce((obj, field) => ({ ...obj, [field]: state[field].value }), {});
        addParticipant(participantObject);
        closeDialogHandler();
    };

    useEffect(() => {
        dispatch({ type: 'reinitState', state: participant })
    }, [participant]);

    return (
        <Dialog
            open={open}
            onClose={closeDialogHandler}
            fullScreen={smallViewPort}
            transitionDuration={{ enter: 300, exit: 10 }}
            aria-labelledby="add-new-participant"
        >
            <DialogTitle id="add-new-participant">Add Participant</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    required
                    margin="dense"
                    label="Paticipant Name"
                    placeholder="Elon Musk"
                    type="text"
                    name="name"
                    value={name.value}
                    onChange={fieldChangeHandler}
                    onBlur={fieldBlurHandler}
                    error={!name.isValid}
                    helperText={!name.isValid && name.errorMsg}
                />
                <TextField
                    fullWidth
                    multiline
                    required
                    margin="dense"
                    label="Email"
                    placeholder="e.musk@mail.org"
                    type="email"
                    name="email"
                    value={email.value}
                    onChange={fieldChangeHandler}
                    onBlur={fieldBlurHandler}
                    error={!email.isValid}
                    helperText={!email.isValid && email.errorMsg}
                />
                <TextField
                    fullWidth
                    multiline
                    required
                    margin="dense"
                    label="Phone number"
                    placeholder="+79991234567"
                    type="tel"
                    name="number"
                    value={number.value}
                    onChange={fieldChangeHandler}
                    onBlur={fieldBlurHandler}
                    error={!number.isValid}
                    helperText={!number.isValid && number.errorMsg}
                />
                <Typography variant="caption" gutterBottom>
                    (all fields are required)
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialogHandler} color="primary">
                    Cancel
                </Button>
                <Button onClick={addParticipantHandler} color="primary" disabled={addButtonDisabled} >
                    {participant ? 'Apply' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

ParticipantDialog.propTypes = {
    open: propTypes.bool.isRequired,
    participant: propTypes.shape({
        name: propTypes.string.isRequired,
        email: propTypes.string.isRequired,
        number: propTypes.string.isRequired
    }),

    addParticipant: propTypes.func.isRequired,
    closeDialog: propTypes.func.isRequired
}

export default ParticipantDialog;