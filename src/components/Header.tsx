import { AppBar } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormButton from "./FormButton";
import { useUser } from "./UserContext";
import axios from "axios";

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

const logoutEndpoint = `${process.env.REACT_APP_LOGOUT_API_ENDPOINT}`;

const Header = () => {
    const { user, logout } = useUser();
    const isLogout = async() => {
        try {
            const response = await axios.post(logoutEndpoint, {}, { withCredentials: true });
          } catch (error:any) {
            if (error.response) {
              console.error('Server responded with:', error.response.status, error.response.data);
            } else if (error.request) {
              console.error('No response received:', error.request);
            } else {
              console.error('Error setting up request:', error.message);
            }
          }
    }
    return(
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        ○○予約アプリ
                    </Typography>
                    {user && (
                        <FormButton element={"ログアウト"} onClick={isLogout} />
                    )}
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
    )
};

export default Header;