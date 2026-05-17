import type { IconSvgElement } from "@hugeicons/react";

export interface NavItemProps {
	title: string;
	url: string;
	icon: IconSvgElement;
	isActive?: boolean;
	roles?: User["role"][];
	items?: {
		title: string;
		url: string;
	}[];
}

export interface NavUserProps {
	name: string;
	email: string;
	avatar?: string;
}

export interface NavUserItemProps {
	title: string;
	url: string;
	icon: IconSvgElement;
}

type MaxFiveItems<T> = readonly [T?, T?, T?, T?, T?];

export type NavUserMaxItemProps = MaxFiveItems<NavUserItemProps>;
