import { useState, Dispatch, SetStateAction } from 'react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from 'react-beautiful-dnd';

import { styled } from '@mui/material/styles';
import { Button, Container, Grid, Stack, Box, IconButton, TextField, Typography, InputAdornment } from '@mui/material';
import { Close, Edit, DragIndicator } from '@mui/icons-material';
import { blue } from '@mui/material/colors';

import SelectProductDialog from '../components/SelectProductDialog';
import EditDiscount from '../components/EditDiscount';

import { IDiscount, IProductWithDiscount, IVariantWithDiscount } from '../ts/appInterfaces';
import { IProduct } from '../ts/databaseInterfaces';

const getEmptyProductInput = (id: number): IProductWithDiscount => ({
	uid: id,
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
	onVariantRemove(productUid: number, variantId: number): void;
	onChangeVariantDiscount(productUid: number, variantId: number, { type, value }: IDiscount): void;
	setSelectedProducts: Dispatch<SetStateAction<IProductWithDiscount[]>>;
};

function VariantsSection({ product, onVariantRemove, onChangeVariantDiscount, setSelectedProducts }: VariantsSectionProps): JSX.Element {
	const [isListVisible, setIsListVisible] = useState<boolean>(false);

	const handleDragEnd = (result: DropResult): void | undefined => {
		if (!result.destination) return;

		const variants: IVariantWithDiscount[] = Array.from(product.variants);
		const [reorderedVariant]: IVariantWithDiscount[] = variants.splice(result.source.index, 1);
		variants.splice(result.destination.index, 0, reorderedVariant);

		setSelectedProducts((prev) => prev.map((x) => (x.uid === product.uid ? { ...product, variants } : x)));
	};

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
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId={`variant-list-${product.uid}`}>
						{(provided: DroppableProvided) => (
							<Grid item xs={12} ref={provided.innerRef} {...provided.droppableProps}>
								{product.variants.map((variant, i) => (
									<Draggable key={variant.id} draggableId={variant.id.toString()} index={i}>
										{(providedDraggable: DraggableProvided) => (
											<Grid
												container
												columnSpacing={1}
												mb={1}
												sx={{ background: (theme) => theme.palette.background.default }}
												ref={providedDraggable.innerRef}
												{...providedDraggable.draggableProps}
											>
												<Grid item xs={1} />
												<Grid item xs={7}>
													<Stack direction="row" spacing={1} alignItems="center">
														<Box sx={{ maxHeight: '24px' }} {...providedDraggable.dragHandleProps}>
															<DragIndicator />
														</Box>
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
											</Grid>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</Grid>
						)}
					</Droppable>
				</DragDropContext>
			)}
		</>
	);
}

export default function IndexPage(): JSX.Element {
	const [isSelectProductDialogOpen, setIsSelectProductDialogOpen] = useState<boolean>(false);
	const [selectedProducts, setSelectedProducts] = useState<IProductWithDiscount[]>([getEmptyProductInput(0)]);
	const [currInputUid, setCurrInputIndex] = useState<number | null>(null);

	const onAddSelectedProducts = (product: IProduct): void | undefined => {
		if (currInputUid === null) return;
		const currInput = selectedProducts.find((x) => x.uid === currInputUid);
		if (!currInput) return;

		const newProduct: IProductWithDiscount = { ...currInput, ...product };
		setSelectedProducts((prev) => prev.map((x) => (x.uid === currInputUid ? newProduct : x)));
	};

	const onVariantRemove = (productUid: number, variantId: number): void | undefined => {
		const currProduct = selectedProducts.find((x) => x.uid === productUid);
		if (currProduct === undefined) return;

		const newProduct: IProductWithDiscount = { ...currProduct, variants: currProduct.variants.filter((x) => x.id !== variantId) };
		if (newProduct.variants.length === 0) {
			setSelectedProducts((prev) => prev.filter((x) => x.uid !== newProduct.uid));
		} else {
			setSelectedProducts((prev) => prev.map((x) => (x.uid === currInputUid ? newProduct : x)));
		}
	};

	const onChangeProductDiscount = (productUid: number, discount: IDiscount): void => {
		const currProduct = selectedProducts.find((x) => x.uid === productUid);
		if (currProduct === undefined) return;

		const newProduct: IProductWithDiscount = { ...currProduct, discount };
		setSelectedProducts((prev) => prev.map((x) => (x.uid === currInputUid ? newProduct : x)));
	};

	const onChangeVariantDiscount = (productUid: number, variantId: number, discount: IDiscount): void => {
		const currProduct = selectedProducts.find((x) => x.uid === productUid);
		if (currProduct === undefined) return;

		const updatedVariants: IVariantWithDiscount[] = currProduct.variants.map((x) => (x.id === variantId ? { ...x, discount } : x));
		const newProduct: IProductWithDiscount = { ...currProduct, variants: updatedVariants };
		setSelectedProducts((prev) => prev.map((x) => (x.uid === currInputUid ? newProduct : x)));
	};

	const handleDragEnd = (result: DropResult): void | undefined => {
		if (!result.destination) return;

		const products: IProductWithDiscount[] = Array.from(selectedProducts);
		const [reorderedVariant]: IProductWithDiscount[] = products.splice(result.source.index, 1);
		products.splice(result.destination.index, 0, reorderedVariant);

		setSelectedProducts(products);
	};

	return (
		<Container maxWidth="md" sx={{ my: 4 }}>
			<Typography component="h1" variant="h5" sx={{ fontWeight: 'bolder' }} mb={2}>
				Add Products
			</Typography>
			<Grid container columnSpacing={1} mb={2}>
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
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="products-list">
					{(provided: DroppableProvided) => (
						<Grid container spacing={1} mb={1} ref={provided.innerRef} {...provided.droppableProps}>
							{selectedProducts.length !== 0 &&
								selectedProducts.map((prod, i) => (
									<Draggable key={prod.uid} draggableId={prod.uid.toString()} index={i}>
										{(providedDraggable: DraggableProvided) => (
											<Grid
												container
												spacing={1}
												mb={1}
												sx={{ background: (theme) => theme.palette.background.default }}
												ref={providedDraggable.innerRef}
												{...providedDraggable.draggableProps}
											>
												<Grid item xs={8}>
													<Stack direction="row" spacing={1} alignItems="center">
														<Box sx={{ maxHeight: '24px' }} {...providedDraggable.dragHandleProps}>
															<DragIndicator />
														</Box>
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
															onClick={(): void =>
																setSelectedProducts((prev) => prev.filter((el, index) => index !== i))
															}
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
														setSelectedProducts={setSelectedProducts}
													/>
												) : (
													''
												)}
											</Grid>
											// </div>
										)}
									</Draggable>
								))}
							{provided.placeholder}
						</Grid>
					)}
				</Droppable>
			</DragDropContext>

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
