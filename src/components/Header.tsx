import { AppBar } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            paper: '#fff'
        },
        text: {
            primary: '#000000'
        }
    } 
});

const Header = () => {
    return(
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        ○○予約アプリ
                    </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
    )
};

export default Header;