import {Route, Switch} from "react-router-dom";
import Main from "./Main";
import Signup from "./Signup";
import Signin from "./Signin";
import Article from "./Article";
import Nomatch from "./Nomatch";
import React from "react";
import Home from "./Home";
// import ErrorBoundary from "./ErrorBoundary";

function UnauthenticatedApp(props) {
        
    return (

        < Switch >
             < Route path="/" exact>
                < Home />
            </Route>
            < Route path="/articles" exact>
                < Main />
            </Route>
            < Route path="/" exact>
                < Home />
            </Route>
            < Route path="/articles/:slug">
                < Article />
            </Route>
            < Route path="/register">
                < Signup />
            </Route>
            < Route path="/login">
                < Signin />
            </Route>
            < Route path="*">
                < Nomatch />
            </Route>
        </Switch>
    )
}

export default UnauthenticatedApp;