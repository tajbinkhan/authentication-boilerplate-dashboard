"use client";

import { Loading03Icon, VariableIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateEmailTemplateMutation } from "@/features/email-templates/actions/email-template.mutations";
import {
	emailTemplateFormSchema,
	type EmailTemplateFormValues
} from "@/features/email-templates/schemas/email-template-form.schema";
import type { EmailTemplate } from "@/features/email-templates/types/email-template.types";
import { ApiError } from "@/lib/api/errors";

export function extractHandlebarsVariables(content: string): string[] {
	const matches = content.match(/\{\{[\s~]?#?(each|if|unless|with|else|\/)?\s*([\w.]+)\s*\}\}/g);
	if (!matches) return [];

	const variables = new Set<string>();
	for (const match of matches) {
		const inner = match
			.replace(/\{\{[\s~]?#?(each|if|unless|with|else|\/)?\s*/, "")
			.replace(/\s*\}\}/, "");
		if (inner && !["each", "if", "unless", "with", "else"].includes(inner)) {
			variables.add(inner);
		}
	}
	return [...variables].sort();
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
		defaultValues: getDefaultValues(template),
		mode: "onChange"
	});

	const allVariables = useMemo(() => {
		const subjectVars = extractHandlebarsVariables(form.watch("subject") ?? "");
		const htmlVars = extractHandlebarsVariables(form.watch("html") ?? "");
		const textVars = extractHandlebarsVariables(form.watch("text") ?? "");
		return [...new Set([...subjectVars, ...htmlVars, ...textVars])].sort();
	}, [form.watch("subject"), form.watch("html"), form.watch("text")]);

	const onSubmit = async (values: EmailTemplateFormValues) => {
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
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
				<div className="min-h-0 flex-1 overflow-y-auto">
					<FieldGroup className="gap-4">
						<Field>
							<FieldLabel>Template Key</FieldLabel>
							<Badge variant="secondary" className="font-mono">
								{template.key}
							</Badge>
							<FieldDescription>Current version: v{template.version}</FieldDescription>
						</Field>

						{form.formState.errors.root && (
							<div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
								<p className="text-destructive text-sm">{form.formState.errors.root.message}</p>
							</div>
						)}

						<Field>
							<FieldLabel htmlFor={`template-${template.publicId}-subject`}>Subject</FieldLabel>
							<Controller
								name="subject"
								control={form.control}
								render={({ field }) => (
									<Textarea id={`template-${template.publicId}-subject`} {...field} rows={2} />
								)}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={`template-${template.publicId}-html`}>HTML Body</FieldLabel>
							<Controller
								name="html"
								control={form.control}
								render={({ field }) => (
									<Textarea
										id={`template-${template.publicId}-html`}
										{...field}
										rows={12}
										className="font-mono text-xs"
									/>
								)}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={`template-${template.publicId}-text`}>
								Text Body <span className="text-muted-foreground">(optional)</span>
							</FieldLabel>
							<Controller
								name="text"
								control={form.control}
								render={({ field }) => (
									<Textarea
										id={`template-${template.publicId}-text`}
										{...field}
										value={field.value ?? ""}
										rows={8}
										className="font-mono text-xs"
									/>
								)}
							/>
						</Field>

						<Field
							orientation="horizontal"
							className="items-center justify-between rounded-2xl border p-3"
						>
							<div>
								<FieldLabel htmlFor={`template-${template.publicId}-active`}>Active</FieldLabel>
								<FieldDescription>
									When active, this template version will be used for sending emails.
								</FieldDescription>
							</div>
							<Controller
								name="isActive"
								control={form.control}
								render={({ field }) => (
									<Switch
										id={`template-${template.publicId}-active`}
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isPending}
									/>
								)}
							/>
						</Field>

						{allVariables.length > 0 && (
							<Field>
								<FieldLabel>Handlebars Variables</FieldLabel>
								<FieldDescription>Variables detected in the template content.</FieldDescription>
								<div className="flex flex-wrap gap-1.5">
									{allVariables.map(variable => (
										<VariableBadge key={variable} name={variable} />
									))}
								</div>
							</Field>
						)}
					</FieldGroup>
				</div>

				<div className="flex items-center justify-between gap-2 border-t pt-4">
					<Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
						Back
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? (
							<>
								<HugeiconsIcon icon={Loading03Icon} data-icon="inline-start" />
								Saving...
							</>
						) : (
							"Save Changes"
						)}
					</Button>
				</div>
			</form>
		</FormProvider>
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
