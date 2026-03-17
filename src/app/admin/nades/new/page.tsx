"use client";

import React from "react";
import { FaBomb } from "react-icons/fa";
import PageHeader from "@/components/Helpers/PageHeader";
import NadeEditor from "@/components/Admin/NadeEditor";

export default function NewNadePage(): React.ReactElement {
	return (
		<div className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
			<PageHeader
				icon={FaBomb}
				label="Admin"
				title="Create New Nade"
				subtitle="Upload a video and capture frames for location, placement, lineup and land."
				actionLink="/admin/nades"
				actionLabel="Back to Nades"
			/>
			<NadeEditor mode="create" />
		</div>
	);
}
