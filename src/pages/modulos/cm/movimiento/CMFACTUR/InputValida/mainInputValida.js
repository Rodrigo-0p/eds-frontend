import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'COD_SUCURSAL',
    url: mainUrl.url_valida_sucursal,  
    out:[ 'DESC_SUCURSAL','IND_TIMBRADO','AFECTA_COSTO'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'NRO_COMPROBANTE', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_PROVEEDOR',
    url: mainUrl.url_valida_proveedor,
    out:[ 'DESC_PROVEEDOR'
        , 'EXENTO'
        , 'COD_CONDICION_COMPRA'
        , 'COD_CONDICION_COMPRA_ANT'
        , 'DESC_CONDICION'
        , 'COD_MONEDA'
        , 'DESC_MONEDA'
        , 'DECIMALES'
        , 'TIP_CAMBIO'
        , 'NRO_TIMBRADO'
        , 'IND_DIF_PRECIO'
        , 'IND_ODC'
    ],
    data:['COD_EMPRESA','COD_SUCURSAL'],
    rel:[],
    next: 'COD_PROVEEDOR_ANT', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,  
  },{
    input: 'FEC_COMPROBANTE',
    url: mainUrl.url_valida_fec_compr,
    out:['FEC_COMPROBANTE'],
    data:['FEC_COMPROBANTE'],
    rel:[],
    next: 'FEC_EMBARQUE', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,  
  },{
    input: 'COD_PROVEEDOR_ANT',
    url: mainUrl.url_valida_prov_ant,
    out:['DESC_PROVEEDOR_ANT'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_CONDICION_COMPRA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: false ,
    idFocus   : true  ,
    idSelect  : false ,  
  },{
    input: 'COD_CONDICION_COMPRA',
    url: mainUrl.url_valida_cond_com,
    out:['DESC_CONDICION','PLAZO','BLOQ_X_COND'],
    data:['COD_EMPRESA','COD_CONDICION_COMPRA','COD_CONDICION_COMPRA_ANT'],
    rel:[],
    next: 'COD_MONEDA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,  
  },{
    input: 'COD_MONEDA',
    url: mainUrl.url_valida_cod_moneda,
    out:['DESC_MONEDA','DECIMALES','TIP_CAMBIO','TIP_CAMBIO_US','TIP_CAMBIO_RS'],
    data:['COD_MONEDA','COD_MONEDA_BASE','COD_MONEDA_DOL','COD_MONEDA_REAL','TIP_CAMBIO','FEC_COMPROBANTE'],
    rel:[],
    next: '', 
    // ---
    requerido  : true  ,
    valor_ant  : null  ,
    validaNull : true  ,
    idFocus    : false ,
    idSelect   : false ,  
    nextEjecute: true  ,
  },{
    input: 'COD_DEPOSITO',
    url: mainUrl.url_valida_deposito,
    out:['DESC_DEPOSITO'],
    data:['COD_EMPRESA','COD_SUCURSAL'],
    rel:[],
    next: 'NRO_TIMBRADO', 
    // ---
    requerido : true  ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,  
  },{
    input: 'REFERENCIA',
    url: mainUrl.url_valida_referencia,
    out:[],
    data:['COD_EMPRESA','IND_AUTO_IMPRESO','COD_PROVEEDOR','NRO_TIMBRADO','IND_TIMBRADO'],
    rel:[],
    next: '', 
    // ---
    requerido : true  ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : false  ,
    idSelect  : false ,  
    nextEjecute:true
  },
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_SUCURSAL"         : {title: 'Sucursal' , column: mainColumn.columns_sucursal      , url: mainUrl.url_buscar_sucursal    },
  "COD_PROVEEDOR"        : {title: 'Proveedor', column: mainColumn.columns_proveedor     , url: mainUrl.url_buscar_proveedor   },
  "COD_PROVEEDOR_ANT"    : {title: 'Proveedor', column: mainColumn.columns_proveedor_ant , url: mainUrl.url_buscar_prov_ant    },
  "COD_CONDICION_COMPRA" : {title: 'Cond Comp', column: mainColumn.columns_cond_compra   , url: mainUrl.url_buscar_cond_com    },
  "COD_MONEDA"           : {title: 'Moneda'   , column: mainColumn.columns_cod_moneda    , url: mainUrl.url_buscar_cod_moneda  },
  "COD_DEPOSITO"         : {title: 'Depósito' , column: mainColumn.columns_cod_deposito  , url: mainUrl.url_buscar_deposito    },
}

const main = {
  validaInput
, restablecerValida
, ModalF9
}

export default main