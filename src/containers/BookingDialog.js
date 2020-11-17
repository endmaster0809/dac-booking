import React, { useState } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { TimePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

import ParticipantDialog from '../components/ParticipantDialog';
import ParticipantsList from '../components/ParticipantsList';
import * as actions from '../redux/actions';
import * as statuses from '../entities/statuses';

dayjs.extend(advancedFormat);

const useStyles = makeStyles(theme => ({
    progress: {
        marginRight: theme.spacing(1),
    }
}));

const BookingDialog = (props) => {
    const {
        open, room, date, title, description, time_start, time_end, passes,
        participantIndexForEdit, closeDialog, updateEventField, timeValidation: { isValid, errorMsg },
        addParticipant, setParticipantIndexForEdit, removeParticipant, makeBooking, bookingStatus, bookingErrorMessage
    } = props;

    const classes = useStyles();
    const [openParticipantDialog, setOpenParticipantDialog] = useState(false);
    const smallViewPort = useMediaQuery('(max-width: 766px)');
    const isFormFilledUp = title !== '' && description !== '' && passes.length;
    const bookingInPropgress = bookingStatus === statuses.FETCHING;

    const eventFieldChangeHandler = ({ target }) => updateEventField(target.name, target.value);
    const toggleParticipantDialogHandler = (participantIndex) => {
        setParticipantIndexForEdit(participantIndex);
        setOpenParticipantDialog(!openParticipantDialog);
    };

    return (
        <Dialog
            open={open}
            onClose={closeDialog}
            fullScreen={smallViewPort}
            transitionDuration={{ enter: 300, exit: 10 }}
            aria-labelledby={`booking-room-${room}`}
        >
            <DialogTitle id={`booking-room-${room}`}>Booking Room {room}</DialogTitle>
            <DialogContent>
                <Typography>
                    To book the room for {dayjs(date).format('MMMM, Do YYYY')} fill up following fields:
                </Typography>
                <Typography variant="caption" gutterBottom>
                    (all fields are required)
                </Typography>
                <TextField
                    autoFocus
                    fullWidth
                    required
                    margin="dense"
                    label="Event title"
                    name="title"
                    value={title}
                    onChange={eventFieldChangeHandler}
                    disabled={bookingInPropgress}
                />
                <TextField
                    fullWidth
                    multiline
                    required
                    margin="dense"
                    label="Event desciption"
                    name="description"
                    value={description}
                    onChange={eventFieldChangeHandler}
                    disabled={bookingInPropgress}
                />
                <TimePicker
                    fullWidth
                    required
                    ampm={false}
                    minutesStep={15}
                    margin="dense"
                    label="From"
                    value={time_start}
                    onChange={(time) => updateEventField('time_start', time)}
                    error={!isValid}
                    disabled={bookingInPropgress}
                />
                <TimePicker
                    fullWidth
                    required
                    ampm={false}
                    minutesStep={15}
                    margin="dense"
                    label="To"
                    value={time_end}
                    onChange={(time) => updateEventField('time_end', time)}
                    error={!isValid}
                    disabled={bookingInPropgress}
                />
                {!isValid &&
                    <Typography variant="body2" color="error" gutterBottom>
                        {errorMsg}
                    </Typography>
                }
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => setOpenParticipantDialog(!openParticipantDialog)}
                    disabled={bookingInPropgress}
                >
                    Add Participant
                </Button>
                <ParticipantsList
                    disabledControls={bookingInPropgress}
                    participants={passes}
                    setParticipantIndexForEdit={toggleParticipantDialogHandler}
                    removeParticipant={removeParticipant}
                />
                <ParticipantDialog
                    open={openParticipantDialog}
                    participant={passes[participantIndexForEdit]}
                    addParticipant={addParticipant}
                    closeDialog={toggleParticipantDialogHandler}
                />
                <Typography variant="caption" color="error" align="right" component="div">
                    {bookingErrorMessage}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary" disabled={bookingInPropgress}>
                    Cancel
                </Button>
                <Button onClick={makeBooking} color="primary" disabled={!isFormFilledUp || !isValid || bookingInPropgress}>
                    {bookingInPropgress &&
                        <CircularProgress size={18} thickness={6} className={classes.progress} />
                    }
                    Book
                </Button>
            </DialogActions>
        </Dialog>
    )
};

BookingDialog.propTypes = {
    date: propTypes.oneOfType([propTypes.string, propTypes.object, propTypes.number]),
    time_start: propTypes.oneOfType([propTypes.string, propTypes.object]),
    time_end: propTypes.oneOfType([propTypes.string, propTypes.object]),
    title: propTypes.string.isRequired,
    description: propTypes.string.isRequired,
    room: propTypes.string.isRequired,
    roomId: propTypes.string,
    passes: propTypes.arrayOf(propTypes.object).isRequired,
    timeValidation: propTypes.shape({
        isValid: propTypes.bool.isRequired,
        errorMsg: propTypes.string.isRequired
    }).isRequired,
    participantIndexForEdit: propTypes.number,
    bookingStatus: propTypes.string.isRequired,
    bookingErrorMessage: propTypes.string,

    updateEventField: propTypes.func.isRequired,
    addParticipant: propTypes.func.isRequired,
    removeParticipant: propTypes.func.isRequired,
    setParticipantIndexForEdit: propTypes.func.isRequired,
    makeBooking: propTypes.func.isRequired
}

const mapStateToProps = ({ bookings }) => {
    const { currentBooking, timeValidation, participantIndexForEdit, bookingStatus, bookingErrorMessage } = bookings;
    return {
        ...currentBooking,
        timeValidation,
        participantIndexForEdit,
        bookingStatus,
        bookingErrorMessage
    }
};

const mapDispatchToProps = (dispatch, { workspaceHost }) => ({
    updateEventField: (field, value) => dispatch(actions.updateEventField(field, value)),
    addParticipant: (participant) => dispatch(actions.addParticipant(participant)),
    removeParticipant: (index) => dispatch(actions.removeParticipant(index)),
    setParticipantIndexForEdit: (index) => dispatch(actions.setParticipantIndexForEdit(index)),
    makeBooking: () => dispatch(actions.makeBooking(workspaceHost))
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingDialog);
