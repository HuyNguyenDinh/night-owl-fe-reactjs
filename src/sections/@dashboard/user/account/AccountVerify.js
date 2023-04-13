import { useNavigate } from "react-router";
import { 
    Card, 
    Grid, 
    TextField, 
    Button, 
    // Box, 
    // Typography
} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
// path
import { PATH_AUTH } from "../../../../routes/paths";
// hook
import useAuth from '../../../../hooks/useAuth';
// utils
import axiosInstance from "../../../../utils/axios";


export default function AccountVerify() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleVerifyEmail = async () => {
        await axiosInstance.get("/market/users/send-verified-code-to-email/");
        navigate(PATH_AUTH.KYCEmail);
    }

    const handleVerifyPhone = async () => {
        await axiosInstance.get("/market/users/send-verified-code-to-phone-number/");
        navigate(PATH_AUTH.KYCPhone);
    }

    return (
        <Card sx={{ p: 3}}>
            <Grid container spacing={2} rowGap={2}>
                <Grid item md={10}>
                    <TextField size="small" value={user.email} disabled label="Email" fullWidth/>
                </Grid>
                <Grid item md={2}>
                    <div style={{display: "flex", height: "100%", justifyContent: "center", alignItems: "center"}}>
                        { !user.email_verified ? 
                            <Button sx={{height: "100%"}} fullWidth variant="contained" color="error" onClick={handleVerifyEmail}>
                                Verify
                            </Button>
                        :
                            <DoneIcon color="success" />
                        }

                    </div>

                </Grid>
                <Grid item md={10}>
                    <TextField size="small" value={user.phone_number} disabled label="Phone number" fullWidth/>
                </Grid>
                <Grid item md={2}>
                    <div style={{display: "flex", height: "100%", justifyContent: "center", alignItems: "center"}}>
                        { !user.phone_verified ? 
                            <Button  sx={{height: "100%"}} variant="contained" fullWidth color="error" onClick={handleVerifyPhone}>
                                Verify
                            </Button>
                        :
                            <DoneIcon color="success" />
                        }

                    </div>

                </Grid>
            </Grid>
            
        </Card>
    )
}
