import { useState, useEffect, Dispatch, SetStateAction, Fragment, ChangeEvent, useRef } from 'react';
import axios from 'axios';

import { styled } from '@mui/material/styles';
import {
	Stack,
	Dialog,
	DialogContent,
	Typography,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Checkbox,
	TextField,
	InputAdornment,
	CircularProgress,
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';

import useDebounce from '../hooks/useDebounce';

import { IProduct, IVariant } from '../ts/databaseInterfaces';

const ListItemButtonWithBorder = styled(ListItemButton)(({ theme }) => ({
	borderBottom: `0.5px solid ${theme.palette.divider}`,
})) as typeof ListItemButton;

type SelectProductDialogProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	onAddSelectedProducts(products: IProduct): void;
};

export default function SelectProductDialog({ isOpen, setIsOpen, onAddSelectedProducts }: SelectProductDialogProps): JSX.Element {
	const contentRef = useRef<HTMLElement | null>(null);

	const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [productPage, setProductPage] = useState<number>(1);
	const [products, setProducts] = useState<IProduct[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	/* eslint-disable no-else-return */
	const handleSelectProduct = (product: IProduct): void => {
		if (selectedProduct !== null && selectedProduct.variants.length !== product.variants.length) {
			return setSelectedProduct(product);
		} else if (selectedProduct !== null) {
			return setSelectedProduct(null);
		}
		return setSelectedProduct(product);
	};

	const handleSelectVariant = (variant: IVariant, parentProduct: IProduct): void => {
		if (selectedProduct !== null && selectedProduct.variants.some((x) => x.id === variant.id)) {
			const productWithUpdatedVariants: IProduct = {
				...selectedProduct,
				variants: selectedProduct.variants.filter((x) => x.id !== variant.id),
			};
			if (productWithUpdatedVariants.variants.length) {
				return setSelectedProduct(productWithUpdatedVariants);
			}
			return setSelectedProduct(null);
		} else if (selectedProduct !== null) {
			const productWithUpdatedVariants: IProduct = { ...selectedProduct, variants: [...selectedProduct.variants, variant] };
			return setSelectedProduct(productWithUpdatedVariants);
		} else {
			const newProduct: IProduct = { ...parentProduct, variants: [variant] };
			return setSelectedProduct(newProduct);
		}
	};
	/* eslint-enable no-else-return */

	const handleAddSelectedProducts = (): void => {
		if (selectedProduct !== null) {
			onAddSelectedProducts(selectedProduct);
			setSelectedProduct(null);
		}
		setIsOpen(false);
	};

	// const handleContentScroll = (): void | undefined => {
	// 	if (!contentRef.current) return;

	// 	if (contentRef.current.scrollTop + contentRef.current.clientHeight >= contentRef.current.scrollHeight) {
	// 		setProductPage((prev) => prev++);
	// 	}
	// };

	useEffect(() => {
		if (isOpen === true) {
			(async () => {
				try {
					setIsLoading(true);
					const response = await axios.get<IProduct[]>(
						`https://stageapibc.monkcommerce.app/admin/shop/product?search=${debouncedSearchTerm}&page=${productPage}`
					);

					setProducts((prev) => [...prev, ...response.data]);
					setIsLoading(false);
				} catch (err: any) {
					/* eslint-disable no-console */
					console.error(err.message);
					/* eslint-enable no-console */
				}
			})();
		}

		return () => setProducts([]);
	}, [debouncedSearchTerm, isOpen]); // productPage

	return (
		<Dialog open={isOpen} fullWidth maxWidth="md" scroll="paper" onClose={(): void => setIsOpen(false)}>
			<Stack direction="row" px={2} py={1} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
				<Typography component="h1" variant="h6" flexGrow={1}>
					Set backup account
				</Typography>
				<IconButton size="small" onClick={(): void => setIsOpen(false)}>
					<Close />
				</IconButton>
			</Stack>
			<Stack direction="row" px={4} py={1} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
				<TextField
					fullWidth
					value={searchTerm}
					onChange={(e: ChangeEvent<HTMLInputElement>): void => {
						setProductPage(1);
						setSearchTerm(e.target.value);
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search />
							</InputAdornment>
						),
					}}
				/>
			</Stack>
			<DialogContent sx={{ p: 0 }} ref={contentRef}>
				{products && products.length !== 0 && (
					<List disablePadding>
						{products.map((prod) => {
							const productLabelId = `product-${prod.id}`;

							return (
								<Fragment key={prod.id}>
									<ListItem disablePadding>
										<ListItemButtonWithBorder role={undefined} dense onClick={(): void => handleSelectProduct(prod)}>
											<ListItemIcon sx={{ minWidth: 'fit-content' }}>
												<Checkbox
													checked={selectedProduct !== null && selectedProduct.id === prod.id}
													indeterminate={
														selectedProduct !== null &&
														selectedProduct.id === prod.id &&
														selectedProduct.variants.length !== prod.variants.length
															? true
															: undefined
													}
													disableRipple
													inputProps={{ 'aria-labelledby': productLabelId }}
												/>
											</ListItemIcon>
											<ListItemText id={productLabelId} primary={prod.title} />
										</ListItemButtonWithBorder>
									</ListItem>
									<List disablePadding>
										{prod.variants.length > 0 && prod.variants[0].title !== 'Default Title' ? (
											<>
												{prod.variants.map((variant) => {
													const variantLabelId = `variant-${variant.id}`;

													return (
														<ListItem key={variant.id} disablePadding>
															<ListItemButtonWithBorder
																role={undefined}
																dense
																onClick={(): void => handleSelectVariant(variant, prod)}
																sx={{ paddingLeft: 6 }}
															>
																<ListItemIcon sx={{ minWidth: 'fit-content' }}>
																	<Checkbox
																		checked={
																			selectedProduct !== null &&
																			selectedProduct.variants.some((x) => x.id === variant.id)
																		}
																		disableRipple
																		inputProps={{ 'aria-labelledby': variantLabelId }}
																	/>
																</ListItemIcon>
																<ListItemText id={variantLabelId} primary={variant.title} />
															</ListItemButtonWithBorder>
														</ListItem>
													);
												})}
											</>
										) : (
											''
										)}
									</List>
								</Fragment>
							);
						})}
					</List>
				)}
				{isLoading && (
					<Stack alignItems="center" py={4} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
						<CircularProgress />
					</Stack>
				)}
			</DialogContent>
			<Stack direction="row" justifyContent="flex-end" px={2} py={1} spacing={1}>
				<Button variant="outlined" onClick={(): void => setIsOpen(false)}>
					Cancel
				</Button>
				<Button variant="contained" disabled={selectedProduct === null} onClick={handleAddSelectedProducts}>
					Add
				</Button>
			</Stack>
		</Dialog>
	);
}
