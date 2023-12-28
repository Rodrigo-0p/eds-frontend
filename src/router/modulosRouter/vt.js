// DEFINICION
import vtvende  from "../../pages/modulos/vt/definiciones/VTVENDE/VTVENDE";
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
  }
];
export default Route;