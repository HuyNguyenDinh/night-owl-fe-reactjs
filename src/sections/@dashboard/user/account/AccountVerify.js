import { useState, useEffect } from "react";
import { Card, Grid, TextField, Button, Box, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import DoneIcon from '@mui/icons-material/Done';
import useAuth from '../../../../hooks/useAuth';


export default function AccountVerify() {

    const { user } = useAuth();

    return (
        <Card sx={{ p: 3}}>
            <Grid container rowGap={4}>
                <Grid item md={10}>
                    <TextField value={user.email} disabled label="Email" fullWidth/>
                </Grid>
                <Grid item md={2}>
                    <div style={{display: "flex", height: "100%", justifyContent: "center", alignItems: "center"}}>
                        { !user.email_verified ? 
                            <Button variant="contained" color="error">
                                Verify email
                            </Button>
                        :
                            <DoneIcon color="success" />
                        }

                    </div>

                </Grid>
                <Grid item md={10}>
                    <TextField value={user.phone_number} disabled label="Phone number" fullWidth/>
                </Grid>
                <Grid item md={2}>
                    <div style={{display: "flex", height: "100%", justifyContent: "center", alignItems: "center"}}>
                        { !user.phone_verified ? 
                            <Button variant="contained" color="error">
                                Verify phone number
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
