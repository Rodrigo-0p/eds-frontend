const columns = [
  { data: 'NRO_COMPROBANTE' , title: 'Comprob.'   , width : 15  , className: 'htRight'  , readOnly:true   }, 
  { data: 'TIP_COMPROBANTE' , title: 'Tipo'       , width : 12  , className: 'htLeft'   , readOnly:true    , upper:true    }, 
  { data: 'FEC_COMPROBANTE' , title: 'Fec Emisión', width : 17  , className: 'htLeft'   , readOnly:true    , type:'date'   }, 
  { data: 'COD_CLIENTE'     , title: 'Cliente'    , width : 15  , className: 'htLeft'   , readOnly:true   },  
  { data: 'NOM_CLIENTE'     , title: 'Descripción', width : 100 , className: 'htLeft'   , readOnly:true    , textWrap:true }, 
  { data: 'SIGLAS'          , title: 'Mon.'       , width : 12  , className: 'htLeft'   , readOnly:true   },  
  { data: 'SALDO_CUOTA'     , title: 'Monto'      , width : 30  , className: 'htRight'  , type:'numeric'   , format:{pattern: '0,0.000'}        , validaAllExterno:true},
  { data: 'IND_AUTORIZAR'   , title: 'Aut.'       , width : 10  , className: 'htCenter' , readOnly:false   , type:'checkbox', checkbox:['D','N'], validaAllExterno:true},
  { data: 'IND_RUBRICAR'    , title: 'Rub.'       , width : 10  , className: 'htCenter' , readOnly:false   , type:'checkbox', checkbox:['R','N'], validaAllExterno:true},
  { data: 'BUTTON1'         , title: ''           , width : 9   , className: 'htCenter' , icon:"BI"        , type:'BUTTON'}
]

const main = {
  columns
}

export default main;