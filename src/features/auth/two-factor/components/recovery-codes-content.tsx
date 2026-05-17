"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface RecoveryCodesContentProps {
	recoveryCodes: string[];
	onCopy: () => void;
	onDone: () => void;
}

export function RecoveryCodesContent({ recoveryCodes, onCopy, onDone }: RecoveryCodesContentProps) {
	return (
		<div className="grid gap-6">
			<DialogHeader>
				<DialogTitle>Save your recovery codes</DialogTitle>
				<DialogDescription>
					These codes are shown once. Store them somewhere safe before closing.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-2 sm:grid-cols-2">
				{recoveryCodes.map(code => (
					<div key={code} className="bg-muted rounded-lg px-3 py-2 font-mono text-sm">
						{code}
					</div>
				))}
			</div>
			<DialogFooter>
				<Button type="button" variant="outline" onClick={onCopy}>
					<HugeiconsIcon icon={Copy01Icon} data-icon="inline-start" />
					Copy codes
				</Button>
				<Button type="button" onClick={onDone}>
					I have saved these codes
				</Button>
			</DialogFooter>
		</div>
	);
}
