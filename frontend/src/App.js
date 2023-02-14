import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/Spots";
import CurrentUserSpot from "./components/CurrentUserSpot";
import SpotDetail from "./components/SpotDetail";
import CreateSpot from "./components/CreateSpot";
import EditSpot from "./components/EditSpot";
import CurrentReviews from "./components/Reviews";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/" exact>
            <AllSpots />
          </Route>
          <Route path="/spots/current" exact>
            <CurrentUserSpot />
          </Route>
          <Route path="/reviews/current" exact>
            <CurrentReviews />
          </Route>
          <Route path="/spots/:spotId/edit" exact>
            <EditSpot />
          </Route>
          <Route path="/spots/new" exact>
            <CreateSpot />
          </Route>
          <Route path="/spots/:spotId" exact>
            <SpotDetail />
          </Route>
          <Route path="*">
            <div className="pageNotFound">404 Page Not Found</div>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
