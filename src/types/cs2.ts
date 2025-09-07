export interface Map {
	_id: string;
	name: string;
	title: string;
	description: string;
	image: string;
	active: boolean;
}

// export interface Nade {
// 	_id: string;
// 	name: string;
// 	type: string;
// 	side: string;
// 	description: string;
// 	images: {
// 		land: string;
// 		location: string;
// 		placement: string;
// 		lineup: string[];
// 	};
// 	map: string;
// }

export interface Nade {
    _id: string;
    name: string;
    type: string;
    side: string;
    description: string;
    images: {
        land: string;
        location: string;
        placement: string;
        lineup: string[];
    };
    map: string;
    throw: string[];
    position: string;
    landing: string;
    video?: string;
}

export interface ApiGetMapsResponse {
	data: Map[];
	total: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number;
}

export interface ApiGetNadesResponse {
	data: Nade[];
	total: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number;
}