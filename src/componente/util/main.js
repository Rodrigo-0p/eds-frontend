import _                       from 'underscore'
import { Request }             from '../../config/request';
import axios                   from 'axios';
import { message,Spin }        from 'antd';
import { activarSpinner
       , desactivarSpinner }   from './sppiner';
import Antlayout               from './antLayout';
import Helmet                  from 'react-helmet';

const mayuscula    = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
};


const Main = {
    _,
    mayuscula,
    Request,
    axios,
    message,
    activarSpinner,
    desactivarSpinner,
    Spin,
    Antlayout,
    Helmet
}


export default Main;