// DEFINICION
import vtvende   from "../../pages/modulos/vt/definiciones/VTVENDE/VTVENDE";
// MOVIMIENTO
import vtpresar  from "../../pages/modulos/vt/movimiento/VTPRESAR/VTPRESAR";
import vtpedido  from "../../pages/modulos/vt/movimiento/VTPEDIDO/VTPEDIDO";
import vtfactur  from "../../pages/modulos/vt/movimiento/VTFACTUR/VTFACTUR";
// CATASTRO
import vtclient from "../../pages/modulos/vt/definiciones/catastro/VTCLIENT/VTCLIENT";
// LIST PRECIO
import vtlispre from "../../pages/modulos/vt/definiciones/precio/VTLISPRE/VTLISPRE";

const Route = [
  // DEFINICION
  { path: '/vt/vtclient',
    component: vtclient
  },{
    path:'/vt/vtvende',
    component:vtvende
  },{
    path:'/vt/vtlispre',
    component:vtlispre
  },{
    path:'/vt/vtpresar',
    component:vtpresar
  },{
    path:'/vt/vtpedido',
    component:vtpedido
  },{
    path:'/vt/vtfactur', 
    component:vtfactur
  }
];
export default Route;