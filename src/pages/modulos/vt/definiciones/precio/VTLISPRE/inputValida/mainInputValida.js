import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'COD_MONEDA',
    url: mainUrl.url_valida_moneda,  
    out:[ 'DESC_MONEDA','DECIMALES','TIP_CAMBIO'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'ESTADO', 
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
  "COD_MONEDA" : {title: 'Moneda' , column: mainColumn.columns_moneda , url: mainUrl.url_buscar_moneda  },
}

const main = {
  validaInput
, restablecerValida
, ModalF9
}

export default main