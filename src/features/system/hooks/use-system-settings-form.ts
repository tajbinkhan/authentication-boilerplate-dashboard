import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import { useUpdateSystemSettingsMutation } from "@/features/system/actions/system.mutations";
import { useSystemSettingsQuery } from "@/features/system/actions/system.queries";
import type { AccessModel, SystemSettings } from "@/features/system/types/system.types";
import type { UserRole } from "@/features/users/types/users.types";

export function useSystemSettingsForm() {
	const { data: settings, isLoading, isError, refetch } = useSystemSettingsQuery();
	const updateMutation = useUpdateSystemSettingsMutation();

	const [accessModel, setAccessModel] = useState<AccessModel | null>(null);
	const [allowedRoles, setAllowedRoles] = useState<UserRole[] | null>(null);

	const initialized = accessModel !== null && allowedRoles !== null;

	const initialize = (data: SystemSettings) => {
		if (!initialized) {
			setAccessModel(data.accessModel);
			setAllowedRoles([...data.allowedRoles]);
		}
	};

	const toggleRole = (role: UserRole) => {
		if (role === "SUPER_ADMIN") return;
		if (!allowedRoles) return;

		setAllowedRoles(prev =>
			prev && prev.includes(role) ? prev.filter(r => r !== role) : prev ? [...prev, role] : [role]
		);
	};

	const hasChanges =
		settings && initialized
			? settings.accessModel !== accessModel ||
				settings.allowedRoles.length !== allowedRoles.length ||
				!settings.allowedRoles.every(r => allowedRoles.includes(r))
			: false;

	const handleSave = () => {
		if (!accessModel || !allowedRoles) return;

		updateMutation.mutate(
			{ accessModel, allowedRoles },
			{
				onSuccess: () => {
					toast.success("System settings updated successfully");
				},
				onError: error => {
					const message = error instanceof ApiError ? error.message : "Failed to update settings";
					toast.error(message);
				}
			}
		);
	};

	const handleReset = () => {
		if (!settings) return;
		setAccessModel(settings.accessModel);
		setAllowedRoles([...settings.allowedRoles]);
	};

	return {
		settings,
		isLoading,
		isError,
		refetch,
		accessModel: accessModel ?? (settings?.accessModel ?? "OPEN"),
		allowedRoles: allowedRoles ?? (settings?.allowedRoles ?? []),
		setAccessModel,
		toggleRole,
		hasChanges: hasChanges ?? false,
		handleSave,
		handleReset,
		isSaving: updateMutation.isPending,
		initialized,
		initialize
	};
}
