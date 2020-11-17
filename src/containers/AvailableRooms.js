import React, { Fragment, useEffect } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import DayjsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ChevronLeftRounded';
import ChevronRight from '@material-ui/icons/ChevronRightRounded';

import BookingDialog from './BookingDialog';
import RoomCard from '../components/RoomCard';
import BookingNotification from '../components/BookingNotification';

import * as actions from '../redux/actions';
import * as statuses from '../entities/statuses';

const useStyles = makeStyles(theme => ({
    alingment: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textAlignCenter: {
        textAlign: 'center'
    },
    filtersContainer: {
        padding: theme.spacing(2),
        margin: theme.spacing(2, 0),
    },
    filterItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start-end'
    },
    filterLabel: {
        marginRight: theme.spacing(1)
    }
}));

const AvailableRooms = (props) => {
    const {
        workspace, bookingDialogOpen, bookingNotificationOpen, closeNotification, match, history,
        initBooking, cancelBooking, getAvailableRooms, filterRoomsByName, filterRoomsByNextHourAvailability
    } = props;
    const { filteredRooms, availableRoomsStatus, availableRoomsErrorMessage, dateForAvailableRooms, searchedRoomName, nextHourAvailability } = workspace || {};
    const workspaceHost = match.params.workspace;

    const classes = useStyles();
    const date = dayjs(dateForAvailableRooms);
    const dateIsToday = date.isSame(Date.now(), 'date');
    const laterThan19 = date.isAfter(date.hour(19).minute(0).second(0));

    const openBookingDialog = (roomProps) => initBooking(roomProps, dateForAvailableRooms);
    const dateChangeHandler = (date) => date.isValid() && getAvailableRooms(date.valueOf());
    const nextDateChangeHandler = () => getAvailableRooms(dayjs(dateForAvailableRooms).add(1, 'day').valueOf());
    const prevDateChangeHandler = () => getAvailableRooms(dayjs(dateForAvailableRooms).subtract(1, 'day').valueOf());
    const searchRoomNameChangeHandler = ({ target }) => filterRoomsByName(target.value);
    const nextHourAvailabilityChangeHandler = ({ target }) => filterRoomsByNextHourAvailability(target.checked);

    useEffect(() => {
        if (!workspace) {
            history.push("/");
        } else if (workspace.availableRoomsStatus !== statuses.LOADED) {
            getAvailableRooms();
        }
    }, []);

    if (availableRoomsStatus === statuses.ERROR) {
        return (
            <Typography variant="body1" align="center" color="error" component="div">
                <p>{availableRoomsErrorMessage}</p>
                <Button
                    variant="outlined"
                    onClick={() => getAvailableRooms()}
                >
                    Try again
                </Button>
            </Typography>
        );
    }

    if (availableRoomsStatus !== statuses.LOADED) return <CircularProgress />;

    return (
        <Fragment>
            <MuiPickersUtilsProvider utils={DayjsUtils}>
                <Typography variant="h5" component="h3" align="center">
                    Available Rooms for
                </Typography>
                <div className={classes.alingment}>
                    <IconButton onClick={prevDateChangeHandler} disabled={dateIsToday} aria-label="previous day">
                        <ChevronLeft />
                    </IconButton>
                    <DatePicker
                        disablePast
                        placeholder="20/10/2020"
                        value={dateForAvailableRooms}
                        onChange={dateChangeHandler}
                        format="DD MMMM YYYY"
                        inputProps={{className: classes.textAlignCenter}}
                    />
                    <IconButton onClick={nextDateChangeHandler} aria-label="next day">
                        <ChevronRight />
                    </IconButton>
                </div>
                <Paper className={classes.filtersContainer}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} className={classes.filterItem}>
                            <Typography className={classes.filterLabel}>Filter:</Typography>
                            <TextField
                                margin="dense"
                                variant="outlined"
                                placeholder="Enter room name"
                                value={searchedRoomName}
                                onChange={searchRoomNameChangeHandler}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.filterItem}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nextHourAvailability}
                                        onChange={nextHourAvailabilityChangeHandler}
                                        color="primary"
                                    />
                                }
                                label="Available next hour"
                                disabled={!dateIsToday}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Grid container spacing={2}>
                    {filteredRooms.map((room, index) => (
                        <Grid item xs={12} md={6} xl={4} key={`${room.name}-${index}`}>
                            <RoomCard {...room}
                                isToday={dateIsToday}
                                isLaterThan19={laterThan19}
                                workspaceHost={workspaceHost}
                                openBookingDialog={openBookingDialog}
                            />
                        </Grid>
                    ))}
                </Grid>
                <BookingDialog
                    open={bookingDialogOpen}
                    workspaceHost={workspaceHost}
                    closeDialog={cancelBooking}
                />
            </MuiPickersUtilsProvider>
            <BookingNotification open={bookingNotificationOpen} closeNotification={closeNotification} />
        </Fragment>
    )
};

AvailableRooms.propTypes = {
    workspace: propTypes.shape({
        dateForAvailableRooms: propTypes.oneOfType([propTypes.string, propTypes.object]),
        availableRoomsStatus: propTypes.string,
        availableRoomsErrorMessage: propTypes.string,
        availableRooms: propTypes.arrayOf(propTypes.object),
        filteredRooms: propTypes.arrayOf(propTypes.object),
        searchedRoomName: propTypes.string,
        nextHourAvailability: propTypes.bool
    }),
    bookingDialogOpen: propTypes.bool.isRequired,
    bookingNotificationOpen: propTypes.bool.isRequired,
    match: propTypes.shape({
        params: propTypes.shape({
            workspace: propTypes.string
        })
    }).isRequired,

    getAvailableRooms: propTypes.func.isRequired,
    filterRoomsByName: propTypes.func.isRequired,
    filterRoomsByNextHourAvailability: propTypes.func.isRequired,
    initBooking: propTypes.func.isRequired,
    cancelBooking: propTypes.func.isRequired,
    closeNotification: propTypes.func.isRequired
}

const mapStateToProps = ({ workspaces, bookings }, { match }) => ({
    workspace: workspaces[match.params.workspace],
    bookingDialogOpen: bookings.bookingDialogOpen,
    bookingNotificationOpen: bookings.bookingStatus === statuses.LOADED,
});

const mapDispatchToProps = (dispatch, { match }) => {
    const workspaceHost = match.params.workspace;

    return {
        getAvailableRooms: (date) => dispatch(actions.getAvailableRooms(workspaceHost, date)),
        filterRoomsByName: (roomName) => dispatch(actions.filterRoomsByName(workspaceHost, roomName)),
        filterRoomsByNextHourAvailability: (checked) => dispatch(
            actions.filterRoomsByNextHourAvailability(workspaceHost, checked)
        ),
        initBooking: (roomProps, bookingDate) => dispatch(actions.initBooking(roomProps, bookingDate)),
        cancelBooking: () => dispatch(actions.cancelBooking()),
        closeNotification: () => dispatch(actions.setBookingStatus(statuses.INITIAL))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AvailableRooms);