import { ChangeEvent, useEffect, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';

import { Select, MenuItem, Grid, TextField, Box } from '@mui/material';

import { IDiscount } from '../ts/appInterfaces';

type EditDiscountProps = {
	productUid?: number;
	variantId?: number;
	discountOn: 'product' | 'variant';
	formValue: IDiscount;
	children: JSX.Element;
	onChangeProductDiscount?(productUid: number, { type, value }: IDiscount): void;
	onChangeVariantDiscount?(productUid: number, variantId: number, { type, value }: IDiscount): void;
};

export default function EditDiscount({ children, ...props }: EditDiscountProps): JSX.Element {
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const [formData, setFormData] = useState<IDiscount>(props.formValue);

	const handleChangeValueField = (e: ChangeEvent<HTMLInputElement>): void => {
		/* eslint-disable arrow-body-style */
		setFormData((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
		/* eslint-enable arrow-body-style */
	};

	const handleChangeTypeField = (e: SelectChangeEvent<IDiscount['type']>): void => {
		/* eslint-disable arrow-body-style */
		setFormData((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
		/* eslint-enable arrow-body-style */
	};

	useEffect(() => {
		if (isFormOpen === true) {
			if (props.discountOn === 'product' && props.productUid !== undefined && props.onChangeProductDiscount)
				props.onChangeProductDiscount(props.productUid, formData);
			if (
				props.discountOn === 'variant' &&
				props.productUid !== undefined &&
				props.variantId !== undefined &&
				props.onChangeVariantDiscount
			)
				props.onChangeVariantDiscount(props.productUid, props.variantId, formData);
		}
	}, [formData, isFormOpen]);

	/* eslint-disable react/jsx-no-useless-fragment */
	return (
		<>
			{!isFormOpen ? (
				<Box onClick={(): void => setIsFormOpen(true)}>{children}</Box>
			) : (
				<Grid container alignItems="center" columnSpacing={1}>
					<Grid item xs={6}>
						<TextField name="value" value={formData.value} fullWidth onChange={handleChangeValueField} />
					</Grid>
					<Grid item xs={6}>
						<Select name="type" value={formData.type} displayEmpty fullWidth onChange={handleChangeTypeField}>
							<MenuItem value="percent">% off</MenuItem>
							<MenuItem value="flat">flat off</MenuItem>
						</Select>
					</Grid>
				</Grid>
			)}
		</>
	);
	/* eslint-enable react/jsx-no-useless-fragment */
}
