import React from 'react';
import { Grid } from '@mui/material';
import DrawingArea from '../../components/DrawerField/DrawingArea';

const MainPage = () => {

    return (
        <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={10} sx={{ marginTop: '2rem' }}>
                <DrawingArea />
            </Grid>
        </Grid>
    )
}

export default MainPage;
