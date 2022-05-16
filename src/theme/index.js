import { createTheme } from '@mui/material/styles'

import compStyleOverrides from './compStyleOverrides'
import themePalette from './palette.js'

const theme = () => {
	const themeOptions = {
		direction: 'ltr',
		palette: themePalette(),
		typography: {
			// fontFamily: [].join(','),
		},
	}

	const themes = createTheme(themeOptions)
	themes.components = compStyleOverrides(themePalette())

	return themes
}

export default theme
