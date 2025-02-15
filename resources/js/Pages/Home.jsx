import ChatLayout from "@/Layouts/ChatLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageInput from "@/Components/App/MessageInput";
import MessageItem from "@/Components/App/MessageItem";
import { useEventBus } from "@/EventBus";
import axios from "axios";
import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal";

const Home = ({ messages = null, selectedConversation = null }) => {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);

    const [scrollFromBottom, setScrollFromBottom] = useState(null);

    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});

    const onAttachmentClick = (attachments, index) => {
        setPreviewAttachment({
            attachments,
            index,
        });
        setShowAttachmentPreview(true);
    };

    const messagesCtrRef = useRef(null);
    const loadOlderIntersect = useRef(null);

    const { on } = useEventBus();

    const loadOlderMessages = () => {
        const firstMesage = localMessages[0];
        if (noMoreMessages) {
            return;
        }
        axios
            .get(route("chat.loadOlder", firstMesage.id))
            .then(({ data }) => {
                data = data.data;
                if (data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }

                // how much is scrolled
                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;

                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                setLocalMessages((old) => {
                    return [...data.reverse(), ...old];
                });
            })
            .catch((error) => {
                // console.log(error.message);
            });
    };

    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        } else if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    };
    const messageDeleted = ({ message }) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) =>
                prevMessages.filter((ele) => ele.id != message.id)
            );
        } else if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ) {
            setLocalMessages((prevMessages) =>
                prevMessages.filter((ele) => ele.id != message.id)
            );
        }
    };

    useEffect(() => {
        if(!selectedConversation) {
            return;
        }
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        const offMessageCreated = on("message.created", messageCreated);
        const offMessageDeleted = on("message.deleted", messageDeleted);

        return () => {
            offMessageCreated();
            offMessageDeleted();
        };
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        if(!messagesCtrRef.current) {
            return;
        }
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                scrollFromBottom -
                messagesCtrRef.current.offsetHeight;
        }
        if (noMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(
                (entry) => entry.isIntersecting && loadOlderMessages()
            ),
                {
                    rootMargin: "0px 0px 250px 0px",
                };
        });
        if (loadOlderIntersect.current) {
            setTimeout(() => {
                observer.observe(loadOlderIntersect.current);
            }, 100);
        }

        return () => {
            observer.disconnect();
        };
    }, [localMessages, noMoreMessages]);

    return (
        <>
            {messages == null && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select a conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}

            {messages != null && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >
                        {/* messages  */}
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">
                                    No Messages found
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex-1 flex-col flex">
                                <div ref={loadOlderIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        attachmentClick={onAttachmentClick}
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
            {/* attachments preview modal  */}
            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.index}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
};

Home.layout = (page) => (
    <AuthenticatedLayout>
        <ChatLayout children={page}></ChatLayout>
    </AuthenticatedLayout>
);

export default Home;
