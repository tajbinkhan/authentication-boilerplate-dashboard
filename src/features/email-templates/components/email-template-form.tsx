"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft01Icon,
	Loading03Icon,
	SaveIcon,
	VariableIcon,
	ViewIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { Controller, FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";

import { ApiError } from "@/lib/api/errors";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateEmailTemplateMutation } from "@/features/email-templates/actions/email-template.mutations";
import {
	type EmailTemplateFormValues,
	emailTemplateFormSchema
} from "@/features/email-templates/schemas/email-template-form.schema";
import type { EmailTemplate } from "@/features/email-templates/types/email-template.types";

const HANDLEBARS_TAG_PATTERN = /\{\{\{?\s*([^{}]+?)\s*\}?\}\}/g;
const BLOCK_HELPERS = new Set(["each", "if", "unless", "with"]);

export function extractHandlebarsVariables(content: string): string[] {
	const variables = new Set<string>();
	const matches = content.matchAll(HANDLEBARS_TAG_PATTERN);

	for (const [, tagBody] of matches) {
		const variable = getHandlebarsVariable(tagBody);
		if (variable) variables.add(variable);
	}

	return [...variables].sort();
}

function getHandlebarsVariable(tagBody: string): string | null {
	const tokens = tagBody.replace(/~/g, "").trim().split(/\s+/);
	const [rawToken, helperValue] = tokens;

	if (!rawToken || rawToken.startsWith("/") || rawToken === "else") return null;

	const helperName = rawToken.replace(/^#/, "");
	const variable = BLOCK_HELPERS.has(helperName)
		? helperValue
		: tokens.length === 1
			? rawToken
			: null;

	if (!variable || !/^[\w.]+$/.test(variable)) return null;
	if (BLOCK_HELPERS.has(variable) || variable === "else") return null;

	return variable;
}

function VariableBadge({ name }: { name: string }) {
	return (
		<Badge variant="outline" className="font-mono text-xs">
			<HugeiconsIcon icon={VariableIcon} className="size-3" />
			{name}
		</Badge>
	);
}

interface EmailTemplateFormProps {
	template: EmailTemplate;
	onSuccess: () => void;
	onCancel: () => void;
}

export function EmailTemplateForm({ template, onSuccess, onCancel }: EmailTemplateFormProps) {
	const updateMutation = useUpdateEmailTemplateMutation();
	const isPending = updateMutation.isPending;

	const form = useForm<EmailTemplateFormValues>({
		resolver: zodResolver(emailTemplateFormSchema),
		defaultValues: getDefaultValues(template),
		mode: "onChange"
	});
	const [subject = "", html = "", text = ""] = useWatch({
		control: form.control,
		name: ["subject", "html", "text"]
	});
	const {
		formState: { errors, isDirty }
	} = form;

	const allVariables = useMemo(() => {
		const subjectVars = extractHandlebarsVariables(subject);
		const htmlVars = extractHandlebarsVariables(html);
		const textVars = extractHandlebarsVariables(text);
		return [...new Set([...subjectVars, ...htmlVars, ...textVars])].sort();
	}, [subject, html, text]);

	const onSubmit = async (values: EmailTemplateFormValues) => {
		form.clearErrors("root");

		try {
			await updateMutation.mutateAsync({
				publicId: template.publicId,
				subject: values.subject,
				html: values.html,
				text: values.text || undefined,
				isActive: values.isActive
			});
			onSuccess();
		} catch (error) {
			const message = error instanceof ApiError ? error.message : "Failed to save template";
			form.setError("root", { message });
		}
	};

	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex min-h-0 flex-1 flex-col"
				noValidate
			>
				<div className="min-h-0 flex-1 overflow-y-auto p-2">
					<FieldGroup className="gap-6">
						<FormErrorMessage message={errors.root?.message} />
						<TemplateInputField
							name="subject"
							id={`template-${template.publicId}-subject`}
							label="Subject"
							placeholder="Enter the email subject"
							error={errors.subject?.message}
							disabled={isPending}
						/>

						<HtmlEditorWorkspace
							html={html}
							id={`template-${template.publicId}-html`}
							error={errors.html?.message}
							disabled={isPending}
						/>

						<TemplateTextareaField
							name="text"
							id={`template-${template.publicId}-text`}
							label="Text Body"
							rows={10}
							error={errors.text?.message}
							disabled={isPending}
							optional
						/>

						<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
							<ActiveSwitchField id={`template-${template.publicId}-active`} disabled={isPending} />
							<VariablesPreview variables={allVariables} />
						</div>
					</FieldGroup>
				</div>

				<div className="bg-card/95 sticky bottom-0 -mx-6 mt-6 flex flex-col-reverse gap-2 border-t px-6 pt-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
					<Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
						<HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
						Back
					</Button>
					<Button type="submit" disabled={isPending || !isDirty}>
						{isPending ? (
							<>
								<HugeiconsIcon
									icon={Loading03Icon}
									data-icon="inline-start"
									className="animate-spin"
								/>
								Saving...
							</>
						) : (
							<>
								<HugeiconsIcon icon={SaveIcon} data-icon="inline-start" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}

function FormErrorMessage({ message }: { message?: string }) {
	if (!message) return null;

	return (
		<div
			className="border-destructive/20 bg-destructive/5 rounded-xl border px-4 py-3"
			role="alert"
		>
			<p className="text-destructive text-sm">{message}</p>
		</div>
	);
}

type TemplateTextFieldName = Extract<keyof EmailTemplateFormValues, "subject" | "html" | "text">;

interface TemplateFieldProps {
	name: TemplateTextFieldName;
	id: string;
	label: string;
	error?: string;
	disabled: boolean;
	placeholder?: string;
}

function TemplateInputField({ name, id, label, error, disabled, placeholder }: TemplateFieldProps) {
	const { register } = useFormContext<EmailTemplateFormValues>();

	return (
		<Field data-invalid={!!error}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Input
				id={id}
				{...register(name)}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={!!error}
				className="h-10 rounded-xl"
			/>
			<FieldError>{error}</FieldError>
		</Field>
	);
}

function HtmlEditorWorkspace({
	html,
	id,
	error,
	disabled
}: {
	html: string;
	id: string;
	error?: string;
	disabled: boolean;
}) {
	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
			<TemplateTextareaField
				name="html"
				id={id}
				label="HTML Body"
				rows={18}
				error={error}
				disabled={disabled}
				className="min-h-128"
			/>
			<HtmlPreview html={html} />
		</div>
	);
}

function TemplateTextareaField({
	name,
	id,
	label,
	error,
	disabled,
	rows,
	optional = false,
	className
}: TemplateFieldProps & { rows: number; optional?: boolean; className?: string }) {
	const { register } = useFormContext<EmailTemplateFormValues>();

	return (
		<Field data-invalid={!!error}>
			<FieldLabel htmlFor={id}>
				{label}
				{optional ? <span className="text-muted-foreground">(optional)</span> : null}
			</FieldLabel>
			<Textarea
				id={id}
				{...register(name)}
				rows={rows}
				spellCheck={name !== "html"}
				className={`bg-muted/20 min-h-80 resize-y rounded-xl font-mono text-xs leading-relaxed tab-2 shadow-inner ${className ?? ""}`}
				disabled={disabled}
				aria-invalid={!!error}
			/>
			<FieldError>{error}</FieldError>
		</Field>
	);
}

function HtmlPreview({ html }: { html: string }) {
	const previewDocument = useMemo(() => buildPreviewDocument(html), [html]);
	const hasHtml = html.trim().length > 0;

	return (
		<div className="bg-background flex min-h-128 flex-col overflow-hidden rounded-xl border">
			<div className="bg-muted/40 flex items-center justify-between gap-3 border-b px-4 py-3">
				<div className="flex min-w-0 items-center gap-2">
					<HugeiconsIcon icon={ViewIcon} className="text-muted-foreground size-4" />
					<p className="text-sm font-medium">HTML Preview</p>
				</div>
				<Badge variant="outline">Live</Badge>
			</div>
			<div className="relative min-h-0 flex-1 bg-white">
				{hasHtml ? (
					<iframe
						title="HTML email preview"
						srcDoc={previewDocument}
						sandbox=""
						className="h-full min-h-112 w-full bg-white"
					/>
				) : (
					<div className="flex h-full min-h-112 items-center justify-center p-6 text-center">
						<p className="text-muted-foreground text-sm">HTML preview will appear here.</p>
					</div>
				)}
			</div>
		</div>
	);
}

function buildPreviewDocument(html: string): string {
	if (isCompleteHtmlDocument(html)) {
		return html;
	}

	return `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<style>
			html,
			body {
				margin: 0;
				min-height: 100%;
				background: #ffffff;
			}

			body {
				padding: 24px;
				box-sizing: border-box;
			}
		</style>
	</head>
	<body>${html}</body>
</html>`;
}

function isCompleteHtmlDocument(html: string): boolean {
	return /<!doctype\s+html/i.test(html) || /<html[\s>]/i.test(html);
}

function ActiveSwitchField({ id, disabled }: { id: string; disabled: boolean }) {
	const { control } = useFormContext<EmailTemplateFormValues>();

	return (
		<Field
			orientation="horizontal"
			data-disabled={disabled}
			className="bg-muted/20 min-h-28 items-start justify-between rounded-xl border p-4"
		>
			<div className="grid gap-1 pr-4">
				<FieldLabel htmlFor={id}>Active</FieldLabel>
				<FieldDescription>
					When active, this template version will be used for sending emails.
				</FieldDescription>
			</div>
			<Controller
				name="isActive"
				control={control}
				render={({ field }) => (
					<Switch
						id={id}
						checked={field.value}
						onCheckedChange={field.onChange}
						disabled={disabled}
					/>
				)}
			/>
		</Field>
	);
}

function VariablesPreview({ variables }: { variables: string[] }) {
	return (
		<div className="bg-muted/20 min-h-28 rounded-xl border p-4">
			<div className="mb-3 flex items-start gap-2">
				<HugeiconsIcon icon={VariableIcon} className="text-muted-foreground mt-0.5 size-4" />
				<div className="grid gap-1">
					<p className="text-sm font-medium">Variables</p>
					<p className="text-muted-foreground text-sm">Detected in the template content.</p>
				</div>
			</div>
			{variables.length > 0 ? (
				<div className="flex flex-wrap gap-1.5">
					{variables.map(variable => (
						<VariableBadge key={variable} name={variable} />
					))}
				</div>
			) : (
				<p className="text-muted-foreground text-sm">No variables detected.</p>
			)}
		</div>
	);
}

function getDefaultValues(template: EmailTemplate): EmailTemplateFormValues {
	return {
		subject: template.subject,
		html: template.html,
		text: template.text ?? "",
		isActive: template.isActive
	};
}
