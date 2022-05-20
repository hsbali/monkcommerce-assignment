interface IImage {
	id: number;
	product_id: number;
	src: string;
}

export interface IVariant {
	id: number;
	product_id: number;
	title: string;
	price: string;
	inventory_management?: string;
	inventory_policy?: string;
	inventory_quantity?: number;
	option_values?: {
		id: number;
		label: string;
		option_id: number;
		option_display_name: string;
	}[];
	admin_graphql_api_id?: string;
}

export interface IProduct {
	id: number;
	title: string;
	body_html?: string;
	handle?: string;
	variants: IVariant[];
	image: IImage;
	images?: IImage[];
	options?: {
		product_id: number;
		name: string;
		values: string[];
	}[];
	status?: string;
	admin_graphql_api_id?: string;
}
