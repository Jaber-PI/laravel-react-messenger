import moment from "moment";

export const formatMessageDateLong = (date) => {
    const now = new Date();
    const inputDate = new Date(date);
    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterday(inputDate)) {
        return (
            "Yesterday " +
            inputDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleTimeString([], {
            day: "2-digit",
            month: "short",
        });
    } else {
        return inputDate.toLocaleDateString();
    }
};

export const formatMessageDateShort = (date) => {
    const now = new Date();
    const inputDate = new Date(date);
    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterday(inputDate)) {
        return;
        ("Yesterday ");
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleTimeString([], {
            day: "2-digit",
            month: "short",
        });
    } else {
        return inputDate.toLocaleDateString();
    }
};

export const isToday = (date) => {
    const today = moment();
    return today.diff(moment(date), "days") === 0;
};

export const isYesterday = (date) => {
    const today = moment();

    return today.diff(moment(date), "days") === 1;
};

export const isImage = (file) => {
    let mime = file.mime || file.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "image";
};
export const isVideo = (file) => {
    let mime = file.mime || file.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "video";
};
export const isAudio = (file) => {
    let mime = file.mime || file.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "audio";
};

export const isPdf = (file) => {
    let mime = file.mime || file.type;
    return mime.toLowerCase() === "application/pdf";
};
export const isPreviewable = (file) => {
    return isImage(file) || isAudio(file) || isPdf(file) || isVideo(file);
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    let i = 0;

    while (bytes >= k) {
        bytes /= k;
        i++;
    }

    return parseFloat(bytes.toFixed(dm) + " " + sizes[i]);
};
