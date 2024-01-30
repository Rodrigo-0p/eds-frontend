import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'COD_SUCURSAL',
    url: mainUrl.url_valida_sucursal,  
    out:[ 'DESC_SUCURSAL'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_MOTIVO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_MOTIVO',
    url: mainUrl.url_valida_motivo,
    out:[ 'DESC_MOTIVO','IND_ENT_SAL','AFECTA_COSTO'],
    data:['COD_EMPRESA','COD_SUCURSAL'],
    rel:[],
    next: 'COD_DEPOSITO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_DEPOSITO',
    url: mainUrl.url_valida_deposito,
    out:[ 'DESC_DEPOSITO'],
    data:['COD_EMPRESA','COD_SUCURSAL'],
    rel:[],
    next: 'COD_PROVEEDOR', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_PROVEEDOR',
    url: mainUrl.url_valida_proveedor,
    out:[ 'DESC_PROVEEDOR'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_MONEDA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,  
  },{
    input: 'COD_DEPOSITO',
    url: mainUrl.url_valida_deposito,
    out:[ 'DESC_DEPOSITO'],
    data:['COD_EMPRESA','COD_SUCURSAL'],
    rel:[],
    next: 'COD_PROVEEDOR', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_MONEDA',
    url: mainUrl.url_valida_moneda,
    out:[ 'DESC_MONEDA','DECIMALES','TIP_CAMBIO','TIP_CAMBIO_US'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'OBSERVACION', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,  
    nextEjecute:true
  }
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_SUCURSAL"  : {title: 'Sucursal' , column: mainColumn.columns_sucursal  , url: mainUrl.url_buscar_sucursal  },
  "COD_MOTIVO"    : {title: 'Motivo'   , column: mainColumn.columns_motivo    , url: mainUrl.url_buscar_motivo    },
  "COD_DEPOSITO"  : {title: 'Deposito' , column: mainColumn.columns_deposito  , url: mainUrl.url_buscar_deposito  },
  "COD_PROVEEDOR" : {title: 'Proveedor', column: mainColumn.columns_proveedor , url: mainUrl.url_buscar_proveedor },
  "COD_MONEDA"    : {title: 'Moneda'   , column: mainColumn.columns_moneda    , url: mainUrl.url_buscar_moneda    },
}

const main = {
  validaInput
, restablecerValida
, ModalF9
}

export default main