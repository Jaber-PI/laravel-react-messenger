import React from "react";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import { formatBytes, isPdf, isPreviewable } from "@/helpers";

const AttachmentPreview = ({ file }) => {
    return (
        <div className="w-full flex items-center gap-2 py-2 rounded-md bg-slate-800">
            <div className="">
                {isPdf(file.file) && <img src="/img/pdf.png" className="w-8" />}
                {!isPreviewable(file.file) && (
                    <div className="flex justify-center items-center w-10 bg-gray-700 rounded">
                        <PaperClipIcon className="w-6" />
                    </div>
                )}
            </div>
            <div className="flex-1 text-gray-400 text-nowrap text-ellipsis overflow-hidden">
                <h3>{file.file.name}</h3>
                <p className="text-xs">{formatBytes(file.file.size)}</p>
            </div>
        </div>
    );
};

export default AttachmentPreview;
