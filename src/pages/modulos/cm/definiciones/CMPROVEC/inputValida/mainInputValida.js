import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';


var validaInput = [
  {
    input: 'COD_PROVEEDOR_REF',
    url: mainUrl.url_validar_proveedor_fef,  
    out:[ 'DESC_PROVEEDOR_REF'],
    data:[],
    rel:[],
    next: 'COD_CUENTA_CONTABLE', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: false ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_CUENTA_CONTABLE',
    url: mainUrl.url_validar_cuenta_contable,  
    out:['DESC_CUENTA_CONTABLE'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_CUENTA_CONT', 
    // ---
    requerido : false,
    valor_ant : null ,
    validaNull: false ,
    idFocus   : true,
    idSelect  : false ,    
  },{
    input: 'COD_CUENTA_CONT',
    url: mainUrl.url_validar_cuenta_cont,  
    out:[ 'DESC_CUENTA_REF'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_BANCO', 
    // ---
    requerido : false,
    valor_ant : null ,
    validaNull: false ,
    idFocus   : false,
    idSelect  : true ,    
  },{
    input: 'COD_BANCO',
    url: mainUrl.url_validar_banco,  
    out:[ 'DESC_BANCO'],
    data:[],
    rel:[],
    next: 'COD_CONDICION_COMPRA', 
    // ---
    requerido : false,
    valor_ant : null ,
    validaNull: false ,
    idFocus   : false,
    idSelect  : true ,    
  },{
    input: 'COD_CONDICION_COMPRA',
    url: mainUrl.url_validar_codCompra,  
    out:[ 'DESC_CONDICION_COMPRA'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_MONEDA', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: false ,
    idFocus   : false,
    idSelect  : true ,    
  },{
    input: 'COD_MONEDA',
    url: mainUrl.url_validar_codMoneda,  
    out:[ 'DESC_MONEDA'],
    data:[],
    rel:[],
    next: 'CUENTA_BANCARIA', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: false ,
    idFocus   : false,
    idSelect  : true ,    
  },{
    input: 'CANT_DIA_ANT',
    url: mainUrl.url_validar_limite_rendicion,
    out:['CANT_DIA_ANT'],
    data:[],
    rel:[],
    next: 'IND_PRIORIDAD', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: false ,
    idFocus   : false,
    idSelect  : true ,    
  }
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_PROVEEDOR_REF"    : {title: 'Proveedor'        , column: mainColumn.columns_proveedor_ref , url: mainUrl.url_buscar_proveedor_fef   },
  "COD_CUENTA_CONTABLE"  : {title: 'Cuenta Contable ' , column: mainColumn.columnCuentaContable  , url: mainUrl.url_buscar_cuenta_contable },
  "COD_CUENTA_CONT"      : {title: 'Cuenta Cont'      , column: mainColumn.columnCuentaCont      , url: mainUrl.url_buscar_cuenta_cont     },
  "COD_CONDICION_COMPRA" : {title: 'Condición Compra' , column: mainColumn.columnCondicionCompra , url: mainUrl.url_buscar_codCompra       },
  "COD_MONEDA"           : {title: 'Moneda'           , column: mainColumn.columnMoneda          , url: mainUrl.url_buscar_codMoneda       },
  "COD_BANCO"            : {title: 'Banco'            , column: mainColumn.columnBanco           , url: mainUrl.url_buscar_banco           }
}

const main = {
  validaInput
, restablecerValida
, ModalF9
}

export default main