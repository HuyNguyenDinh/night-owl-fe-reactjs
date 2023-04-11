import { useState, useEffect } from "react";
import { Card, Grid, TextField, Button, Box, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import DoneIcon from '@mui/icons-material/Done';
import useAuth from '../../../../hooks/useAuth';


export default function AccountVerify() {

    const { user } = useAuth();

    return (
        <Card sx={{ p: 3}}>
            <Grid container spacing={2} rowGap={2}>
                <Grid item md={10}>
                    <TextField size="small" value={user.email} disabled label="Email" fullWidth/>
                </Grid>
                <Grid item md={2}>
                    <div style={{display: "flex", height: "100%", justifyContent: "center", alignItems: "center"}}>
                        { !user.email_verified ? 
                            <Button sx={{height: "100%"}} fullWidth variant="contained" color="error">
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
                            <Button  sx={{height: "100%"}} variant="contained" fullWidth color="error">
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
