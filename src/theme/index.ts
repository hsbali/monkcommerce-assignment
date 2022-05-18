import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

import compStyleOverrides from './compStyleOverrides';
import themePalette from './palette.js';

const theme = () => {
	const themeOptions: ThemeOptions = {
		direction: 'ltr',
		palette: themePalette(),
		typography: {
			// fontFamily: [].join(','),
		},
	};

	const themes = createTheme(themeOptions);
	themes.components = compStyleOverrides(themeOptions.palette);

	return themes;
};

export default theme;
