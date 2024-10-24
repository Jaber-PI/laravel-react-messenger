import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import { Link, usePage } from "@inertiajs/react";
import GroupDescriptionPopover from "./GroupDescriptionPopover";
import GroupUsersPopover from "./GroupUsersPopover";
import { useState } from "react";
import { useEventBus } from "@/EventBus";

export default function ConversationHeader({ selectedConversation }) {
    const page = usePage();
    const authUser = page.props.auth.user;

    const [deletingGroup, setDeletingGroup] = useState(false);

    const { emit } = useEventBus();

    const onDeleteGroup = (group) => {
        if (deletingGroup) {
            return;
        }
        if (!window.confirm("Are You sure to delete this group?")) {
            return;
        }
        setDeletingGroup(true);
        axios
            .delete(route("group.destroy", group))
            .then((res) => {
                emit("toast.show", res.data.message);
                console.log("group deleted");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-6" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && (
                            <GroupAvatar group={selectedConversation} />
                        )}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="text-xs text-gray-500">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover
                                description={selectedConversation.description}
                            />
                            <GroupUsersPopover
                                users={selectedConversation.users}
                            />

                            {/* edit and delete goup tooltip  */}
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    {/* edit tooltip  */}
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={(ev) => {
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation
                                                );
                                            }}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <PencilSquareIcon className="w-4" />
                                        </button>
                                    </div>

                                    {/* delete tooltip  */}
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={() => {
                                                onDeleteGroup(
                                                    selectedConversation.id
                                                );
                                            }}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <TrashIcon className="w-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
