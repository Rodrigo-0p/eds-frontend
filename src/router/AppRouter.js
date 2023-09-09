import React                  from 'react';
// import {HashRouter, Route }   from 'react-router-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import _                      from "underscore";

// Componete
import NotFound               from './Router_404';
import Lgn                    from './lg/rLogin';
import Home                   from '../pages/Home';
import bs                     from '../router/modulosRouter/bs';


const Router = () => {
    const route = _.union(Lgn,bs);
    return (
        <BrowserRouter>       
            <Switch>
            {route.map((item) => (                
                <Route exact 
                        key={item.path}
                        path={item.path} 
                        component={item.component}/>
                ))}                        
                <Route exact path={"/home"}  component={Home} />
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
        
    );
};

export default Router;