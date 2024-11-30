import mainUrl     from '../url/mainUrl'
import mainColumn  from '../columnModal/mainColumn';
import mainInicial from '../ObjetoInicial/mainInicial';

var validaInput = [
  {
   input: 'COD_MONEDA',
    url :mainUrl.url_valida_moneda,  
    out :['DESC_MONEDA','DECIMALES','TIP_CAMBIO'],
    data:['COD_EMPRESA','FEC_MOV_CAJ'],
    rel :[],
    next: 'COD_CLIENTE',
    // ---
    requerido : true  ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },
  {
    input: 'COD_CLIENTE',
     url :mainUrl.url_valida_cliente,  
     out :['DESC_CLIENTE','IND_INPASA'],
     data:['COD_EMPRESA'],
     rel :[],
     next: 'NRO_COMPR_REF',
     // ---
     requerido : true  ,
     valor_ant : null  ,
     validaNull: true  ,
     idFocus   : true  ,
     idSelect  : false ,    
   },
   {
    input: 'NRO_COMPR_REF',
     url :mainUrl.url_valida_nroPlaRef,  
     out :[],
     data:['COD_EMPRESA','COD_CLIENTE','TIP_COMPR_REF'],
     rel :[],
     next: 'NRO_MOV_CAJ',
     // ---
     requerido : false  ,
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
  "COD_MONEDA"  : {title: 'Moneda'    , column: mainColumn.columns_moneda    , url: mainUrl.url_buscar_moneda  },
  "COD_CLIENTE" : {title: 'Cliente'   , column: mainColumn.columns_cliente   , url: mainUrl.url_buscar_cliente },
}

const FormName   = 'CCMOVCAJ';
const idCompRef  = `GRIDREF_${FormName}`
const idCompDet  = `GRIDDET_${FormName}`

const validaInputGrid = {
         [idCompRef] :[{ input:'NRO_COMPROBANTE',
                          url_valida:mainUrl.url_valida_nroCompRef,
                          params:['COD_EMPRESA', 'TIP_COMPROBANTE', 'SER_COMPROBANTE',
                                , 'COD_CLIENTE', 'TIP_COMPR_REF'  , 'NRO_COMPR_REF'],
                          nexFocus:2,
                          // addRow:{maxColumn:0}
                       },{  input:'NRO_CUOTA',
                          url_valida:mainUrl.url_valida_nroCutota,
                          params:[],
                          nexFocus:3,
                          ejecuteFuncion:true
                       },{  input:'COD_MONEDA',
                          url_valida:mainUrl.url_valida_nroCutota,
                          params:[],
                          nexFocus:5,
                          ejecuteFuncion:true
                        },{ input:'TOT_COMPROBANTE',
                          url_valida:mainUrl.url_valida_totComp,
                          params:[],
                          nexFocus:5,
                          ejecuteFuncion:true
                        }
                      ],
         [idCompDet] :[{input:'SUB_TIPO_TRANS',
                        url_valida:mainUrl.url_valida_sub_tipo_trans,
                        params:['COD_MODULO','TIPO_TRANS'],
                        nexFocus:2,
                        // CONFI. F9
                        title:'Sub Tipo Trans',
                        url_buscar:mainUrl.url_buscar_subtipTrans,
                        columnModal:mainColumn.columns_sub_tipo_trans,
                        ejecuteFuncion:true
                      },{
                        input:'SER_DOCUMENTO',
                        url_valida:mainUrl.url_valida_ser_documento,
                        params:['TIP_DOCUMENTO'],
                        nexFocus:3,
                      },{
                        input:'NRO_DOCUMENTO',
                        url_valida:mainUrl.url_valida_nro_documento,
                        params:['COD_CLIENTE','SER_DOCUMENTO','TIP_DOCUMENTO','TIP_COMPROBANTE','CARGA_VALORES'],
                        nexFocus:4,
                          // CONFI. F9
                        title:'Comprobante',
                        url_buscar:mainUrl.url_buscar_nrodocument,
                        columnModal:mainColumn.columns_nro_documento
                      },{
                        input:'COD_BANCO_CLIENTE',
                        url_valida:mainUrl.url_valida_cod_banco_cliente,
                        params:['CARGA_BANCO_CLI','SECTOR_BANCARIO','CARGA_VALORES'],
                        nexFocus:5,
                          // CONFI. F9
                        title:'Banco',
                        url_buscar:mainUrl.url_buscar_bancoClient,
                        columnModal:mainColumn.columns_cod_banco_cliente
                      },{
                        input:'NRO_CUENTA',
                        url_valida:mainUrl.url_valida_nro_cuenta,
                        params:[],
                        nexFocus:6,
                      },{
                        input:'FEC_VENCIMIENTO',
                        url_valida:mainUrl.url_valida_fec_vencimiento,
                        params:['CARGA_VENCIMIENTO'],
                        nexFocus:7,
                      },{
                        input:'COD_MONEDA_COBRO',
                        url_valida:mainUrl.url_valida_cod_moneda_cobro,
                        params:[],
                        nexFocus:8,
                        // CONFI. F9
                        title:'Moneda',
                        url_buscar:mainUrl.url_buscar_monedaCob,
                        columnModal:mainColumn.columns_cod_moneda_cobro
                      },{
                        input:'TIP_CAMBIO',
                        url_valida:mainUrl.url_valida_tip_cambio,
                        params:[],
                        nexFocus:11,
                        ejecuteFuncion:true
                      },{
                        input:'MONTO',
                        url_valida:mainUrl.url_valida_monto,
                        params:[],
                        nexFocus:12,
                        ejecuteFuncion:true,
                        addRow:{maxColumn:11},
                      }
                    ]
                    }

const IdGrid  =     {[idCompRef]: {  cabecera_can:[]
                                   , cabecera_del:[]
                                    // , isNotNull:['COD_REG_ALM']
                                    // , keyCodeFrontend:[ {COD_SUCURSAL :'COD_SUCURSAL_ANT' }
                                    //                   , {COD_DEPOSITO :'COD_DEPOSITO_ANT' }
                                    //                   ]
                                    // , keyCode: {   COD_SUCURSAL :'COD_SUCURSAL_ANT'
                                    //              , COD_DEPOSITO :'COD_DEPOSITO_ANT'}
                                   , viewColumn:mainColumn.columns_ref
                                   , rowsIndex:0
                                   , columnIndex:0
                                   , rowsValue:{}
                                   , inicialData:JSON.parse(JSON.stringify(mainInicial.inicialRef)) 
                                   , indexColumnF7:[1]
                                   , validaInput:['NRO_COMPROBANTE','NRO_CUOTA','COD_MONEDA','TOT_COMPROBANTE']
                                  },
                      [idCompDet]:{ cabecera_can:[]
                                  , cabecera_del:[]
                                  , viewColumn:mainColumn.columns_det
                                  , rowsIndex:0
                                  , columnIndex:0
                                  , rowsValue:{}
                                  , inicialData:JSON.parse(JSON.stringify(mainInicial.inicialDet)) 
                                  , indexColumnF7:[1]
                                  , validaInput:[ 'SUB_TIPO_TRANS'
                                                , 'SER_DOCUMENTO'
                                                , 'NRO_DOCUMENTO'
                                                , 'COD_BANCO_CLIENTE'
                                                , 'NRO_CUENTA'
                                                , 'FEC_VENCIMIENTO'
                                                , 'COD_MONEDA_COBRO'
                                                , 'TIP_CAMBIO'
                                                , 'MONTO']
                                  }
                     }

const main = {
  validaInput
, restablecerValida
, validaInputGrid
, ModalF9
, IdGrid
}

export default main