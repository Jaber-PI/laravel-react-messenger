import { PencilSquareIcon } from "@heroicons/react/24/solid";
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";
import { usePage } from "@inertiajs/react";

import { useEventBus } from "@/EventBus";

// import Echo from "laravel-echo";
import { useEffect, useState } from "react";

const ChatLayout = ({ user, header, children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);

    const [onlineUsers, setOnlineUsers] = useState({});

    const { on } = useEventBus();

    const isOnline = (userId) => onlineUsers[userId];

    // console.log("conversations", conversations);
    // console.log("selecetd conversation", selectedConversation);

    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conv) => {
                return conv.name.toLowerCase().includes(search);
            })
        );
    };

    const onMesssageCreated = (message) => {
        setLocalConversations((old) => {
            return old.map((conv) => {
                if (
                    message.receiver_id &&
                    !conv.is_group &&
                    (conv.id == message.sender_id ||
                        conv.id == message.receiver_id)
                ) {
                    conv.last_message = message.message;
                    conv.last_message_date = message.created_at;
                    return conv;
                }

                if (
                    message.group_id &&
                    conv.is_group &&
                    conv.id == message.group_id
                ) {
                    conv.last_message = message.message;
                    conv.last_message_date = message.created_at;
                    return conv;
                }

                return conv;
            });
        });
    };
    const onMesssageDeleted = ({ message, lastMessage }) => {
        setLocalConversations((old) => {
            return old.map((conv) => {
                if (
                    message.receiver_id &&
                    !conv.is_group &&
                    (conv.id == message.sender_id ||
                        conv.id == message.receiver_id)
                ) {
                    conv.last_message = lastMessage.message;
                    conv.last_message_date = lastMessage.created_at;
                    return conv;
                }
                if (
                    message.group_id &&
                    conv.is_group &&
                    conv.id == message.group_id
                ) {
                    conv.last_message = lastMessage.message;
                    conv.last_message_date = lastMessage.created_at;
                    return conv;
                }

                return conv;
            });
        });
    };

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                // if (a.blocked_at && b.blocked_at) {
                //     return a.blocked_at > b.blocked_at ? 1 : -1;
                // } else if (a.blocked_at) {
                //     return 1;
                // } else if (b.blocked_at) {
                //     return -1;
                // }
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        const offMessageCreated = on("message.created", onMesssageCreated);
        const offMessageDeleted = on("message.deleted", onMesssageDeleted);

        return () => {
            offMessageCreated();
            offMessageDeleted();
        };
    }, [on]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const newUsers = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers((previousUsers) => {
                    return { ...newUsers, ...previousUsers };
                });
            })
            .joining((user) => {
                setOnlineUsers((previousUsers) => {
                    previousUsers[user.id] = user;
                    return previousUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((previousUsers) => {
                    delete previousUsers[user.id];
                    return previousUsers;
                });
            })
            .error((error) => {
                // console.log("error", error);
            });

        return () => {
            Echo.leave("online");
        };
    }, []);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div
                    className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800
                flex flex-col overflow-hidden ${
                    selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                }`}
                >
                    <div className="flex items-center text-white justify-between py-2 px-3 text-xl font-medium">
                        My Conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new Group"
                        >
                            <button className="text-grey-400 hover:text-gray-200">
                                <PencilSquareIcon className="w-4  h-4 inline-block ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter conversations"
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1 overflow-auto h-100">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    }${conversation.id}`}
                                    conversation={conversation}
                                    online={!!isOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                                />
                            ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col">{children}</div>
            </div>
        </>
    );
};

export default ChatLayout;
