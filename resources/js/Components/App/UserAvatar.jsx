const UserAvatar = ({user, online = null, profile = false}) => {
    let onlineClass =
        online === true ? "online" : online === false ? "offline" : "";
    let sizeClass = profile ? "w-40" : "w-8";

    return (
        <>
            {user.avatar && (
                <div className={`chat-image avatar ${onlineClass}`}>
                    <div className={`rounded-full ${sizeClass}`}>
                        <img src={user.avatar} alt="JB" />
                    </div>
                </div>
            )}
            {!user.avatar && (
                <div className={`chat-image avatar placeholder ${onlineClass}`}>
                    <div className={`bg-gray-400 items-center text-gray-800 rounded-full ${sizeClass}`}>
                        <span className="text-xl">
                            {user.name.toUpperCase().substring(0,1)}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatar;
