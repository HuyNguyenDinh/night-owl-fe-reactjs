import { useState, useEffect } from "react";
import { Card, Grid, TextField, Button, Box, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import useAuth from '../../../../hooks/useAuth';


export default function AccountVerify() {

    const { user } = useAuth();

    return (
        <Card sx={{ p: 3}}>
            <Grid container xs="12">
                <Grid item md={8}>
                    <Typography>
                        Email: {user.email}
                    </Typography>
                </Grid>
                <Grid item md={4}>
                    <Button variant="contained" disabled={user.email_verified} sx={{ color: user.email_verified ?  "success"  : "error"}}>
                        {user.email_verified ? "Verified" : "Verify email"}
                    </Button>
                </Grid>
            </Grid>

        </Card>
    )
}
