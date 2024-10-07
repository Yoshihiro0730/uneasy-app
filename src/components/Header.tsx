import { AppBar } from "@mui/material";
import { styled } from '@mui/system';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormButton from "./FormButton";
import { useUser } from "./UserContext";
import axios from "axios";

const theme = createTheme({
    components: {
        MuiToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
                    backdropFilter: 'blur(5px) !important',
                },
            },
        },
    },
    palette: {
        text: {
            primary: '#000000'
        }
    } 
});

const TransparentAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'transparent !important',
    color: theme.palette.text.primary,
    boxShadow: 'none',
}));

const StyledToolbar = styled(Toolbar)({
    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
    backdropFilter: 'blur(5px) !important',
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
            {/* <Box sx={{ flexGrow: 1 }}> */}
                <TransparentAppBar position="sticky" elevation={0}>
                <StyledToolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                        もやもや
                    </Typography>
                    {user && (
                        <FormButton element={"ログアウト"} onClick={isLogout} />
                    )}
                </StyledToolbar>
                </TransparentAppBar>
            {/* </Box> */}
        </ThemeProvider>
    )
};

export default Header;