export const getStartAndEndTimeFromPeriod = (period, date) => {
    const [availStarts, availEnds] = period.split(' - ').map(time => time.split(':').map(Number));
    const startTime = date.hour(availStarts[0]).minute(availStarts[1]);
    const endTime = date.hour(availEnds[0]).minute(availEnds[1]);
    return { startTime, endTime };
};

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

export const throttle = (fn, wait) => {
    let inThrottle, lastFn, lastTime;
    return function () {
        const context = this,
            args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(function () {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
};