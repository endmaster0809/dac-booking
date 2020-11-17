import React from 'react';
import propTypes from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const START_BOOKING_HOUR = 7;
const END_BOOKING_HOUR = 19;

const timeToHours = (time) => {
    const [HH, mm] = time.split(':').map(Number);
    return HH + mm / 60;
};

const hoursToPercents = (start, end) => (time) => {
    return (timeToHours(time) - start) / (end - start) * 100;
};

const timePeriodToStyles = (start, end) => (period) => {
    const getPercent = hoursToPercents(start, end);
    const [t1, t2] = period.split(' - ').map(getPercent);
    return {
        width: `${t2 - t1}%`,
        left: `${t1}%`
    }
};

const useStyles = makeStyles(theme => ({
    timebar: {
        position: 'relative',
        padding: 0,
        margin: 0,
        height: '0.8em',
        width: '100%',
        backgroundColor: theme.palette.error.main,
        cursor: 'not-allowed',
        display: 'flex',
        justifyContent:'space-between'
    },
    availableSlot: {
        position: 'absolute',
        height: '0.8em',
        background: theme.palette.secondary.main,
        cursor: 'pointer'
    },
    timeMesh: {
        position: 'relative',
        background: 'transparent',
        height: '0.8em',
        borderRight: '1px #ccc solid',
        boxSizing: 'border-box',
        zIndex: 1
    },
    timeMeshValue: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translate(-50%, 50%)',
        fontSize: '0.8em'
    }
}));

const Timebar = ({ availablePeriods, startTime = START_BOOKING_HOUR, endTime = END_BOOKING_HOUR }) => {
    const classes = useStyles();
    const theme = useTheme();
    const smallViewPort = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div className={classes.timebar} title="Booking is not available">
            {availablePeriods.map((period, index) => {
                const getStyles = timePeriodToStyles(startTime, endTime);
                return (
                    <div key={`${period}-${index}`}
                        className={classes.availableSlot}
                        style={getStyles(period)}
                        title={`Booking available at ${period}`}
                    />
                )
            })}
            {Array(endTime - startTime + 1).fill(startTime).map((s, i) => (
                <div key={`time-mesh-${i}`} className={classes.timeMesh}>
                    <span className={classes.timeMeshValue}>{s + i}{!smallViewPort && ':00'}</span>
                </div>
            ))}
        </div>
    )
};

Timebar.propTypes = {
    availablePeriods: propTypes.arrayOf(propTypes.string).isRequired,
    startTime: propTypes.oneOfType([propTypes.string, propTypes.object]),
    endTime: propTypes.oneOfType([propTypes.string, propTypes.object])
}

export default Timebar;
