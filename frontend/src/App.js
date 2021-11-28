import NavBar from './components/UI/NavBar/NavBar';
import MainPage from './containers/MainPage/MainPage';
import {Grid} from '@mui/material';

const App = () => {
  return (
    <Grid container>
      <NavBar />
      <MainPage />
    </Grid>
  );
}

export default App;
