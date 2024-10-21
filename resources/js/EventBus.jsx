import React from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
    const [events, setEvents] = React.useState({});

    const emit = (name, data) => {
        // console.log(events[name]);

        if (events[name]) {
            for (let handler of events[name]) {
                handler(data);
            }
        }
    };
    const on = (name, cb) => {
        if (!events[name]) {
            events[name] = [];
        }
        events[name].push(cb);

        return () => {
            if (events[name]) {
                events[name] = events[name].filter((e) => e !== cb);
            }
        };
    };

    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBus = () => {
    return React.useContext(EventBusContext);
};
