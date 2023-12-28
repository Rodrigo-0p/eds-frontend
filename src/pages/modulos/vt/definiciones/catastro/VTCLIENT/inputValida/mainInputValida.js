import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'COD_PERSONA',
    url: mainUrl.url_valida_persona,    
    out:['NOMBRE','NOMB_FANTASIA','PAIS','PROVINCIA','CIUDAD','DIRECCION_CAB','NRO_DOCUMENTO','NRO_DIG_VER','TELEFONO'],
    data:['COD_EMPRESA','COD_PERSONA_ANT'],
    rel:[],
    next: 'COD_CONDICION_VENTA', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,    
  },{
    input: 'COD_CONDICION_VENTA',
    url: mainUrl.url_valida_condVent,    
    out:['DESC_CONDICION_VENTA'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_CAUSAL', 
    // ---
    requerido : false,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,    
  },{
    input: 'COD_CAUSAL',
    url: mainUrl.url_valida_causal,    
    out:['DESC_CAUSAL'],
    data:['COD_EMPRESA','BLOQUEAR_CLIENTE'],
    rel:[],
    next: 'COD_GRUPO_CLIENTE', 
    // ---
    requerido : false,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,    
  },{
    input: 'COD_GRUPO_CLIENTE',
    url: mainUrl.url_valida_grupCli,    
    out:['DESC_GRUPO_CLIENTE'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'LIMITE_CREDITO', 
    // ---
    requerido : false,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,    
  },{
    input: 'COD_MONEDA_LIMITE',
    url: mainUrl.url_valida_monedas,    
    out:['DESC_MONEDA_LIMITE'],
    data:['COD_EMPRESA','LIMITE_CREDITO'],
    rel:[],
    next: 'COD_PERSONA', 
    // ---
    requerido : false,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,    
  },
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_PERSONA"         : {title: 'Persona'        , column: mainColumn.columns_persona       , url: mainUrl.url_buscar_persona  },
  "COD_CONDICION_VENTA" : {title: 'Condición Venta', column: mainColumn.columns_condVent      , url: mainUrl.url_buscar_condVent },
  "COD_CAUSAL"          : {title: 'Causal '        , column: mainColumn.columns_causal        , url: mainUrl.url_buscar_causal   },
  "COD_GRUPO_CLIENTE"   : {title: 'Grupo Cliente'  , column: mainColumn.columns_grupo_cliente , url: mainUrl.url_buscar_grupCli  },
  "COD_MONEDA_LIMITE"   : {title: 'Monedas'        , column: mainColumn.columns_monedas_limite, url: mainUrl.url_buscar_monedas  }
}

const main = {
    validaInput
  , restablecerValida
  , ModalF9
}

export default main