import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumna';

var validaInput = [
  {
    input: 'COD_CLIENTE',
    url: mainUrl.url_valida_cliente,  
    out:[ 'DESC_CLIENTE'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'NRO_CUENTA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'NRO_CUENTA',
    url: mainUrl.url_valida_cuenta,  
    out:[ 'DESC_CUENTA'],
    data:['COD_EMPRESA','COD_USUARIO'],
    rel:[],
    next: 'FCO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  }
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_CLIENTE"  : {title: 'Cliente'    , column: mainColumn.columns_cliente    , url: mainUrl.url_buscar_cliente  },
  "NRO_CUENTA"   : {title: 'Nro. Cuenta', column: mainColumn.columns_cuenta     , url: mainUrl.url_buscar_cuenta   },
}

const main = {
  validaInput
, restablecerValida
, ModalF9
}

export default main