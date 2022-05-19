import type { Components } from '@mui/material/styles';

export default function compStyleOverrides(themePalette: any): Components<any> {
	return {
		MuiButton: {
			styleOverrides: {
				root: {
					padding: `0.25rem 0.5rem 0.25rem 0.5rem`,
					fontSize: '1rem',
					fontWeight: '600',
					textTransform: 'none',
					boxShadow: `none`,
					'&:hover': {
						boxShadow: `none`,
					},
					'&.MuiButton-sizeSmall': {
						fontSize: '0.8rem',
					},
					'&.MuiButton-sizeLarge': {
						fontSize: '1.2rem',
					},
					'&.MuiButton-outlined': {
						borderWidth: `2px`,
						padding: `0.1rem 0.5rem 0.1rem 0.5rem`,
					},
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					paddingRight: '0.5rem !important',
					paddingLeft: '0.5rem',
					border: `2px solid ${themePalette.divider}`,
					'&.Mui-focused': {
						borderColor: `${themePalette.primary.main}`,
					},
					'& fieldset': {
						display: 'none',
					},
					'& input': {
						fontSize: '1rem',
						padding: `0.3rem 0rem 0.3rem 0rem`,
						'&.MuiInputBase-inputSizeSmall': {
							fontSize: '0.8rem',
						},
					},
					'& .MuiSelect-select': {
						padding: '0.3rem 0rem 0.3rem 0rem',
					},
				},
			},
		},
	};
}
