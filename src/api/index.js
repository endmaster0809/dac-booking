import axios from 'axios';

export const API = url => axios.create({ baseURL: `https://${url.trim()}/roombooking` });

export const getWorkspaceInfo = (workspaceHost) =>
    API(workspaceHost).get('/workspace')
        .then(response => response)
        .catch(err => ({ err }))

export const getRooms = (workspaceHost, date) =>
    API(workspaceHost).post(`/getrooms`, { date })
        .then(response => response)
        .catch(err => ({ err }))

export const bookRoom = (workspaceHost, bookingInfo) =>
    API(workspaceHost).post(`/sendpass`, bookingInfo)
        .then(response => response)
        .catch(err => ({ err }))