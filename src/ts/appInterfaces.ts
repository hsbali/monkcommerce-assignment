import { IProduct, IVariant } from './databaseInterfaces';

export interface IDiscount {
	type: 'flat' | 'percent';
	value: number;
}

export interface IProductWithUid extends IProduct {
	uid: number;
}

export interface IVariantWithDiscount extends IVariant {
	discount?: IDiscount;
}

export interface IProductWithDiscount extends IProductWithUid {
	discount?: IDiscount;
	variants: IVariantWithDiscount[];
}
