const columns = [
  { data: 'COD_SUCURSAL'    , title: 'Suc.'       , width : 8   , className: 'htLeft'   , readOnly:true   }, 
  { data: 'REFERENCIA'      , title: 'Referencia' , width : 25  , className: 'htLeft'   , readOnly:true   },  
  { data: 'TIP_COMPROBANTE' , title: 'Tipo'       , width : 12  , className: 'htLeft'   , readOnly:true   }, 
  { data: 'SER_COMPROBANTE' , title: 'Serie'      , width : 12  , className: 'htLeft'   , readOnly:true   }, 
  { data: 'NRO_COMPROBANTE' , title: 'Número'     , width : 15  , className: 'htRight'  , readOnly:true    , type:'numeric'}, 
  { data: 'FEC_COMPROBANTE' , title: 'Fecha'      , width : 15  , className: 'htLeft'   , readOnly:true    , type:'date'   }, 
  { data: 'COD_PROVEEDOR'   , title: 'Prov.'      , width : 15  , className: 'htLeft'   , readOnly:true   },  
  { data: 'NOMBRE'          , title: ''           , width : 100 , className: 'htLeft'   , readOnly:true   },  
  { data: 'ESTADO'          , title: 'Aut'        , width : 8   , className: 'htCenter' , readOnly:false   , type:'checkbox', checkbox:['C','P'],validaAllExterno:true},
  { data: 'BUTTON1'         , title: ''           , width : 5   , className: 'htCenter' , icon:"BI"        , type:'BUTTON'},
  { data: 'BUTTON1'         , title: ''           , width : 5   , className: 'htCenter' , icon:"IM"        , type:'BUTTON'}
]

const main = {
  columns
}

export default main;