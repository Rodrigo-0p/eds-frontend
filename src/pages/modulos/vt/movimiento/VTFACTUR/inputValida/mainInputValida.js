import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'COD_SUCURSAL',
    url: mainUrl.url_valida_sucursal,  
    out:[ 'DESC_SUCURSAL'],
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
    out:['NOM_CLIENTE','DIR_CLIENTE','RUC','TEL_CLIENTE','DIAS_INICIAL','LIMITE_CREDITO','SIGLAS','SALDO','COD_ZONA','IND_SUBCLI'],
    data:['COD_EMPRESA','FEC_COMPROBANTE'],
    rel:[],
    next: 'COD_SUBCLIENTE', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_SUBCLIENTE',
    url: mainUrl.url_valida_subcliente,  
    out:[ 'NOM_SUBCLIENTE'],
    data:['COD_EMPRESA','COD_CLIENTE'],
    rel:[],
    next: 'COD_VENDEDOR', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_VENDEDOR',
    url: mainUrl.url_valida_vendedor,
    out:[ 'DESC_VENDEDOR'],
    data:['COD_EMPRESA','COD_VENDEDOR'],
    rel:[],
    next: 'COD_LISTA_PRECIO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,
    // nextEjecute:true  ,
  },{
    input: 'COD_LISTA_PRECIO',
    url: mainUrl.url_valida_lista_precio,
    out:[ 'DESC_LISTA_PRECIO'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_MONEDA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,
    // nextEjecute:true  ,
  },{
    input: 'COD_MONEDA',
    url: mainUrl.url_valida_moneda,
    out:[ 'DESC_MONEDA', 'DECIMALES','TIP_CAMBIO'],
    data:['COD_MONEDA'],
    rel:[],
    next: 'COD_CONDICION_VENTA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,
    // nextEjecute:true  ,
  },{
    input: 'COD_CONDICION_VENTA',
    url: mainUrl.url_valida_condicion_venta,
    out:[ 'DESC_CONDICION_VENTA', 'LIM_PORC_DESC','DIAS_INICIAL','BLOQUEAR','IND_TIPO','IND_VTA_ESP','IND_COND_VTA'],
    data:['COD_EMPRESA','COD_CLIENTE','TIP_COMPROBANTE_REF','COD_CONDICION_VENTA'],
    rel:[],
    next: 'COD_DEPOSITO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,
    // nextEjecute:true  ,
  },{
    input: 'COD_DEPOSITO',
    url: mainUrl.url_valida_deposito,
    out:['DESC_DEPOSITO'],
    data:['COD_EMPRESA','COD_SUCURSAL','COD_LISTA_PRECIO'],
    rel:[],
    next: 'COMENTARIO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,
    // nextEjecute:true  ,
  }, 
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_SUCURSAL"     : {title: 'Sucursal'         , column: mainColumn.columns_sucursal     , url: mainUrl.url_buscar_sucursal     },
  "COD_CLIENTE"      : {title: 'Cliente'          , column: mainColumn.columns_cliente      , url: mainUrl.url_buscar_cliente      },
  "COD_SUBCLIENTE"   : {title: 'Sub Cliente'      , column: mainColumn.columns_subcliente   , url: mainUrl.url_buscar_subcliente   },
  "COD_VENDEDOR"     : {title: 'Vendedor'         , column: mainColumn.columns_vendedor     , url: mainUrl.url_buscar_vendedor     },
  "COD_LISTA_PRECIO" : {title: 'Lista de Precios' , column: mainColumn.columns_lista_precio , url: mainUrl.url_buscar_lista_precio },
}

const main = {
  validaInput
, restablecerValida
, ModalF9
}

export default main