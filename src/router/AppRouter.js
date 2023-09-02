import React                        from 'react';
import { HashRouter, Route }        from 'react-router-dom';
import _                            from "underscore";

// Componete
import Lgn                          from './lg/rLogin'
import Home                         from '../pages/Home';
import PrivateRoute                 from '../router/PrivateRouter';
const Router = () => {
    const route = _.union(Lgn);
    return (
        <HashRouter>            
            {route.map((item) => (                
                <Route exact 
                    key={item.path}
                    path={item.path} 
                    component={item.component}/>
            ))}                        
            <Route exact path={"/home"} component={Home} />
            <Route exact path={"/private"} component={PrivateRoute} />            
        </HashRouter>
    );
};

export default Router;