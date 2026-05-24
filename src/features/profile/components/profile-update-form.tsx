"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, ImageUpload01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import { handleRequestError } from "@/lib/api/handle-request-error";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { getUserInitials } from "@/core/helper";
import {
	useUpdateProfileImageMutation,
	useUpdateProfileMutation
} from "@/features/profile/actions/profile.mutations";
import {
	PROFILE_IMAGE_ACCEPT,
	type ProfileUpdateValues,
	profileUpdateSchema
} from "@/features/profile/schemas/profile.schema";

interface ProfileUpdateFormProps {
	user: User;
	setUser: (user: User | null) => void;
	router: ReturnType<typeof useRouter>;
}

export function ProfileUpdateForm({ user, setUser, router }: ProfileUpdateFormProps) {
	const updateProfileMutation = useUpdateProfileMutation();
	const updateProfileImageMutation = useUpdateProfileImageMutation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		control,
		setValue,
		resetField,
		formState: { errors }
	} = useForm<ProfileUpdateValues>({
		resolver: zodResolver(profileUpdateSchema),
		defaultValues: {
			name: user.name ?? "",
			phone: user.phone ?? "",
			avatar: null
		}
	});

	const { name: watchedName, phone: watchedPhone } = useWatch({ control });

	const isSaving = updateProfileMutation.isPending || updateProfileImageMutation.isPending;

	const displayName = user.name?.trim() || user.email || "User";
	const imageSrc = previewUrl ?? user.image ?? undefined;

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0] ?? null;
			setSelectedFile(file);
			setValue("avatar", file, { shouldValidate: true });

			if (file) {
				const url = URL.createObjectURL(file);
				setPreviewUrl(url);
			} else {
				setPreviewUrl(null);
			}
		},
		[setValue]
	);

	const handleClearSelectedImage = useCallback(() => {
		setSelectedFile(null);
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setPreviewUrl(null);
		setValue("avatar", null, { shouldValidate: true });
	}, [previewUrl, setValue]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	useEffect(() => {
		if (!selectedFile && fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [selectedFile]);

	const hasNameChange = watchedName?.trim() !== (user.name ?? "");
	const hasPhoneChange = watchedPhone?.trim() !== (user.phone ?? "");
	const hasAvatarChange = selectedFile !== null;
	const hasChanges = hasNameChange || hasPhoneChange || hasAvatarChange;
	const canSubmit = hasChanges && !isSaving && !errors.avatar;

	const onSubmit = useCallback(
		async (data: ProfileUpdateValues) => {
			let latestUser = user;

			try {
				if (hasNameChange || hasPhoneChange) {
					latestUser = await updateProfileMutation.mutateAsync({
						name: data.name?.trim() ?? "",
						phone: data.phone?.trim() ?? ""
					});
					setUser(latestUser);
					resetField("name");
					resetField("phone");
				}
			} catch (error) {
				handleRequestError(error, router, "Failed to update profile");
				return;
			}

			if (selectedFile) {
				try {
					latestUser = await updateProfileImageMutation.mutateAsync(selectedFile);
					setUser(latestUser);
					handleClearSelectedImage();
				} catch (error) {
					if (error instanceof ApiError && error.statusCode === 401) {
						handleRequestError(error, router, "Failed to upload profile image");
						return;
					}

					toast.error(
						hasNameChange || hasPhoneChange
							? "Profile details saved, but the image upload failed"
							: "Failed to upload profile image"
					);
					return;
				}
			}

			toast.success("Profile updated");
		},
		[
			user,
			hasNameChange,
			hasPhoneChange,
			selectedFile,
			updateProfileMutation,
			updateProfileImageMutation,
			setUser,
			router,
			resetField,
			handleClearSelectedImage
		]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
			<div className="flex flex-col flex-wrap gap-6 @md:flex-row">
				<div className="flex flex-col items-center gap-4">
					<Avatar className="size-32">
						<AvatarImage src={imageSrc} alt={displayName} />
						<AvatarFallback className="text-2xl">{getUserInitials(displayName)}</AvatarFallback>
					</Avatar>
					<input
						ref={fileInputRef}
						id="profile-avatar"
						type="file"
						accept={PROFILE_IMAGE_ACCEPT}
						onChange={handleFileChange}
						disabled={isSaving}
						hidden
					/>
					<Button
						type="button"
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						disabled={isSaving}
						className="self-center"
					>
						Choose file
					</Button>
					{selectedFile ? (
						<div className="flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm">
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
					<FieldError>{errors.avatar?.message}</FieldError>
					<FieldDescription>PNG, JPG, or WEBP up to 2MB.</FieldDescription>
				</div>

				<div className="flex min-w-0 flex-1 flex-col flex-wrap gap-6">
					<FieldGroup className="gap-5">
						<div className="grid min-w-20 gap-4 sm:grid-cols-2">
							<Field>
								<FieldLabel htmlFor="profile-name">Name</FieldLabel>
								<Input
									id="profile-name"
									{...register("name")}
									placeholder="Full name"
									disabled={isSaving}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="profile-email">Email</FieldLabel>
								<Input id="profile-email" type="email" value={user.email} disabled readOnly />
							</Field>
						</div>

						<Field className="min-w-20">
							<FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
							<Input
								id="profile-phone"
								type="tel"
								{...register("phone")}
								placeholder="+14155552671"
								disabled={isSaving}
							/>
						</Field>
					</FieldGroup>

					<div className="flex justify-end">
						<Button type="submit" disabled={!canSubmit}>
							{isSaving ? (
								<>
									<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
									Saving
								</>
							) : (
								<>
									<HugeiconsIcon icon={ImageUpload01Icon} data-icon="inline-start" />
									Save changes
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
}

