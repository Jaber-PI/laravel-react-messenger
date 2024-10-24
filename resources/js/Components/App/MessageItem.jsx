import ReactMarkdown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";

import { formatMessageDateLong } from "@/helpers";
import { usePage } from "@inertiajs/react";
import MessageAttachments from "./MessageAttachments";
import MessageOptionsDropdown from "./MessageOptionsDropDown";

export default function MessageItem({ message, attachmentClick }) {
    const currentUser = usePage().props.auth.user;

    return (
        <div
            className={
                "chat " +
                (message.sender_id === currentUser.id
                    ? "chat-start"
                    : "chat-end")
            }
        >
            <UserAvatar user={message.sender} />
            <div className="chat-header text-gray-300">
                {message.sender_id !== currentUser.id
                    ? message.sender.name
                    : ""}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>
            <div
                className={
                    "chat-bubble relative flex justify-between " +
                    (message.sender_id === currentUser.id
                        ? "chat-bubble-info"
                        : "")
                }
            >
                <MessageOptionsDropdown message={message} dropLeft={message.sender_id === currentUser.id} />
                <div className="chat-message">
                    <div className="chat-message-content">
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                    {message.attachments && (
                        <MessageAttachments
                            attachments={message.attachments}
                            attachmentClick={attachmentClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
