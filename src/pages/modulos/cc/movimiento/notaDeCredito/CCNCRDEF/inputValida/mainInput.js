import mainUrl    from '../url/mianUrl';
import mainColumn from '../columnModal/mianColumn';

const validaInput = [
  {
    input: 'COD_SUCURSAL',
    url: mainUrl.url_valida_sucursal,
    out:[ 'DESC_SUCURSAL','USA_IMP_LASER'],
    data:[],
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
    out:[ 'DESC_CLIENTE'  , 'CLIENTE_PERSONA'      , 'RUC'
        , 'TEL_CLIENTE'   , 'COD_CONDICION_VENTA'  , 'DIAS_INICIAL'
        , 'LIMITE_CREDITO', 'SIGLAS'               , 'SALDOS'
        , 'COD_ZONA'      , 'IND_SUBCLI'           , 'COD_SUBCLIENTE'
        , 'NOM_SUBCLIENTE', 'DIR_CLIENTE'          , 'CI'],
    data:['FEC_COMPROBANTE','CLIENTE_OCA'],
    rel:[],
    next: 'NRO_COMPROBANTE_REF', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'NRO_COMPROBANTE_REF',
    url: mainUrl.url_valida_nroCompr,
    out:[ 'CON_NCE'            , 'COD_ZONA'        , 'COD_VENDEDOR'      , 'VENDEDOR_PERSONA'   ,
          'COD_CONDICION_VENTA', 'COD_LISTA_PRECIO', 'COD_MONEDA'        , 'COD_DEPOSITO'       ,
          'NOM_CLIENTE'        , 'DIR_CLIENTE'     , 'RUC'               , 'CI'                 ,
          'SER_REFERENCIA'     , 'TIP_REFERENCIA'  , 'NRO_REFERENCIA'    , 'COD_MOTIVO_NCR'     ,
          'IND_TELEV'          , 'COD_SUPERVISOR'  , 'SUPERVISOR_PERSONA', 'TEL_CLIENTE'        ,
          'NOM_CLIENTE'        , 'ESTADO'          , 'OBSERVACION'       ,  'NRO_NCR_CLIENTE'   ,
          'IND_VENTA'          , 'COD_MONEDA_REF'  , 'TIP_CAMBIO_REF'    , 'TOT_COMPROBANTE_REF' ],
    data:['TIP_COMPROBANTE_REF','SER_COMPROBANTE_REF','COD_CLIENTE','COD_SUBCLIENTE'],
    rel:[],
    next: 'COD_CONDICION_VENTA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  }
  ,{
    input: 'COD_SUBCLIENTE',
    url: mainUrl.url_valida_subcliente,
    out:['NOM_SUBCLIENTE'  , 'DIR_CLIENTE'  , 'COD_ZONA'],
    data:['COD_CLIENTE','IND_SUBCLI','CLIENTE_OCA'],
    rel:[],
    next: 'COD_ZONA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_ZONA',
    url: mainUrl.url_valida_zona,
    out:['DESC_ZONA'],
    data:['COD_CLIENTE','COD_SUBCLIENTE','CLIENTE_OCA'],
    rel:[],
    next: 'NRO_COMPROBANTE_REF', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_CONDICION_VENTA',
    url: mainUrl.url_valida_condventa,
    out:['DESC_CONDICION'],
    data:['TIP_COMPROBANTE_REF'],
    rel:[],
    next: 'COD_MOTIVO_NCR', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_MOTIVO_NCR',
    url: mainUrl.url_valida_motivoncr,
    out:['DESC_MOTIVO_NCR','AFECT_STOCK','CARGA_REF'],
    data:[],
    rel:[],
    next: 'COD_LISTA_PRECIO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,
  },{
    input: 'COD_LISTA_PRECIO',
    url: mainUrl.url_valida_listPrecio,
    out:['DESC_LISTA_PRECIO'],
    data:[],
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
    out:['DESC_VENDEDOR'],
    data:['VENDEDOR_PERSONA','COD_CLIENTE','COD_SUBCLIENTE'],
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
    url: mainUrl.url_valida_moneda,
    out:['DESC_MONEDA','DECIMALES','TIP_CAMBIO'],
    data:[],
    rel:[],
    next: 'NRO_NCR_CLIENTE', 
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
  "COD_SUCURSAL"         : {title: 'Sucursal'    , column: mainColumn.column_sucursal    , url: mainUrl.url_buscar_sucursal   },  
  "COD_CLIENTE"          : {title: 'Cliente'     , column: mainColumn.column_cliente     , url: mainUrl.url_buscar_cliente    },
  "COD_ZONA"             : {title: 'Zona'        , column: mainColumn.column_zona        , url: mainUrl.url_buscar_zona       },
  "NRO_COMPROBANTE_REF"  : {title: 'Referencia'  , column: mainColumn.column_NroCompRef  , url: mainUrl.url_buscar_nroCompr   },  
  "COD_CONDICION_VENTA"  : {title: 'Cond Venta'  , column: mainColumn.column_CondVenta   , url: mainUrl.url_buscar_condventa  },  
  "COD_MOTIVO_NCR"       : {title: 'Motivo'      , column: mainColumn.column_Motivoncr   , url: mainUrl.url_buscar_motivoncr  },  
  "COD_LISTA_PRECIO"     : {title: 'Lista Precio', column: mainColumn.column_listaPrecio , url: mainUrl.url_buscar_listPrecio },  
  "COD_VENDEDOR"         : {title: 'Vendedor'    , column: mainColumn.column_vendedor    , url: mainUrl.url_buscar_vendedor   },  
  "COD_MONEDA"           : {title: 'Moneda'      , column: mainColumn.column_moneda      , url: mainUrl.url_buscar_moneda     },  
 }

const main = {
    validaInput
  , restablecerValida
  , ModalF9
}

export default main;