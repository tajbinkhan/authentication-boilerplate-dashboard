"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback } from "react";
import type { HTMLInputTypeAttribute } from "react";
import {
	Controller,
	FormProvider,
	useForm,
	useFormContext,
	useWatch
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
	useCreateProviderMutation,
	useUpdateProviderMutation
} from "@/features/smtp-providers/actions/smtp-provider.mutations";
import type {
	AwsSesConfig,
	BrevoConfig,
	EmailProviderType,
	NodemailerConfig,
	ResendConfig,
	SmtpProvider
} from "@/features/smtp-providers/types/smtp-provider.types";
import { ApiError } from "@/lib/api/errors";

interface SmtpProviderFormSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	provider?: SmtpProvider | null;
}

interface SmtpProviderFormFieldsProps {
	idPrefix: string;
	isEditing: boolean;
	disabled: boolean;
}

interface SmtpProviderFormValues {
	name: string;
	providerType: EmailProviderType;
	brevoApiKey: string;
	brevoSenderEmail: string;
	brevoSenderName: string;
	resendApiKey: string;
	resendSenderEmail: string;
	resendSenderName: string;
	nodemailerHost: string;
	nodemailerPort: number;
	nodemailerSecure: boolean;
	nodemailerUser: string;
	nodemailerPass: string;
	nodemailerSenderEmail: string;
	nodemailerSenderName: string;
	awsAccessKeyId: string;
	awsSecretAccessKey: string;
	awsRegion: string;
	awsSenderEmail: string;
	awsSenderName: string;
}

type InputFieldName = Exclude<
	keyof SmtpProviderFormValues,
	"providerType" | "nodemailerSecure"
>;

interface ControlledInputFieldProps {
	name: InputFieldName;
	id: string;
	label: string;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	disabled?: boolean;
	valueAsNumber?: boolean;
}

const MASKED_VALUE = "••••••••";

const PROVIDER_TYPE_OPTIONS: Array<{ value: EmailProviderType; label: string }> = [
	{ value: "brevo", label: "Brevo" },
	{ value: "resend", label: "Resend" },
	{ value: "nodemailer", label: "SMTP (Nodemailer)" },
	{ value: "aws-ses", label: "AWS SES" }
];

export function SmtpProviderFormSheet({
	open,
	onOpenChange,
	provider
}: SmtpProviderFormSheetProps) {
	const isEditing = !!provider;
	const createMutation = useCreateProviderMutation();
	const updateMutation = useUpdateProviderMutation();
	const isPending = createMutation.isPending || updateMutation.isPending;

	const form = useForm<SmtpProviderFormValues>({
		defaultValues: getDefaultValues(provider)
	});

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				form.reset(getDefaultValues(provider));
			}
			onOpenChange(nextOpen);
		},
		[provider, form, onOpenChange]
	);

	const buildConfig = (values: SmtpProviderFormValues): Record<string, unknown> => {
		switch (values.providerType) {
			case "brevo": {
				const config: Record<string, unknown> = {
					apiKey: values.brevoApiKey === MASKED_VALUE && isEditing ? "" : values.brevoApiKey,
					senderEmail: values.brevoSenderEmail,
					senderName: values.brevoSenderName
				};
				if (isEditing && values.brevoApiKey === MASKED_VALUE) {
					delete config.apiKey;
				}
				return config;
			}
			case "resend": {
				const config: Record<string, unknown> = {
					apiKey:
						values.resendApiKey === MASKED_VALUE && isEditing ? "" : values.resendApiKey,
					senderEmail: values.resendSenderEmail,
					senderName: values.resendSenderName
				};
				if (isEditing && values.resendApiKey === MASKED_VALUE) {
					delete config.apiKey;
				}
				return config;
			}
			case "nodemailer": {
				const config: Record<string, unknown> = {
					host: values.nodemailerHost,
					port: values.nodemailerPort,
					secure: values.nodemailerSecure,
					auth: {
						user: values.nodemailerUser,
						pass:
							values.nodemailerPass === MASKED_VALUE && isEditing
								? ""
								: values.nodemailerPass
					},
					senderEmail: values.nodemailerSenderEmail,
					senderName: values.nodemailerSenderName
				};
				if (isEditing && values.nodemailerPass === MASKED_VALUE) {
					delete (config.auth as Record<string, unknown>).pass;
				}
				return config;
			}
			case "aws-ses": {
				const config: Record<string, unknown> = {
					accessKeyId:
						values.awsAccessKeyId === MASKED_VALUE && isEditing ? "" : values.awsAccessKeyId,
					secretAccessKey:
						values.awsSecretAccessKey === MASKED_VALUE && isEditing
							? ""
							: values.awsSecretAccessKey,
					region: values.awsRegion,
					senderEmail: values.awsSenderEmail,
					senderName: values.awsSenderName
				};
				if (isEditing && values.awsAccessKeyId === MASKED_VALUE) {
					delete config.accessKeyId;
				}
				if (isEditing && values.awsSecretAccessKey === MASKED_VALUE) {
					delete config.secretAccessKey;
				}
				return config;
			}
		}
	};

	const onSubmit = async (values: SmtpProviderFormValues) => {
		const name = values.name.trim();
		if (!name) {
			toast.error("Name is required");
			return;
		}

		const config = buildConfig(values);

		try {
			if (isEditing && provider) {
				await updateMutation.mutateAsync({
					id: provider.id,
					name,
					config
				});
				toast.success("Provider updated");
			} else {
				await createMutation.mutateAsync({
					name,
					providerType: values.providerType,
					config
				});
				toast.success("Provider created");
			}
			handleOpenChange(false);
		} catch (error) {
			const message = error instanceof ApiError ? error.message : "Failed to save provider";
			toast.error(message);
		}
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent key={provider?.id ?? "create"} className="flex flex-col sm:max-w-lg">
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex min-h-0 flex-1 flex-col"
					>
						<SheetHeader>
							<SheetTitle>{isEditing ? "Edit Provider" : "Add SMTP Provider"}</SheetTitle>
							<SheetDescription>
								{isEditing
									? "Update the provider configuration. Leave sensitive fields unchanged to keep existing values."
									: "Configure a new email provider for sending application emails."}
							</SheetDescription>
						</SheetHeader>

						<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
							<SmtpProviderFormFields
								idPrefix={provider ? `smtp-provider-${provider.id}` : "smtp-provider-create"}
								isEditing={isEditing}
								disabled={isPending}
							/>
						</div>

						<SheetFooter className="sm:justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<HugeiconsIcon icon={Loading03Icon} data-icon="inline-start" />
										{isEditing ? "Saving..." : "Creating..."}
									</>
								) : isEditing ? (
									"Save Changes"
								) : (
									"Create Provider"
								)}
							</Button>
						</SheetFooter>
					</form>
				</FormProvider>
			</SheetContent>
		</Sheet>
	);
}

function SmtpProviderFormFields({
	idPrefix,
	isEditing,
	disabled
}: SmtpProviderFormFieldsProps) {
	const { control } = useFormContext<SmtpProviderFormValues>();
	const providerType = useWatch({ control, name: "providerType" });

	return (
		<FieldGroup className="gap-4">
			<ControlledInputField
				name="name"
				id={`${idPrefix}-name`}
				label="Name"
				placeholder="Production Brevo"
				disabled={disabled}
			/>

			{!isEditing ? (
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-provider-type`}>Provider Type</FieldLabel>
					<Controller
						name="providerType"
						control={control}
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={value => field.onChange(value as EmailProviderType)}
								disabled={disabled}
							>
								<SelectTrigger id={`${idPrefix}-provider-type`} className="w-full">
									<SelectValue placeholder="Select provider type" />
								</SelectTrigger>
								<SelectContent>
									{PROVIDER_TYPE_OPTIONS.map(option => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</Field>
			) : null}

			{providerType === "brevo" ? (
				<>
					<ControlledInputField
						name="brevoApiKey"
						id={`${idPrefix}-brevo-api-key`}
						label="API Key"
						type="password"
						placeholder="xkeysib-..."
						disabled={disabled}
					/>
					<ControlledInputField
						name="brevoSenderEmail"
						id={`${idPrefix}-brevo-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="brevoSenderName"
						id={`${idPrefix}-brevo-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
				</>
			) : null}

			{providerType === "resend" ? (
				<>
					<ControlledInputField
						name="resendApiKey"
						id={`${idPrefix}-resend-api-key`}
						label="API Key"
						type="password"
						placeholder="re_..."
						disabled={disabled}
					/>
					<ControlledInputField
						name="resendSenderEmail"
						id={`${idPrefix}-resend-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="resendSenderName"
						id={`${idPrefix}-resend-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
				</>
			) : null}

			{providerType === "nodemailer" ? (
				<>
					<div className="grid gap-4 sm:grid-cols-2">
						<ControlledInputField
							name="nodemailerHost"
							id={`${idPrefix}-nodemailer-host`}
							label="Host"
							placeholder="smtp.example.com"
							disabled={disabled}
						/>
						<ControlledInputField
							name="nodemailerPort"
							id={`${idPrefix}-nodemailer-port`}
							label="Port"
							type="number"
							placeholder="587"
							disabled={disabled}
							valueAsNumber
						/>
					</div>
					<Field
						orientation="horizontal"
						className="items-center justify-between rounded-2xl border p-3"
					>
						<div>
							<FieldLabel htmlFor={`${idPrefix}-nodemailer-secure`}>Use SSL/TLS</FieldLabel>
							<FieldDescription>Enable secure SMTP connections.</FieldDescription>
						</div>
						<Controller
							name="nodemailerSecure"
							control={control}
							render={({ field }) => (
								<Switch
									id={`${idPrefix}-nodemailer-secure`}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={disabled}
								/>
							)}
						/>
					</Field>
					<ControlledInputField
						name="nodemailerUser"
						id={`${idPrefix}-nodemailer-user`}
						label="Username"
						disabled={disabled}
					/>
					<ControlledInputField
						name="nodemailerPass"
						id={`${idPrefix}-nodemailer-pass`}
						label="Password"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="nodemailerSenderEmail"
						id={`${idPrefix}-nodemailer-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="nodemailerSenderName"
						id={`${idPrefix}-nodemailer-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
				</>
			) : null}

			{providerType === "aws-ses" ? (
				<>
					<ControlledInputField
						name="awsAccessKeyId"
						id={`${idPrefix}-aws-access-key-id`}
						label="Access Key ID"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsSecretAccessKey"
						id={`${idPrefix}-aws-secret-access-key`}
						label="Secret Access Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsRegion"
						id={`${idPrefix}-aws-region`}
						label="Region"
						placeholder="us-east-1"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsSenderEmail"
						id={`${idPrefix}-aws-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsSenderName"
						id={`${idPrefix}-aws-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
				</>
			) : null}
		</FieldGroup>
	);
}

function ControlledInputField({
	name,
	id,
	label,
	type = "text",
	placeholder,
	disabled,
	valueAsNumber = false
}: ControlledInputFieldProps) {
	const { control } = useFormContext<SmtpProviderFormValues>();

	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Input
						id={id}
						type={type}
						name={field.name}
						ref={field.ref}
						value={formatInputValue(field.value)}
						onBlur={field.onBlur}
						onChange={event =>
							field.onChange(
								valueAsNumber
									? parseNumberInput(event.currentTarget.value, event.currentTarget.valueAsNumber)
									: event.currentTarget.value
							)
						}
						placeholder={placeholder}
						disabled={disabled}
					/>
				)}
			/>
		</Field>
	);
}

function parseNumberInput(value: string, valueAsNumber: number): number {
	return value === "" ? Number.NaN : valueAsNumber;
}

function formatInputValue(value: string | number): string | number {
	if (typeof value === "number" && Number.isNaN(value)) {
		return "";
	}

	return value;
}

function getDefaultValues(provider: SmtpProvider | null | undefined): SmtpProviderFormValues {
	if (provider) {
		const config = provider.config as Record<string, unknown>;
		return {
			name: provider.name,
			providerType: provider.providerType,
			brevoApiKey: MASKED_VALUE,
			brevoSenderEmail: (config as unknown as BrevoConfig)?.senderEmail ?? "",
			brevoSenderName: (config as unknown as BrevoConfig)?.senderName ?? "",
			resendApiKey: MASKED_VALUE,
			resendSenderEmail: (config as unknown as ResendConfig)?.senderEmail ?? "",
			resendSenderName: (config as unknown as ResendConfig)?.senderName ?? "",
			nodemailerHost: (config as unknown as NodemailerConfig)?.host ?? "",
			nodemailerPort: (config as unknown as NodemailerConfig)?.port ?? 587,
			nodemailerSecure: (config as unknown as NodemailerConfig)?.secure ?? false,
			nodemailerUser: (config as unknown as NodemailerConfig)?.auth?.user ?? "",
			nodemailerPass: MASKED_VALUE,
			nodemailerSenderEmail: (config as unknown as NodemailerConfig)?.senderEmail ?? "",
			nodemailerSenderName: (config as unknown as NodemailerConfig)?.senderName ?? "",
			awsAccessKeyId: (config as unknown as AwsSesConfig)?.accessKeyId ?? "",
			awsSecretAccessKey: MASKED_VALUE,
			awsRegion: (config as unknown as AwsSesConfig)?.region ?? "",
			awsSenderEmail: (config as unknown as AwsSesConfig)?.senderEmail ?? "",
			awsSenderName: (config as unknown as AwsSesConfig)?.senderName ?? ""
		};
	}

	return {
		name: "",
		providerType: "brevo",
		brevoApiKey: "",
		brevoSenderEmail: "",
		brevoSenderName: "",
		resendApiKey: "",
		resendSenderEmail: "",
		resendSenderName: "",
		nodemailerHost: "",
		nodemailerPort: 587,
		nodemailerSecure: false,
		nodemailerUser: "",
		nodemailerPass: "",
		nodemailerSenderEmail: "",
		nodemailerSenderName: "",
		awsAccessKeyId: "",
		awsSecretAccessKey: "",
		awsRegion: "",
		awsSenderEmail: "",
		awsSenderName: ""
	};
}
