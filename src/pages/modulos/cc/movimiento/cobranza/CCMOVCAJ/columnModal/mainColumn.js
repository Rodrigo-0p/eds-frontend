const columns_ref = [
  { data: 'TIP_COMPROBANTE'  , title: 'Tipo'             , width : 20  , className: 'htLeft' , readOnly:true }, 
  { data: 'NRO_COMPROBANTE'  , title: 'Comprobante'      , width : 50  , className: 'htLeft' , readOnly:false}, 
  { data: 'NRO_CUOTA'        , title: 'Cuota'            , width : 30  , className: 'htLeft' , readOnly:false}, 
  { data: 'COD_MONEDA'       , title: 'Mon.'             , width : 30  , className: 'htLeft' , readOnly:false},  
  { data: 'TIP_CAMBIO'       , title: 'Cambio'           , width : 30  , type:'numeric'      , className:'htRight' , readOnly:true , format:{pattern:'0.00',culture:'de-DE'}},
  { data: 'TOT_COMPROBANTE'  , title: 'Total Comprobante', width : 100 , type:'numeric'      , className:'htRight' , readOnly:false, format:{pattern:'0,0' ,culture:'de-DE'}},
  { data: 'IMPORTE'          , title: 'Importe'          , width : 100 , type:'numeric'      , className:'htRight' , readOnly:true , format:{pattern:'0,0' ,culture:'de-DE'}},
]
const next_ref = [1,2,3,4,5]

const columns_det = [
  { data: 'SUB_TIPO_TRANS'       , title: 'Trans'            , width : 30  , className: 'htLeft' , readOnly:false ,requerido:true },
  { data: 'TIP_DOCUMENTO'        , title: 'Tipo'             , width : 30  , className: 'htLeft' , readOnly:true  ,requerido:true },
  { data: 'SER_DOCUMENTO'        , title: 'Serie'            , width : 30  , className: 'htLeft' , readOnly:false ,requerido:true },
  { data: 'NRO_DOCUMENTO'        , title: 'Número'           , width : 45  , className: 'htLeft' , readOnly:false },
  { data: 'COD_BANCO_CLIENTE'    , title: 'Banco'            , width : 30  , className: 'htLeft' , readOnly:false },
  { data: 'NRO_CUENTA'           , title: 'Cuenta Bancaria.' , width : 48  , className: 'htLeft' , readOnly:false },
  { data: 'FEC_VENCIMIENTO'      , title: 'Fecha/Venc.'      , width : 40  , className: 'htLeft' , readOnly:false  , type:'date'},
  { data: 'COD_MONEDA_COBRO'     , title: 'Mon.'             , width : 20  , className: 'htLeft' , readOnly:false  , requerido:true },
  { data: 'TIP_CAMBIO'           , title: 'Cambio'           , width : 35  , type:'numeric'      , className:'htRight', readOnly:false, format:{pattern:'0,0.00',culture:'de-DE' } ,requerido:true },
  { data: 'NRO_CUENTA_CAJA_CHICA', title: 'Caja Interna'     , width : 40  , className: 'htLeft' , readOnly:true },
  { data: 'DESC_CAJA_CHICA'      , title: 'Descp.'           , width : 80  , className: 'htLeft' , readOnly:true },
  { data: 'MONTO'                , title: 'Monto documento'  , width : 60  , type:'numeric'      , className:'htRight' , readOnly:false , format:{pattern:'0,0.00', culture:'de-DE'} ,requerido:true },
  { data: 'IMPORTE'              , title: 'Importe'          , width : 55  , type:'numeric'      , className:'htRight' , readOnly:true  , format:{pattern:'0,0'   , culture:'de-DE'}},
]
const next_det = [0,2,3,4,5,6,7,8,9,11]

// F9
const columns_moneda = [
  { data: 'COD_MONEDA'    , title: 'Código'        , className:'htreft'  },
  { data: 'DESC_MONEDA'   , title: 'Descripción'   , className:'htreft'  },
]
const columns_cliente = [
  { data: 'COD_CLIENTE'   , title: 'Código'        , className:'htreft'  },
  { data: 'DESC_CLIENTE'  , title: 'Descripción'   , className:'htreft'  },
]
const columns_sub_tipo_trans = [
  { data: 'SUB_TIPO_TRANS'   , title: 'Código'     , className:'htreft'  },
  { data: 'DESC_TRANSACCION' , title: 'Descripción', className:'htreft'  },
]

const columns_nro_documento = [
  { data:'NRO_COMPROBANTE' , title: 'Código'    , className:'htreft'},
  { data:'SER_COMPROBANTE' , title: 'Ser.'      , className:'htreft'},
  { data:'TIP_COMPROBANTE' , title: 'Tip.'      , className:'htreft'},
  { data:'FEC_COMPROBANTE' , title: 'Fec Comp'  , className:'htreft'},
  { data:'TOT_COMPROBANTE' , title: 'Total Comp', className:'htreft' , type:'numeric',format:{pattern:'0,0', culture:'de-DE'}},
]

const columns_cod_banco_cliente = [
  { data:'COD_BANCO_CLIENTE', title: 'Código'     , className:'htreft'},
  { data:'NOMBRE'           , title: 'Descripción', className:'htreft'},
  { data:'COD_BANCO'        , title: 'Banco'      , className:'htreft'},
]

const columns_cod_moneda_cobro = [
  { data:'COD_MONEDA_COBRO', title: 'Código'     , className:'htreft'},
  { data:'DESC_MONEDA'     , title: 'Descripción', className:'htreft'},
]

const main = {
  columns_ref     ,
  next_ref        ,
  // ==
  columns_det     ,  
  next_det        ,
  // == F9
  columns_moneda  ,
  columns_cliente ,
  columns_sub_tipo_trans    ,
  columns_nro_documento     ,
  columns_cod_banco_cliente ,
  columns_cod_moneda_cobro  ,
}

export default main;