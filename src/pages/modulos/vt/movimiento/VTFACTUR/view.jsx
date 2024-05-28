import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import mainUrl         from './url/mainUrl';
import dayjs           from "dayjs";
import updateLocale    from "dayjs/plugin/updateLocale";
import locale          from "antd/es/locale/es_ES";
import "dayjs/locale/es";
import {ConfigProvider,DatePicker} from 'antd'
dayjs.extend(updateLocale);
dayjs.updateLocale("es", {
  weekStart: 0
});

const columnModal = {
  urlValidar : [{ COD_ARTICULO      : mainUrl.url_valida_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_valida_unidad_medida,
                  CANTIDAD          : mainUrl.url_valida_cantidad,
                  // COD_CAUSA         : mainUrl.url_valida_causa,
                }],
  urlBuscador: [{ COD_ARTICULO      : mainUrl.url_buscar_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_buscar_unidad_medida,
                  // COD_CAUSA         : mainUrl.url_buscar_causa,
                }],
  title      : [{ COD_ARTICULO      : "Articulo",
                  // COD_UNIDAD_MEDIDA : "Unidad Medida",
                  // COD_CAUSA         : "Causa",
                }],
  COD_ARTICULO: [
    { data: 'COD_ARTICULO'      , title: 'Código'       ,className:'htLeft' },
    { data: 'DESC_ARTICULO'     , title: 'Descripción'  ,className:'htLeft' },
  ],
  COD_UNIDAD_MEDIDA: [
    { data: 'COD_UNIDAD_MEDIDA' , title: 'Código'       ,className:'htLeft' },
    { data: 'DESC_UNIDAD_MEDIDA', title: 'Descripción'  ,className:'htLeft' },
  ],
  // COD_CAUSA: [
  //   { data: 'COD_CAUSA'         , title: 'Código'       ,className:'htLeft' },
  //   { data: 'DESC_CAUSA'        , title: 'Descripción'  ,className:'htLeft' },
  // ],
  config:{
    COD_ARTICULO:{
      depende_de:[],
      dependencia_de:[],
      depende_ex_cab:[
        {id:'COD_SUCURSAL'        ,label: 'Sucursal'},
        {id:'COD_CLIENTE'         ,label: 'Cliente'},
        {id:'COD_SUBCLIENTE'      ,label: 'Sub Cliente'},
        {id:'TIP_CLIENTE'         ,label: 'Tip. Cliente'},
        {id:'IND_REG_TURISMO'     ,label: 'Reg. Turismo'},
        {id:'COD_CONDICION_VENTA' ,label: 'Condicion de Venta'},
        {id:'COD_LISTA_PRECIO'    ,label: 'Lista de precios'},
        {id:'DECIMALES'           ,label: 'Decimales'}, 
        {id:'PORC_IVA'            ,label: 'Porcetaje IVA'},
        {id:'PORC_GRAVADA'        ,label: 'Porcentaje Gravada'},
      ],
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[
        {id:'COD_ARTICULO' ,label: 'Articulo'},
        {id:'PORC_IVA'     ,label: 'Porcetaje IVA'},
        {id:'PORC_GRAVADA' ,label: 'Porcentaje Gravada'},
      ],
      dependencia_de:[],
      depende_ex_cab:[
        {id:'COD_CONDICION_VENTA' ,label: 'Condicion de Venta'}, 
        {id:'COD_LISTA_PRECIO'    ,label: 'Lista de precios'}, 
        {id:'DECIMALES'           ,label: 'Lista de precios'}, 
      ],
    },
    CANTIDAD:{
      depende_de:[
        {id:'COD_ARTICULO'      ,label: 'Articulo'},
        {id:'COD_UNIDAD_MEDIDA' ,label: 'Articulo'},
        {id:'MULT'              ,label: 'Multiplo'},
        {id:'DIV'               ,label: 'Divisor'},
        {id:'PORC_IVA'          ,label: 'Porcentaje Iva'},
        {id:'PORC_GRAVADA'      ,label: 'Porcentaje Gravada'},
      ],
      dependencia_de:[],
      depende_ex_cab:[
        {id:'COD_CONDICION_VENTA' ,label: 'Condicion de Venta'}, 
        {id:'COD_LISTA_PRECIO'    ,label: 'Lista de precios'}, 
        {id:'DECIMALES'           ,label: 'Lista de precios'},
      ],
    },
    // COD_DEPOSITO_ENT:{
    //   depende_de:[],
    //   dependencia_de:[],
    //   depende_ex_cab:[{id:'COD_SUCURSAL' ,label: 'Sucursal'   }],
    // },
    // COD_UNIDAD_MEDIDA:{
    //   depende_de:[{id:'COD_ARTICULO'     ,label: 'Articulo'   }],
    //   dependencia_de:[],
    //   depende_ex_cab:[],
    // },
    // CANTIDAD:{
    //   depende_de:[{id:'COD_ARTICULO'     ,label: 'Articulo'    },
    //               {id:'COD_DEPOSITO'     ,label: 'Deposito'    },                      
    //               {id:'NRO_LOTE'         ,label: 'Nro Lote'    },
    //               {id:'CANTIDAD_ANT'     ,label: 'Cantidad ant'},
    //               {id:'MULT'             ,label: 'Mult'        },
    //               {id:'DIV'              ,label: 'Div'         },
    //               {id:'DESC_ARTICULO'    ,label: 'Desc Art'    },
    //               {id:'DESC_UM'          ,label: 'Desc Um'     },
    //              ],      
    //   dependencia_de:[],
    //   depende_ex_cab:[{id:'COD_SUCURSAL',label: 'Sucursal'     },],
    // }
  },
}; 

export const columns = [
  { data: 'COD_ARTICULO'          , title: 'Articulo'        , width : 35  , className: 'htLeft'  , requerido:true    , readOnly:false }, 
  { data: 'DESC_ARTICULO'         , title: 'Descripción'     , width : 120 , readOnly:true        , filter:false      , textWrap:true  }, 
  { data: 'COD_IVA'               , title: 'I.V.A'           , width : 35  , className: 'htCenter', requerido:true    , readOnly:false },
  { data: 'COD_UNIDAD_MEDIDA'     , title: 'U.M'             , width : 35  , className: 'htCenter', requerido:true    , readOnly:true  },
  { data: 'CANTIDAD'              , title: 'Cantidad'        , width : 50  , className: 'htRight' , requerido:true    , readOnly:false  , type:'numeric', format:{pattern: '0,0.000',culture: 'de-DE'}},
  { data: 'PRECIO_UNITARIO_C_IVA' , title: 'Precio Unitario' , width : 50  , className: 'htRight' , requerido:true    , readOnly:false  , type:'numeric', format:{pattern: '0,0',culture: 'de-DE'}},
  { data: 'TOTAL_IVA'             , title: 'Total I.V.A'     , width : 50  , className: 'htRight' , requerido:true    , readOnly:true  , type:'numeric', format:{pattern: '0,0',culture: 'de-DE'}},
  { data: 'MONTO_TOTAL_C_IVA'     , title: 'Monto Total'     , width : 50  , className: 'htRight' , requerido:true    , readOnly:true   , type:'numeric', format:{pattern: '0,0',culture: 'de-DE'}},      
]

const columnNavigationEnter = [0,3,4,5];

const VTFACTUR = memo(({refGrid         ,form    ,FormName,  idComp, handleKeyDown, handleInputChange,      handleKeyUp ,
                       setfocusRowIndex,dataRef ,validaExterno    , setClickCell , activateButtonCancelar, refBloqueo  ,
                       setLastFocusNext}) => {


  const maxFocus = [{
    id:idComp,
    hasta:"PRECIO_UNITARIO_C_IVA",
    newAddRow:true,
    nextId:''
  }];
                      
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[4, 2]}>

        <Main.Col span={12} onClick={()=>setClickCell('CAB')}>
          <Main.Row id={`form-cab-${FormName}`} gutter={[2,2]}>

          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Sucursal</label>}>
              <Main.Form.Item name="COD_SUCURSAL" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="DESC_SUCURSAL" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={12}>
            <Main.Form.Item label={<label style={{width:'80px'}}>Número</label>}>                  
              <Main.Form.Item name="TIP_COMPROBANTE" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                <Main.Input className={`search_input ${FormName}_BLOQUEO`} onKeyUp={handleKeyUp}  onChange={handleInputChange} onKeyDown={handleKeyDown}/>
              </Main.Form.Item>
              <Main.Form.Item name="SER_COMPROBANTE" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                <Main.Input className={`search_input ${FormName}_BLOQUEO`}  onKeyUp={handleKeyUp}  onChange={handleInputChange}  onKeyDown={handleKeyDown}/>
              </Main.Form.Item>
              <Main.Form.Item name="NRO_COMPROBANTE" style={{width:'calc(100% - 108px)', display:'inline-block'}}>
                <Main.Input type="number" className={`search_input ${FormName}_BLOQUEO`}  onKeyUp={handleKeyUp}  onChange={handleInputChange} onKeyDown={handleKeyDown} />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col> 
          <Main.Col span={12}>            
            <Main.Form.Item className='form-items' name="FEC_COMPROBANTE" type="text" label={<label style={{ marginLeft: '43px' }}>Fecha</label>} >
              <DatePicker
                  style={{width:'100%',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  onChange={(e)=>{activateButtonCancelar(e,"FEC_COMPROBANTE")}}
                  format={['DD/MM/YYYY']}
                  key="FEC_COMPROBANTE"
                  placeholder=""
                  className={`${FormName}_FEC_COMPROBANTE`}
                  onClick={(()=>Main.openStart(`${FormName}_FEC_COMPROBANTE`))}
                />
            </Main.Form.Item>            
          </Main.Col>

          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Cliente</label>}>
              <Main.Form.Item name="COD_CLIENTE" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="NOM_CLIENTE" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Sub Cliente</label>}>
              <Main.Form.Item name="COD_SUBCLIENTE" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="NOM_SUBCLIENTE" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={12}>            
            <Main.Form.Item className='form-items' name="DIR_CLIENTE" type="text" label={<label style={{ width: '80px' }}>Dirección</label>} >
              <Main.Input 
                onKeyUp={handleKeyUp} 
                onKeyDown={handleKeyDown}
                className={`search_input ${FormName}_BLOQUEO`}
                name="DIR_CLIENTE" 
            />
            </Main.Form.Item>            
          </Main.Col>

          <Main.Col span={12}>            
            <Main.Form.Item className='form-items' name="TEL_CLIENTE" type="text" label={<label style={{ width: '80px' }}>Teléfono</label>} >
              <Main.Input 
                onKeyUp={handleKeyUp} 
                onKeyDown={handleKeyDown}
                className={`search_input ${FormName}_BLOQUEO`}
                name="TEL_CLIENTE" 
            />
            </Main.Form.Item>            
          </Main.Col>

          <Main.Col span={12}>            
            <Main.Form.Item className='form-items' name="RUC" type="text" label={<label style={{ width: '80px' }}>Nº Documento</label>} >
              <Main.Input 
                onKeyUp={handleKeyUp} 
                onKeyDown={handleKeyDown}
                className={`search_input ${FormName}_BLOQUEO`}
                name="RUC" 
            />
            </Main.Form.Item>            
          </Main.Col> 

          <Main.Col span={12}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Referencia</label>}>
              <Main.Form.Item name="TIP_COMPROBANTE_REF" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="NRO_COMPROBANTE_REF" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col> 
          
          <Main.Col span={12}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Vendedor</label>}>
              <Main.Form.Item name="COD_VENDEDOR" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="DESC_VENDEDOR" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={12}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Cond. Venta</label>}>
              <Main.Form.Item name="COD_CONDICION_VENTA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="DESC_CONDICION_VENTA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={12}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Lista Precio</label>}>
              <Main.Form.Item name="COD_LISTA_PRECIO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="DESC_LISTA_PRECIO" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={12}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Déposito</label>}>
              <Main.Form.Item name="COD_DEPOSITO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="DESC_DEPOSITO" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={12}>
            <Main.Form.Item label={<label style={{ width: '80px' }}><span style={{ color: 'red' }}>*</span>Moneda</label>}>
              <Main.Form.Item name="COD_MONEDA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
              </Main.Form.Item>
              <Main.Form.Item name="DESC_MONEDA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={12}>            
              <Main.Form.Item className='form-items' name="TIP_CAMBIO" type="text" label={<label style={{ width: '80px' }}>Tipo Cambio</label>} >
                <Main.Input 
                  onKeyUp={handleKeyUp} 
                  onKeyDown={handleKeyDown}
                  className={`search_input ${FormName}_BLOQUEO`}
                  name="TIP_CAMBIO" 
              />
              </Main.Form.Item>            
            </Main.Col> 


          </Main.Row>
        </Main.Col>

        <Main.Col span={12} onClick={()=>setClickCell('CAB')} >
          <Main.Card >
          <Main.Row>
            
              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '80px' }}>Límite Crédito</label>}>
                  <Main.Form.Item name="COD_LIMITE" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_LIMITE" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                      <Main.Input disabled/>
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>            
                <Main.Form.Item className='form-items' name="SALDO" type="text" label={<label style={{ width: '80px' }}>Saldo Gs</label>} >
                  <Main.Input 
                    onKeyUp={handleKeyUp} 
                    onKeyDown={handleKeyDown}
                    className={`search_input ${FormName}_BLOQUEO`}
                    name="SALDO" 
                />
                </Main.Form.Item>            
              </Main.Col> 
              <Main.Col span={12}>            
                <Main.Form.Item className='form-items' name="SALDO_RESTANTE" type="text" label={<label style={{ width: '80px' }}>Saldo Restante</label>} >
                  <Main.Input 
                    onKeyUp={handleKeyUp} 
                    onKeyDown={handleKeyDown}
                    className={`search_input ${FormName}_BLOQUEO`}
                    name="SALDO_RESTANTE" 
                  />
                </Main.Form.Item>            
              </Main.Col> 
            </Main.Row>          
          </Main.Card>
          
          <Main.Row>
            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '80px' }}>Motivo Anu.</label>}>
                <Main.Form.Item name="COD_MOTIVO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_MOTIVO" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col> 
          </Main.Row>
          <Main.Row>
            <Main.Col span={24}>            
              <Main.Form.Item className='form-items' name="COMENTARIO" type="text" label={<label style={{ width: '80px' }}>Comentario</label>} >
                <Main.Input 
                  onKeyUp={handleKeyUp} 
                  onKeyDown={handleKeyDown}
                  className={`search_input ${FormName}_BLOQUEO`}
                  name="COMENTARIO" 
              />
              </Main.Form.Item>            
            </Main.Col> 
          </Main.Row>

        </Main.Col>

        <Main.Col span={24} style={{marginTop:'12px'}}>          
          <Main.HandsontableGrid
            refData={refGrid}
            columns={columns}
            FormName={FormName}
            idComp={idComp}// id del componente
            height={110}
            setfocusRowIndex={setfocusRowIndex}
            columnNavigationEnter={columnNavigationEnter}
            setLastFocusNext={setLastFocusNext}
            maxFocus={maxFocus}
            colorButtom={false}
            dataCabecera={dataRef}
            columnModal={columnModal}
            // validaExterno={validaExterno}
            setClickCell={setClickCell}
            multipleHeader={true} 
            focusEditMode={false} // boolean. true/ el valda externo se ejecuta solo cuando se edita el campo
          />
        </Main.Col>
        
        <Main.Card style={{marginTop:'10px',marginBottom:'5px'}}>
          <Main.Col span={24}>
            <Main.Row>

              <Main.Col span={6}>
                <Main.Row>
                  <Main.Col span={24}>            
                    <Main.Form.Item name="ESTADO" label={<label style={{width:'83px'}}>Estado</label>}>
                      <Main.Select 
                        onChange={(e)=>{
                          let value = {target : {id:'ESTADO',value:e}}
                          handleInputChange(value)                        
                        }} className="ESTADO" allowClear placeholder="" >
                        <Main.Select.Option value="P">Pendiente</Main.Select.Option>
                        <Main.Select.Option value="C">Cobrada</Main.Select.Option>
                        <Main.Select.Option value="A">Anulada</Main.Select.Option>
                        <Main.Select.Option value="X">Venta Balcon</Main.Select.Option>
                      </Main.Select>
                    </Main.Form.Item>            
                  </Main.Col>
                  {/* <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="FEC_ESTADO" type="text" label={<label style={{ width: '80px' }}>Fec. Estado</label>} > 
                      <DatePicker
                        style={{width:'100%',height:'23px',textAlign:'right'}}
                        onKeyDown={(e)=>handleKeyDown(e)}
                        onChange={(e)=>{activateButtonCancelar(e,"FEC_ESTADO")}}
                        format={['DD/MM/YYYY']}
                        key="FEC_ESTADO"
                        placeholder=""
                        className={`${FormName}_FEC_ESTADO`}
                        onClick={(()=>Main.openStart(`${FormName}_FEC_ESTADO`))}
                      />
                    </Main.Form.Item>            
                  </Main.Col> */}
                  {/* <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="FEC_VENCIMIENTO" type="text" label={<label style={{ width: '80px' }}>Fec. Vencimiento</label>} >
                      <DatePicker
                        style={{width:'100%',height:'23px',textAlign:'right'}}
                        onKeyDown={(e)=>handleKeyDown(e)}
                        onChange={(e)=>{activateButtonCancelar(e,"FEC_VENCIMIENTO")}}
                        format={['DD/MM/YYYY']}
                        key="FEC_VENCIMIENTO"
                        placeholder=""
                        className={`${FormName}_FEC_VENCIMIENTO`}
                        onClick={(()=>Main.openStart(`${FormName}_FEC_VENCIMIENTO`))}
                      />
                    </Main.Form.Item>            
                  </Main.Col> */}
                  <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="COD_USUARIO" type="text" label={<label style={{ width: '80px' }}>Usuario</label>} >
                      <Main.Input 
                        onKeyUp={handleKeyUp} 
                        onKeyDown={handleKeyDown}
                        className={`search_input ${FormName}_BLOQUEO`}
                        name="COD_USUARIO" 
                    />
                    </Main.Form.Item>            
                  </Main.Col>
                </Main.Row>
              </Main.Col>
              <Main.Col span={6}>
                <Main.Row>
                  <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="TOT_EXENTAS" type="text" label={<label style={{ width: '80px' }}>Exentas</label>} >
                      <Main.NumberFormat 
                        className="type-numeri"
                        thousandSeparator="."
                        decimalScale={3}
                        decimalSeparator=","
                        disabled={true}
                        // onChange={(e)=>handleInputChangeNumber(e)}
                        // onKeyDown={handleKeyDown} 
                        style={{width:'calc(104% - 13px)'}}
                      />
                    </Main.Form.Item>            
                  </Main.Col>
                  <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="TOT_GRAVADAS" type="text" label={<label style={{ width: '80px' }}>Gravadas</label>} >
                      <Main.NumberFormat 
                        className="type-numeri"
                        thousandSeparator="."
                        decimalScale={3}
                        decimalSeparator=","
                        disabled={true}
                        // onChange={(e)=>handleInputChangeNumber(e)}
                        // onKeyDown={handleKeyDown} 
                        style={{width:'calc(104% - 13px)'}}
                      />
                    </Main.Form.Item>            
                  </Main.Col>
                </Main.Row>
              </Main.Col>
              <Main.Col span={6}>
                <Main.Row>
                  <Main.Col span={24}>
                    <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Desc. Financiero</label>}>
                      <Main.Form.Item name="PORC_DESC_FIN" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                          <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                      </Main.Form.Item>
                      <Main.Form.Item name="MONTO_DESC_FIN" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                          <Main.Input disabled/>
                      </Main.Form.Item>
                    </Main.Form.Item>
                  </Main.Col>
                  <Main.Col span={24}>
                    <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Desc. Varios</label>}>
                      <Main.Form.Item name="PORC_DESC_VAR" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                          <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                      </Main.Form.Item>
                      <Main.Form.Item name="MONTO_DESC_VAR" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                          <Main.Input disabled/>
                      </Main.Form.Item>
                    </Main.Form.Item>
                  </Main.Col>
                </Main.Row>
              </Main.Col>
              <Main.Col span={6}>
                <Main.Row>
                  <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="SUBTOTAL" type="text" label={<label style={{ width: '80px' }}>Sub Total</label>} >
                      <Main.NumberFormat 
                        className="type-numeri"
                        thousandSeparator="."
                        decimalScale={3}
                        decimalSeparator=","
                        disabled={true}
                        // onChange={(e)=>handleInputChangeNumber(e)}
                        // onKeyDown={handleKeyDown} 
                        style={{width:'calc(104% - 13px)'}}
                      />
                    </Main.Form.Item>            
                  </Main.Col>
                  <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="TOT_DESCUENTO" type="text" label={<label style={{ width: '80px' }}>Descuento</label>} >
                      <Main.NumberFormat 
                        className="type-numeri"
                        thousandSeparator="."
                        decimalScale={3}
                        decimalSeparator=","
                        disabled={true}
                        // onChange={(e)=>handleInputChangeNumber(e)}
                        // onKeyDown={handleKeyDown} 
                        style={{width:'calc(104% - 13px)'}}
                      />
                    </Main.Form.Item>            
                  </Main.Col>
                  <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="TOT_IVA" type="text" label={<label style={{ width: '80px' }}>I.V.A</label>} >
                      <Main.NumberFormat 
                        className="type-numeri"
                        thousandSeparator="."
                        decimalScale={3}
                        decimalSeparator=","
                        disabled={true}
                        // onChange={(e)=>handleInputChangeNumber(e)}
                        // onKeyDown={handleKeyDown} 
                        style={{width:'calc(104% - 13px)'}}
                      />
                    </Main.Form.Item>            
                  </Main.Col>
                  <Main.Col span={24}>            
                    <Main.Form.Item className='form-items' name="TOT_COMPROBANTE" type="text" label={<label style={{ width: '80px' }}>Total</label>} >
                      <Main.NumberFormat 
                        className="type-numeri"
                        thousandSeparator="."
                        decimalScale={3}
                        decimalSeparator=","
                        disabled={true}
                        // onChange={(e)=>handleInputChangeNumber(e)}
                        // onKeyDown={handleKeyDown} 
                        style={{width:'calc(104% - 13px)'}}
                      />
                    </Main.Form.Item>            
                  </Main.Col>
                </Main.Row>
              </Main.Col> 
            </Main.Row>
          </Main.Col>
        </Main.Card>

        <Main.Col span={24} style={{ position: '',margenTop:'42px' , bottom:'5px', width: '80%', fontSize:'12px' }}>
          <div className='total_registro_pg'>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>

      </Main.Row>
    </Main.Form>      
  );
});

export default VTFACTUR;