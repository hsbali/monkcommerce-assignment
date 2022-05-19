import { createTheme } from '@mui/material/styles';
import type { ThemeOptions, Components } from '@mui/material/styles';

import compStyleOverrides from './compStyleOverrides';
import themePalette from './palette';

interface ThemeOptionsWithCustomCompenents extends ThemeOptions {
	components?: Components<any>;
}

const theme = () => {
	const themeOptions: ThemeOptionsWithCustomCompenents = {
		direction: 'ltr',
		palette: themePalette(),
		typography: {
			// fontFamily: [].join(','),
		},
	};

	const themes = createTheme(themeOptions);
	themes.components = compStyleOverrides(themes.palette);

	return themes;
};

export default theme;
