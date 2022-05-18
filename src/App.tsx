import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

import Routes from './routes';

import theme from './theme';

import './styles/global.scss';

export default function App(): JSX.Element {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme()}>
				<CssBaseline />
				<Routes />
			</ThemeProvider>
		</StyledEngineProvider>
	);
}
