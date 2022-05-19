export interface IVariant {
	id: number;
	product_id: number;
	title: string;
	price: string;
}

export interface IProduct {
	id: number;
	title: string;
	variants: IVariant[];
	image: {
		id: number;
		product_id: number;
		src: string;
	};
}
