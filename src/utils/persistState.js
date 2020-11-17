export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        window.localStorage.setItem('dacRoomBookingApp', serializedState);
    } catch (error) {
        console.error(error);
    }
};

export const loadState = () => {
    try {
        const serializedState = window.localStorage.getItem('dacRoomBookingApp');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        return undefined;
    }
};