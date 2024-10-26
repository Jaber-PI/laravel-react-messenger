import InputError from "../InputError";
import InputLabel from "../InputLabel";
import Modal from "../Modal";
import TextInput from "../TextInput";

import PrimaryButton from "../PrimaryButton";

import { useForm, usePage } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";
import UserAvatar from "./UserAvatar";
import { Transition } from "@headlessui/react";
import Checkbox from "../Checkbox";
import SecondaryButton from "../SecondaryButton";

export default function NewUserModal({ show = false, onClose = () => {} }) {
    const { emit } = useEventBus();

    const {
        data,
        setData,
        post,
        errors,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        avatar: null,
        name: "",
        email: "",
        is_admin: false,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("user.store"), {
            onSuccess: () => {
                closeModal();
                emit("toast.show", `User "${data.name}" was added`);
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={submit} className="mt-6 space-y-6 p-5">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <label className="flex items-center">
                        <Checkbox
                            name="is_admin"
                            checked={data.is_admin}
                            onChange={(e) => {
                                setData("is_admin", e.target.checked);
                            }}
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Admin User
                        </span>
                    </label>
                    <InputError className="mt-2" message={errors.is_admin} />
                </div>

                <div>
                    <InputLabel htmlFor="avatar" value="avatar" />

                    <input
                        type="file"
                        onChange={(e) => setData("avatar", e.target.files[0])}
                        className="file-input mt-1 block file-input-bordered w-full"
                    />

                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        Create
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
