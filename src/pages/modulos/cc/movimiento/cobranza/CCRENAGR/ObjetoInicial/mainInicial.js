const objetoInicialCab = {
  COD_EMPRESA   : sessionStorage.getItem('cod_empresa'),
  COD_SUCURSAL  : sessionStorage.getItem('cod_sucursal'),
  COD_USUARIO   : sessionStorage.getItem('cod_usuario'),
  DESC_SUCURSAL : '',
  DESC_CLIENTE  : '',
  // COD_SUBCLIENTE: 1,
  TIP_PLANILLA  : 'IND',
  IND_INPASA    : 'N'
}

const objetoInicialDet = {
    TIP_COMPROBANT      : ''
  , SER_COMPROBANT      : ''
  , NRO_COMPROBANT      : ''
  , NRO_FACTURA_INPAS   : ''
  , COD_CLIENT          : ''
  , COD_SUBCLIENT       : ''
  , COD_CLIENTE_RE      : ''
  , COD_ZONA            : ''
  , DESC_ZON            : ''
  , DESC_CLIENT         : ''
  , DESC_SUBCLIENT      : ''
  , FEC_VENCIMIENT      : ''
  , NRO_CUOT            : ''
  , FEC_COMPROBANTE     : ''
  , NRO_CUENTA_CLIENTE  : ''
  , COD_BANCO_CLIENTE   : ''
  , NRO_CUENTA          : ''
  , COD_MONEDA          : ''
  , SIGLA               : ''
  , MONTO_A_COBRAR      : ''
  , COD_CLIENTE_REF     : ''
  , COD_SUBCLIENTE      : ''
  , COD_CLIENTE         : ''
  , TOTA                : ''
}


const main = {
  objetoInicialCab,
  objetoInicialDet
}

export default main