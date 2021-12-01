import NavBar from './components/UI/NavBar/NavBar';
import MainPage from './containers/MainPage/MainPage';
import { Grid } from '@mui/material';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Grid container>
        <Switch>
          <Route path='/:id'>
            <NavBar />
            <MainPage />
          </Route>
          <Redirect to={`f${(+new Date).toString(16)}`}/>
        </Switch>
      </Grid>
    </BrowserRouter >
  );
}

export default App;
