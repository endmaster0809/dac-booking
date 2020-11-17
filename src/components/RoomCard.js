import React from 'react';
import propTypes from 'prop-types';
import Carousel from 'nuka-carousel';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import BookmarkIcon from '@material-ui/icons/BookmarkRounded';

import Timebar from '../components/Timebar';

const RoomCard = (props) => {
    const { id, name, location, equipment, size, capacity, images, avail, isToday, isLaterThan19, workspaceHost, openBookingDialog } = props;
    return (
        <Card>
            <CardHeader
                title={`Room ${name}`}
                action={
                    <IconButton
                        aria-label={isLaterThan19 ? 'Booking is not available for today' : 'Book the room'}
                        title={isLaterThan19 ? 'Booking is not available for today' : 'Book the room'}
                        onClick={() => openBookingDialog({ id, name, avail })}
                        disabled={(isToday && isLaterThan19) || !avail.length}
                    >
                        <BookmarkIcon />
                    </IconButton>
                }
            />
            <Carousel>
                {images.map(image => (
                    <CardMedia
                        key={image}
                        component="img"
                        image={`https://${workspaceHost}/roombooking/${image}`}
                        title={`Room ${name}`}
                        height="140"
                    />
                ))}
            </Carousel>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Location:</b> {location}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Capacity:</b> {`${capacity} person${capacity > 1 ? 's' : ''}`}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Equipment:</b> {equipment.join(', ')}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Size:</b> {size}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="div">
                    <b>Availability:</b>
                    <Timebar availablePeriods={avail} />
                </Typography>
            </CardContent>
        </Card>
    )
}

RoomCard.propTypes = {
    id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    location: propTypes.string.isRequired,
    size: propTypes.string.isRequired,
    capacity: propTypes.number.isRequired,
    equipment: propTypes.arrayOf(propTypes.string).isRequired,
    images: propTypes.arrayOf(propTypes.string).isRequired,
    avail: propTypes.arrayOf(propTypes.string).isRequired,
    isToday: propTypes.bool.isRequired,
    isLaterThan19: propTypes.bool.isRequired,
    workspaceHost: propTypes.string.isRequired,
    openBookingDialog: propTypes.func.isRequired
}

export default RoomCard;
