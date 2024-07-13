import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'COD_VENDEDOR',
    url: mainUrl.url_valida_vendedor,  
    out:[ 'DESC_VENDEDOR'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_CONDICION_VENTA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_CONDICION_VENTA',
    url: mainUrl.url_valida_codVenta,  
    out:[ 'DESC_CONDICION_VENTA'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_CLIENTE', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_CLIENTE',
    url: mainUrl.url_valida_cliente,  
    out:['DESC_CLIENTE','RUC','TELEFONO','SEXO','DIRECCION' , 'DIREC_ELECTRONICA','ES_FISICA'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_SUBCLIENTE', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect   : false ,
    nextEjecute: false ,
  },{
    input: 'COD_SUBCLIENTE',
    url: mainUrl.url_valida_subClien,  
    out:['DESC_SUBCLIENTE'],
    data:['COD_EMPRESA','COD_CLIENTE'],
    rel:[],
    next: 'COD_LISTA_PRECIO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect   : false ,
    nextEjecute: false ,
  },{
    input: 'COD_MONEDA',
    url: mainUrl.url_valida_moneda,  
    out:['DESC_MONEDA','DECIMALES','TIP_CAMBIO','TIP_CAMBIO_US'],
    data:['COD_MONEDA_US','FEC_COMPROBANTE'],
    rel:[],
    next: 'COD_MONEDA', 
    // ---
    requerido  : false ,
    valor_ant  : null  ,
    validaNull : true  ,
    idFocus    : true  ,
    idSelect   : false ,
    nextEjecute: true  ,
  },
  {
    input: 'COD_LISTA_PRECIO',
    url: mainUrl.url_valida_listPrec,  
    out:['DESC_LISTA_PRECIO','COD_MONEDA','DESC_MONEDA','DECIMALES','TIP_CAMBIO','TIP_CAMBIO_US'],
    data:['COD_EMPRESA','COD_MONEDA_US','FEC_COMPROBANTE'],
    rel:[],
    next: 'COD_LISTA_PRECIO', 
    // ---
    requerido  : false ,
    valor_ant  : null  ,
    validaNull : true  ,
    idFocus    : true  ,
    idSelect   : false ,
    nextEjecute: true  ,
  },
]

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_VENDEDOR"         : {title: 'Vendedor'        , column: mainColumn.column_vendor      , url: mainUrl.url_buscar_vendedor   },
  "COD_CONDICION_VENTA"  : {title: 'Cond Venta'      , column: mainColumn.column_codVenta    , url: mainUrl.url_buscar_codVenta   }, 
  "COD_CLIENTE"          : {title: 'Cond Cliente'    , column: mainColumn.column_cliente     , url: mainUrl.url_buscar_cliente    }, 
  "COD_SUBCLIENTE"       : {title: 'Cond Sub Cliente', column: mainColumn.column_Subcliente  , url: mainUrl.url_buscar_subclien   }, 
  "COD_MONEDA"           : {title: 'Moneda'          , column: mainColumn.column_moneda      , url: mainUrl.url_buscar_moneda     }, 
  "COD_LISTA_PRECIO"     : {title: 'Lista Precio'    , column: mainColumn.column_listaPrecio , url: mainUrl.url_buscar_listPrec   }, 
}

const main = {
  validaInput,
  ModalF9,
  restablecerValida
}

export default main