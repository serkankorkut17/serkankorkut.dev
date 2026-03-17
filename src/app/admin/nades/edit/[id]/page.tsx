"use client";

import React from "react";
import { useParams } from "next/navigation";
import { FaBomb } from "react-icons/fa";
import PageHeader from "@/components/Helpers/PageHeader";
import NadeEditor from "@/components/Admin/NadeEditor";

export default function EditNadePage(): React.ReactElement {
	const params = useParams<{ id: string }>();
	return (
		<div className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
			<PageHeader
				icon={FaBomb}
				label="Admin"
				title="Edit Nade"
				subtitle="Update details, upload a new video, and recapture frames when needed."
				actionLink="/admin/nades"
				actionLabel="Back to Nades"
			/>
			<NadeEditor mode="edit" nadeId={params.id} />
		</div>
	);
}
