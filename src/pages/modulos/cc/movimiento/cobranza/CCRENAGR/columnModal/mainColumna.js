const columnDet = [
  { data: 'TIP_COMPROBANTE'     , title: 'Tip'            , width : 15  , className:'htLeft'  , readOnly:true} , 
  { data: 'NRO_COMPROBANTE'     , title: 'Nro Comprob.'   , width : 50  , className:'htRight' , readOnly:true} , 
  { data: 'NRO_FACTURA_INPASA'  , title: 'Factura Inp.'   , width : 36  , className:'htLeft'  , readOnly:true} , 
  { data: 'FEC_COMPROBANTE'     , title: 'Fec. Emisíon'   , width : 40  , className:'htLeft'  , readOnly:true} , 
  { data: 'COD_CLIENTE'         , title: 'Cliente'        , width : 30  , className:'htRight' , readOnly:true} , 
  { data: 'COD_SUBCLIENTE'      , title: 'Cod. SubClie.'  , width : 40  , className:'htRight' , readOnly:true} ,
  { data: 'COD_CLIENTE_REF'     , title: 'Cod. Clie. Ref.', width : 40  , className:'htRight' , readOnly:true} ,
  { data: 'DESC_SUBCLIENTE'     , title: 'Descripcion'    , width : 120 , className:'htRight' , readOnly:true  , textWrap: true} , 
  { data: 'SIGLAS'              , title: 'Sigla'          , width : 40  , className:'htRight' , readOnly:true  , filter:false }, 
  { data: 'TOTAL'               , title: 'Saldo'          , width : 60  , className:'htRight' , type:'numeric' , readOnly:true      , format:{pattern:'0,0' , culture:'de-DE'}},
  { data: 'MONTO_A_COBRAR'      , title: 'Monto a Cobrar' , width : 60  , className:'htRight' , type:'numeric' , readOnly:false     , format:{pattern:'0,0' , culture:'de-DE'} , validaAllExterno:true},
  { data: 'IND_COBRAR'          , title: 'Pag.'           , width : 20  , className:'htCenter', type:'checkbox', checkbox:['S','N'] , readOnly:false  , validaAllExterno:true}, 
]

const columnModal = {
  urlValidar : [],
  urlBuscador: [],
  title      : [],  
  config:{},
};

const columnNavigationEnter = [0,1,2,3,4,5,6,9]

// F9
const columns_cliente = [
  { data: 'COD_CLIENTE'   , title: 'Código'      , className:'htreft' },
  { data: 'DESC_CLIENTE'  , title: 'Descrición'  , className:'htreft' },
]

const columns_cuenta = [
  { data: 'NRO_CUENTA'  , title: 'Código'     , className:'htreft' },
  { data: 'DESC_CUENTA' , title: 'Referencia' , className:'htreft' },
  { data: 'COD_BANCO'   , title: 'Cód.'       , className:'htreft' },
  { data: 'NOM_BANCO'   , title: 'Banco'      , className:'htreft' },
  { data: 'DESC_MONEDA' , title: 'Moneda'     , className:'htreft' },
]

const main = {
  columnDet             ,
  columnNavigationEnter ,
  columnModal           ,
  columns_cliente       ,
  columns_cuenta
}

export default main;