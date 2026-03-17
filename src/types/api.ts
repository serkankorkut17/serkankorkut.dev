// export interface MapFilters {
// 	search?: string;
// 	active?: boolean;
// 	pageNumber?: number;
// 	pageSize?: number;
// }

export interface MapFilters {
	$or?: Array<{ title?: RegExp; description?: RegExp }>;
	active?: boolean;
	pageNumber?: number;
	pageSize?: number;
}

export interface NadeFilters {
	$or?: Array<{ name?: RegExp, landing?: RegExp, position?: RegExp }>;
	type?: string;
	side?: string;
	map?: string;
}

export interface CreateMapPayload {
	name: string;
	title: string;
	active?: boolean;
  image: string;
	description: string;
}

export type UpdateMapPayload = Partial<CreateMapPayload>;

export interface CreateNadePayload {
	name: string;
	map: string;
	type: string;
	side: string;
	position: string;
	landing: string;
	throw: string[];
	description: string;
	images: {
		location: string;
		placement: string;
		lineup: string[];
		land: string;
	};
	video: string;
}

export type UpdateNadePayload = Partial<CreateNadePayload>;
