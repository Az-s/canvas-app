import React from 'react';
import { Grid } from '@mui/material';
import DrawingArea from '../../components/DrawerField/DrawingArea';
import DrawingArea2 from '../../components/DrawerField/DrawingArea2';

const MainPage = () => {

    return (
        <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={10} sx={{ marginTop: '2rem' }}>
                <DrawingArea />
                <DrawingArea2 />
            </Grid>
        </Grid>
    )
};

export default MainPage;
