import React from 'react';
import propTypes from 'prop-types';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    success: {
        backgroundColor: theme.palette.secondary.main,
    },
    icon: {
        fontSize: 20,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
}));

const BookingNotification = ({ open, closeNotification }) => {
    const classes = useStyles();
    const handleClose = (event, reason) => reason !== 'clickaway' && closeNotification();

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
        >
            <SnackbarContent
                className={classes.success}
                aria-describedby="client-snackbar"
                message={
                    <div id="client-snackbar" className={classes.message}>
                        <CheckCircleIcon className={classes.icon} />
                        The room booked successfully!
                    </div>
                }
            />
        </Snackbar>
    );
};

BookingNotification.propTypes = {
    open: propTypes.bool.isRequired,
    closeNotification: propTypes.func.isRequired
}

export default BookingNotification;
