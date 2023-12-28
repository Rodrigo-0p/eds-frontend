import React                  from 'react';
import { BrowserRouter
        , Switch, Route }     from 'react-router-dom';
import _                      from "underscore";
// Componete
import NotFound               from './Router_404';
import Lgn                    from './lg/rLogin';
import Home                   from '../pages/Home';

import bs                     from '../router/modulosRouter/bs';
import cm                     from '../router/modulosRouter/cm';
import vt                     from '../router/modulosRouter/vt';
import st                     from '../router/modulosRouter/st';

// import TEST                   from '../pages/modulos/test/prueba'

const Router = () => {
    const route = _.union(Lgn,bs,cm,vt,st);
    return (
        <BrowserRouter>       
            <Switch>
            {route.map((item) => (                
                <Route exact 
                        key={item.path}
                        path={item.path} 
                        component={item.component}/>
                ))}                        
                {/* <Route exact path={"/test"}  component={TEST} /> */}
                <Route exact path={"/home"}  component={Home} />
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
        
    );
};

export default Router;