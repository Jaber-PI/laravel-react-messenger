import { UsersIcon } from "@heroicons/react/24/solid";

const GroupAvatar = ({profile = false}) => {
    let sizeClass = profile ? "w-40" : "w-8";

    return (
        <>
            <div className={`chat-image avatar placeholder`}>
                <div
                    className={`bg-gray-400 text-gray-800 rounded-full ${sizeClass}`}
                >
                    <span className="text-xl">
                        <UsersIcon className="w-4" />
                    </span>
                </div>
            </div>
        </>
    );
};

export default GroupAvatar;
