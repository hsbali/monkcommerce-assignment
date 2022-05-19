import { Fragment, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { styled } from '@mui/material/styles';
import { Button, Container, Grid, Stack, IconButton, TextField, Typography, InputAdornment } from '@mui/material';
import { Close, Edit, DragIndicator } from '@mui/icons-material';
import { blue } from '@mui/material/colors';

import SelectProductDialog from '../components/SelectProductDialog';
import EditDiscount from '../components/EditDiscount';

import { IDiscount, IProductWithDiscount, IVariantWithDiscount } from '../ts/appInterfaces';
import { IProduct } from '../ts/databaseInterfaces';

const getEmptyProductInput = (id: number): IProductWithDiscount => ({
	uid: uuidv4(),
	id,
	title: '',
	variants: [],
	image: {
		id,
		product_id: id,
		src: '',
	},
});

const LinkButton = styled(Button)(() => ({
	padding: '0px',
	color: blue[400],
	textDecoration: 'underline',
	'&:hover': {
		textDecoration: 'none',
		background: 'none',
	},
})) as typeof Button;

type VariantsSectionProps = {
	product: IProductWithDiscount;
	onVariantRemove(productUid: string, variantId: number): void;
	onChangeVariantDiscount(productUid: string, variantId: number, { type, value }: IDiscount): void;
};

function VariantsSection({ product, onVariantRemove, onChangeVariantDiscount }: VariantsSectionProps): JSX.Element {
	const [isListVisible, setIsListVisible] = useState<boolean>(false);

	return (
		<>
			<Grid item xs={8} />
			<Grid item xs={3} mt={-1}>
				<Stack direction="row" justifyContent="flex-end">
					<LinkButton size="small" disableRipple onClick={(): void => setIsListVisible((prev) => !prev)}>
						View/Hide Variants
					</LinkButton>
				</Stack>
			</Grid>
			<Grid item xs={1} />
			{isListVisible && (
				<>
					{product.variants.map((variant, i) => (
						<Fragment key={`variant-${variant.id}`}>
							<Grid item xs={1} />
							<Grid item xs={7}>
								<Stack direction="row" spacing={1} alignItems="center">
									<DragIndicator />
									<Typography>{i + 1}.</Typography>
									<TextField
										fullWidth
										value={variant.title}
										InputProps={{
											readOnly: true,
										}}
									/>
								</Stack>
							</Grid>
							<Grid item xs={3}>
								<EditDiscount
									productUid={product.uid}
									variantId={variant.id}
									onChangeVariantDiscount={onChangeVariantDiscount}
									formValue={{ type: 'percent', value: 10 }}
									discountOn="variant"
								>
									<Button variant="contained" fullWidth>
										Add Discount
									</Button>
								</EditDiscount>
							</Grid>
							<Grid item xs={1}>
								<IconButton size="small" onClick={(): void => onVariantRemove(product.uid, variant.id)}>
									<Close />
								</IconButton>
							</Grid>
						</Fragment>
					))}
				</>
			)}
		</>
	);
}

export default function IndexPage(): JSX.Element {
	const [isSelectProductDialogOpen, setIsSelectProductDialogOpen] = useState<boolean>(false);
	const [selectedProducts, setSelectedProducts] = useState<IProductWithDiscount[]>([getEmptyProductInput(0)]);
	const [currInputUid, setCurrInputIndex] = useState<string | null>(null);

	const onAddSelectedProducts = (product: IProduct): void | undefined => {
		if (currInputUid === null) return;
		const currInput = selectedProducts.find((x) => x.uid === currInputUid);
		if (!currInput) return;

		const newProduct: IProductWithDiscount = { ...currInput, ...product };
		setSelectedProducts((prev) => prev.map((x) => (x.uid === currInputUid ? newProduct : x)));
	};

	const onVariantRemove = (productUid: string, variantId: number): void | undefined => {
		const currProduct = selectedProducts.find((x) => x.uid === productUid);
		if (currProduct === undefined) return;

		const newProduct: IProductWithDiscount = { ...currProduct, variants: currProduct.variants.filter((x) => x.id !== variantId) };
		if (newProduct.variants.length === 0) {
			setSelectedProducts((prev) => prev.filter((x) => x.uid !== newProduct.uid));
		} else {
			setSelectedProducts((prev) => prev.map((x) => (x.uid === currInputUid ? newProduct : x)));
		}
	};

	const onChangeProductDiscount = (productUid: string, discount: IDiscount): void => {
		const currProduct = selectedProducts.find((x) => x.uid === productUid);
		if (currProduct === undefined) return;

		const newProduct: IProductWithDiscount = { ...currProduct, discount };
		setSelectedProducts((prev) => prev.map((x) => (x.uid === currInputUid ? newProduct : x)));
	};

	const onChangeVariantDiscount = (productUid: string, variantId: number, discount: IDiscount): void => {
		const currProduct = selectedProducts.find((x) => x.uid === productUid);
		if (currProduct === undefined) return;

		const updatedVariants: IVariantWithDiscount[] = currProduct.variants.map((x) => (x.id === variantId ? { ...x, discount } : x));
		const newProduct: IProductWithDiscount = { ...currProduct, variants: updatedVariants };
		setSelectedProducts((prev) => prev.map((x) => (x.uid === currInputUid ? newProduct : x)));
	};

	return (
		<Container maxWidth="md" sx={{ my: 4 }}>
			<Typography component="h1" variant="h5" sx={{ fontWeight: 'bolder' }} mb={2}>
				Add Products
			</Typography>
			<Grid container columnSpacing={1}>
				<Grid item xs={8}>
					<Typography component="h2" variant="h6">
						Products
					</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography component="h2" variant="h6">
						Discounts
					</Typography>
				</Grid>
			</Grid>
			<SelectProductDialog
				isOpen={isSelectProductDialogOpen}
				setIsOpen={setIsSelectProductDialogOpen}
				onAddSelectedProducts={onAddSelectedProducts}
			/>
			{selectedProducts.length !== 0 &&
				selectedProducts.map((prod, i) => (
					<Fragment key={`key-${prod.id}`}>
						<Grid container spacing={1} mb={1}>
							<Grid item xs={8}>
								<Stack direction="row" spacing={1} alignItems="center">
									<DragIndicator />
									<Typography>{i + 1}.</Typography>
									<TextField
										fullWidth
										value={prod.title}
										InputProps={{
											readOnly: true,
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														size="small"
														onClick={(): void => {
															setCurrInputIndex(prod.uid);
															setIsSelectProductDialogOpen(true);
														}}
													>
														<Edit />
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</Stack>
							</Grid>
							<Grid item xs={3}>
								<EditDiscount
									productUid={prod.uid}
									onChangeProductDiscount={onChangeProductDiscount}
									formValue={{ type: 'percent', value: 10 }}
									discountOn="product"
								>
									<Button variant="contained" fullWidth>
										Add Discount
									</Button>
								</EditDiscount>
							</Grid>
							<Grid item xs={1}>
								{selectedProducts.length > 1 && (
									<IconButton
										size="small"
										onClick={(): void => setSelectedProducts((prev) => prev.filter((el, index) => index !== i))}
									>
										<Close />
									</IconButton>
								)}
							</Grid>
							{prod.variants.length > 0 && prod.variants[0].title !== 'Default Title' ? (
								<VariantsSection
									product={prod}
									onVariantRemove={onVariantRemove}
									onChangeVariantDiscount={onChangeVariantDiscount}
								/>
							) : (
								''
							)}
						</Grid>
					</Fragment>
				))}
			<Grid container spacing={1}>
				<Grid item xs={5} />
				<Grid item xs={6} mt={2}>
					<Button
						fullWidth
						size="large"
						variant="outlined"
						onClick={(): void => setSelectedProducts((prev) => [...prev, getEmptyProductInput(prev.length)])}
					>
						Add Product
					</Button>
				</Grid>
				<Grid item xs={1} />
			</Grid>
		</Container>
	);
}
