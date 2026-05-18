import { Cancel01Icon, ImageUpload01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { getUserInitials } from "@/core/helper";
import {
	useUpdateProfileImageMutation,
	useUpdateProfileMutation
} from "@/features/profile/actions/profile.mutations";
import { route } from "@/routes/routes";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ACCEPTED_AVATAR_EXTENSIONS = ".png,.jpg,.jpeg,.webp";

interface ProfileUpdateFormProps {
	user: User;
	setUser: (user: User | null) => void;
	router: ReturnType<typeof useRouter>;
}

function isUnauthorizedError(error: unknown): boolean {
	return error instanceof ApiError && error.statusCode === 401;
}

function handleRequestError(
	error: unknown,
	router: ReturnType<typeof useRouter>,
	fallback: string
) {
	if (isUnauthorizedError(error)) {
		toast.error("Please sign in again");
		router.replace(route.protected.login);
		return;
	}

	toast.error(error instanceof ApiError ? error.message : fallback);
}

export function ProfileUpdateForm({ user, setUser, router }: ProfileUpdateFormProps) {
	const updateProfileMutation = useUpdateProfileMutation();
	const updateProfileImageMutation = useUpdateProfileImageMutation();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [name, setName] = useState(user.name ?? "");
	const [phone, setPhone] = useState(user.phone ?? "");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileError, setFileError] = useState<string | null>(null);

	const previewUrl = useMemo(() => {
		if (!selectedFile) return null;
		return URL.createObjectURL(selectedFile);
	}, [selectedFile]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const isSaving = updateProfileMutation.isPending || updateProfileImageMutation.isPending;
	const normalizedName = name.trim();
	const normalizedPhone = phone.trim();
	const hasProfileChanges =
		normalizedName !== (user.name ?? "") || normalizedPhone !== (user.phone ?? "");
	const canSubmit = !isSaving && !fileError && Boolean(hasProfileChanges || selectedFile);
	const displayName = user.name?.trim() || user.email || "User";
	const imageSrc = previewUrl ?? user.image ?? undefined;

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) {
			setSelectedFile(null);
			setFileError(null);
			return;
		}

		const validationError = validateAvatarFile(file);
		if (validationError) {
			setSelectedFile(null);
			setFileError(validationError);
			event.target.value = "";
			return;
		}

		setSelectedFile(file);
		setFileError(null);
	};

	const handleClearSelectedImage = () => {
		setSelectedFile(null);
		setFileError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!canSubmit) return;

		const avatarFile = selectedFile;
		let latestUser = user;

		try {
			if (hasProfileChanges) {
				latestUser = await updateProfileMutation.mutateAsync({
					name: normalizedName,
					phone: normalizedPhone
				});
				setUser(latestUser);
				setName(latestUser.name ?? "");
				setPhone(latestUser.phone ?? "");
			}
		} catch (error) {
			handleRequestError(error, router, "Failed to update profile");
			return;
		}

		if (avatarFile) {
			try {
				latestUser = await updateProfileImageMutation.mutateAsync(avatarFile);
				setUser(latestUser);
				handleClearSelectedImage();
			} catch (error) {
				if (isUnauthorizedError(error)) {
					handleRequestError(error, router, "Failed to upload profile image");
					return;
				}

				toast.error(
					hasProfileChanges
						? "Profile details saved, but the image upload failed"
						: "Failed to upload profile image"
				);
				return;
			}
		}

		toast.success("Profile updated");
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-6">
			<FieldGroup className="gap-5">
				<Field>
					<FieldLabel htmlFor="profile-avatar">Profile image</FieldLabel>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<Avatar className="size-20" size="lg">
							<AvatarImage src={imageSrc} alt={displayName} />
							<AvatarFallback className="text-lg">{getUserInitials(displayName)}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 gap-2">
							<Input
								ref={fileInputRef}
								id="profile-avatar"
								type="file"
								accept={ACCEPTED_AVATAR_EXTENSIONS}
								onChange={handleFileChange}
								disabled={isSaving}
							/>
							<FieldDescription>PNG, JPG, or WEBP up to 2MB.</FieldDescription>
							{selectedFile ? (
								<div className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm">
									<span className="truncate">{selectedFile.name}</span>
									<Button
										type="button"
										variant="ghost"
										size="icon-xs"
										onClick={handleClearSelectedImage}
										disabled={isSaving}
										aria-label="Clear selected profile image"
									>
										<HugeiconsIcon icon={Cancel01Icon} />
									</Button>
								</div>
							) : null}
							<FieldError>{fileError}</FieldError>
						</div>
					</div>
				</Field>

				<div className="grid gap-4 sm:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="profile-name">Name</FieldLabel>
						<Input
							id="profile-name"
							value={name}
							onChange={event => setName(event.target.value)}
							placeholder="Full name"
							disabled={isSaving}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="profile-email">Email</FieldLabel>
						<Input id="profile-email" type="email" value={user.email} disabled readOnly />
					</Field>
				</div>

				<Field>
					<FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
					<Input
						id="profile-phone"
						type="tel"
						value={phone}
						onChange={event => setPhone(event.target.value)}
						placeholder="+14155552671"
						disabled={isSaving}
					/>
				</Field>
			</FieldGroup>

			<div className="flex justify-end">
				<Button type="submit" disabled={!canSubmit}>
					{isSaving ? (
						<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
					) : (
						<HugeiconsIcon icon={ImageUpload01Icon} data-icon="inline-start" />
					)}
					{isSaving ? "Saving" : "Save changes"}
				</Button>
			</div>
		</form>
	);
}

function validateAvatarFile(file: File): string | null {
	if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
		return "Choose a PNG, JPG, or WEBP image.";
	}

	if (file.size > MAX_AVATAR_BYTES) {
		return "Choose an image smaller than 2MB.";
	}

	return null;
}

