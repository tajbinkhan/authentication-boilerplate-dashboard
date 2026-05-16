"use client";

import Link from "next/link";
import { Fragment } from "react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { useBreadcrumb } from "@/hooks/use-breadcrumb";

export function AppBreadcrumb() {
	const { breadcrumbs } = useBreadcrumb();

	if (!breadcrumbs || breadcrumbs.length === 0) return null;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((item, index) => {
					const isLast = index === breadcrumbs.length - 1;
					const isCurrent = item.isCurrent || isLast;

					return (
						<Fragment key={item.href || item.name}>
							<BreadcrumbItem className={index !== 0 ? "hidden md:block" : ""}>
								{isCurrent || !item.href ? (
									<BreadcrumbPage>{item.name}</BreadcrumbPage>
								) : (
									<Link href={item.href}>{item.name}</Link>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator className="hidden md:block" />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
