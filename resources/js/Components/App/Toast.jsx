import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

export default function Toast() {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("toast.show", (message) => {
            const uuid = uuidv4();
            setToasts((old) => {
                return [...old, { message, uuid }];
            });
            setTimeout(() => {
                setToasts((old) => old.filter((toast) => toast.uuid !== uuid));
            },4000);
        });
    }, [on]);

    return (
        <div className="toast">
            {toasts.map((toast) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success py-3 px-4 text-gray-100 rounded-md min-w-[280px]"
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
