import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import locale          from "antd/es/locale/es_ES";
import updateLocale    from "dayjs/plugin/updateLocale";
import dayjs           from "dayjs";
import mainUrl         from './url/mainUrl';
import "dayjs/locale/es";
import {ConfigProvider,DatePicker} from 'antd'
dayjs.extend(updateLocale);
dayjs.updateLocale("es", { weekStart: 0});

const columnModal = {
  urlValidar : [{ 
                  COD_ARTICULO      : mainUrl.url_valida_articulo     ,
                  COD_PROVEEDOR_REC : mainUrl.url_valida_cod_prov_rec ,
                  COD_UNIDAD_MEDIDA : mainUrl.url_valida_unidadMedida ,
                }],
  urlBuscador: [{
                  COD_ARTICULO      : mainUrl.url_buscar_articulo     ,
                  COD_PROVEEDOR_REC : mainUrl.url_buscar_cod_prov_rec ,
                  COD_UNIDAD_MEDIDA : mainUrl.url_buscar_unidadMedida ,
                }],
  title      : [{
                  COD_ARTICULO      : "Articulo",
                  COD_PROVEEDOR_REC : "Recup.",
                  COD_UNIDAD_MEDIDA : "Unidad Medida"
                }],
  COD_ARTICULO: [
    { data: 'COD_ARTICULO'      , title: 'Código'       , className:'htLeft' },
    { data: 'DESC_ARTICULO'     , title: 'Descripción'  , className:'htLeft' },
    { data: 'COD_UNIDAD_MEDIDA' , title: 'UM'           , className:'htLeft' },
    { data: 'DESC_UNIDAD_MEDIDA', title: 'Descripción'  , className:'htLeft' },
  ],
  COD_UNIDAD_MEDIDA: [
    { data: 'COD_UNIDAD_MEDIDA' , title: 'Código'       , className:'htLeft' },
    { data: 'DESC_UNIDAD_MEDIDA', title: 'Descripción'  , className:'htLeft' },
  ],
  COD_PROVEEDOR_REC:[
    { data: 'COD_PROVEEDOR_REC' , title:'Código'        , className:'htLeft'},
    { data: 'DESC_PROVEEDOR_REC', title:'Descripción'   , className:'htLeft'},
  ],
  config:{
    COD_ARTICULO:{
      depende_de:[
        // {id:'NRO_PEDIDO'            , label:'Nro pedido'                   },
      ],
      dependencia_de:[
        {id:'COD_UNIDAD_MEDIDA'     , label:'Unidad Medida'  , remove:false},
        {id:'COD_IVA'               , label:'IVA'            , remove:false},
        {id:'CANTIDAD'              , label:'Cantidad'       , remove:false},
        {id:'PRECIO_UNITARIO_C_IVA' , label:'Precio Únitario', remove:false},
      ],
      depende_ex_cab:[
        {id:'COD_SUCURSAL'    , label:'Suc. Destino'},        
        {id:'COD_MONEDA'      , label:'Moneda'      },
        {id:'DECIMALES'       , label:'Decimales'   },
        {id:'COD_PROVEEDOR'   , label:'Proveedor'   },
        {id:'IND_ODC'         , label:'Proveedor'   }
      ],
    },
    COD_PROVEEDOR_REC:{
      depende_de:[
        {id:'COD_ARTICULO' ,label: 'Articulo'},
        {id:'MISMOPROV'    ,label: 'Articulo - MISMOPROV'},
      ],
      depende_ex_cab:[
        {id:'REC_PROVEEDOR', label:'Recup. a Provee'},
      ],
      dependencia_de:[]   
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[{id:'COD_ARTICULO'     ,label: 'Articulo'   }],
      dependencia_de:[{id:"CANTIDAD"     ,label: 'Cantidad'   }],
      depende_ex_cab:[{id:'COD_SUCURSAL' ,label: 'Sucursal'   },                      
                      {id:'COD_MONEDA'   ,label: 'Moneda'     },
                      {id:'DECIMALES'    ,label: 'Decimales'  }],
    }
  },
};
export const columns = [
  { data: 'COD_ARTICULO'         , title: 'Articulo'     , width : 35  , className: 'htLeft'   , requerido:true      , readOnly:false  , nextValida:true }, 
  { data: 'DESC_ARTICULO'        , title: 'Descripcion'  , width : 130 , readOnly:true         , filter:false        , textWrap:true  }, 
  { data: 'COD_PROVEEDOR_REC'    , title: 'Recup.'       , width : 25  , className: 'htLeft'   , requerido:false     , readOnly:false }, 
  { data: 'COD_UNIDAD_MEDIDA'    , title: 'U.M'          , width : 25  , className: 'htLeft'   , requerido:true      , readOnly:false  , editFocus:true , nextValida:true }, 
  { data: 'DESC_UNIDAD_MEDIDA'   , title: 'Descripcion'  , width : 120 , readOnly:true         , filter:false   }    , 
  { data: 'COD_IVA'              , title: 'IVA'          , width : 25  , type:'numeric'        , className: 'htRight', readOnly:true        , format:{pattern: '0,0'}},
  { data: 'CANTIDAD'             , title: 'Cantidad'     , width : 55  , type:'numeric'        , requerido:true      , className: 'htRight' , readOnly:false  , format:{pattern: '0,0'}, validaAllExterno:true , isNegative:false, editFocus:true },   
  { data: 'PRECIO_UNITARIO_C_IVA', title: 'Precio Compra', width : 55  , type:'numeric'        , requerido:true      , className: 'htRight' , readOnly:false  , format:{pattern: '0,0'}, validaAllExterno:true}, 
  { data: 'PRECIO_ULTIMO_COSTO'  , title: 'Últ. Costo'   , width : 55  , type:'numeric'        , className: 'htRight', readOnly:true        , format:{pattern: '0,0'}},   
  { data: 'DESCUENTO'            , title: 'Descuento'    , width : 55  , type:'numeric'        , requerido:false     , className: 'htRight' , readOnly:false  , format:{pattern: '0,0'}, validaAllExterno:true , isNegative:false},   
  { data: 'MONTO_TOTAL_C_IVA'    , title: 'Total'        , width : 60  , type:'numeric'        , className:'htRight' , readOnly:true        , format:{pattern: '0,0'}},     
  { data: 'IND_BLOQ'             , title: 'BI'           , width : 15  , className: 'htCenter' , type:'checkbox'     , checkbox:['S','N']   , readOnly:true  }, 
  { data: 'IND_BON'              , title: 'Bon'          , width : 18  , className: 'htCenter' , type:'checkbox'     , checkbox:['S','N']   , readOnly:false  , validaAllExterno:true}, 
]

const columnNavigationEnter = [0,2,3,6,7,9];

const CMFACTUR = memo(({ refGrid         , form          , FormName, idComp,  dataRef,
                         handleKeyDown   , handleKeyUp   , refIndex, handleInputChange,
                         setfocusRowIndex, setClickCell  , validaAllExterno, nextValidaInput,
                         handleInputChangeNumber,setLastFocusNext, activateButtonCancelar}) => {
  
  const maxFocus = [{
    id:idComp         ,
    hasta:"DESCUENTO" ,
    newAddRow:true    ,
    nextId:''
  }];
                                     
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[4, 2]}>
        
        <Main.Col span={10} onClick={()=>setClickCell('CAB')}>
          <Main.Row id={`form-cab-${FormName}`} gutter={[2,2]}>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Sucursal</label>}>
                <Main.Form.Item name="COD_SUCURSAL" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} onKeyDown={handleKeyDown} onChange={handleInputChange}  onKeyUp={handleKeyUp}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_SUCURSAL" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>            
              <Main.Form.Item label={<label style={{width:'84px'}}>Nro. Orden</label>}>
                 <Main.Form.Item name="SER_COMPROBANTE" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                   <Main.Input onKeyDown={handleKeyDown} style={{ width:'100%'}} className="search_input" readOnly={true} onKeyUp={handleKeyUp} />
                </Main.Form.Item>
                <Main.Form.Item name="NRO_COMPROBANTE" style={{width:'calc(100% - 55px)', display:'inline-block'}}>
                  <Main.Input type="number" className={`search_input ${FormName}_BLOQUEO_NRO_COMP`}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}	
                    onKeyUp={handleKeyUp}
                  />
                </Main.Form.Item> 
              </Main.Form.Item>  
            </Main.Col>

            <Main.Col span={12}>
              <ConfigProvider locale={locale} >
                <Main.Form.Item name="FEC_COMPROBANTE" label={<label style={{width:'84px'}}><span style={{ color: 'red' }}>*</span>Fec Factura</label>}>
                 <DatePicker
                  style={{width:'100%',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  onChange={(e)=>{activateButtonCancelar(e,"FEC_COMPROBANTE")}}
                  format={['DD/MM/YYYY']}
                  key="FEC_COMPROBANTE"
                  placeholder=""
                  className={`${FormName}_FEC_COMPROBANTE`}
                  onClick={(()=>Main.openStart(`${FormName}_FEC_COMPROBANTE`,0))}
                />
                </Main.Form.Item>
              </ConfigProvider>
            </Main.Col>

            <Main.Col span={12}>
              <ConfigProvider locale={locale} >
                <Main.Form.Item name="FEC_EMBARQUE" label={<label style={{width:'68px'}}><span style={{ color: 'red' }}>*</span>Fecha (ETD)</label>}>
                 <DatePicker
                  style={{width:'100%',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  onChange={(e)=>{activateButtonCancelar(e,"FEC_EMBARQUE")}}
                  format={['DD/MM/YYYY']}
                  key="FEC_EMBARQUE"
                  placeholder=""
                  className={`${FormName}_FEC_EMBARQUE`}
                  onClick={(()=>Main.openStart(`${FormName}_FEC_EMBARQUE`,1))}
                />
                </Main.Form.Item>
              </ConfigProvider>
            </Main.Col>

            <Main.Col span={12}>
              <ConfigProvider locale={locale} >
                <Main.Form.Item name="FEC_RECEPCION" label={<label style={{width:'85px'}}><span style={{ color: 'red' }}>*</span>Fec Recep.</label>}>
                 <DatePicker
                  style={{width:'100%',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  onChange={(e)=>{activateButtonCancelar(e,"FEC_RECEPCION")}}
                  format={['DD/MM/YYYY']}
                  key="FEC_RECEPCION"
                  placeholder=""
                  className={`${FormName}_FEC_RECEPCION`}
                  onClick={(()=>Main.openStart(`${FormName}_FEC_RECEPCION`,2))}
                />
                </Main.Form.Item>
              </ConfigProvider>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Card className={`${FormName}_card_body`}>
                <Main.Row>
                  <Main.Col span={24}>
                    <Main.Form.Item label={<label style={{width:'78px'}}>Estado</label>}>
                      <Main.Form.Item name="ESTADO">
                        <Main.Radio.Group disabled>
                          <Main.Radio value="P" id="PENDIENTE">Pendiente</Main.Radio>
                          <Main.Radio value="C" id="CONFIRMADO">Confirmado</Main.Radio>
                          <Main.Radio value="A" id="ANULADO">Anulado</Main.Radio>
                        </Main.Radio.Group>
                      </Main.Form.Item>
                    </Main.Form.Item>
                  </Main.Col>

                  <Main.Col span={24}>
                    <Main.Form.Item label={<label style={{width:'78px'}}>Tip Factura</label>}>
                      <Main.Form.Item name="IND_TIPO_FACTURA" 
                      onChange={(e)=>{
                        let valor = {target:{}}
                        valor.target.id    = "IND_TIPO_FACTURA"
                        valor.target.value = e.target.value                       
                        handleInputChange(valor);
                      }}>
                        <Main.Radio.Group className={`${FormName}_IND_TIPO_FACTURA`} >
                          <Main.Radio style={{paddingRight:'12px'}} value="N" >Normal</Main.Radio>
                          <Main.Radio style={{paddingRight:'26px'}} value="V" >Virtual</Main.Radio>
                          <Main.Radio value="E" >Electronica</Main.Radio>
                        </Main.Radio.Group>
                      </Main.Form.Item>
                    </Main.Form.Item>
                  </Main.Col>
                </Main.Row>
              </Main.Card>
            </Main.Col>

          </Main.Row>
        </Main.Col>


        <Main.Col span={14} onClick={()=>setClickCell('CAB')} >
          <Main.Row>
            
            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '60px' }}><span style={{ color: 'red' }}>*</span>Proveedor</label>}>
                <Main.Form.Item name="COD_PROVEEDOR" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_PROVEEDOR" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '60px' }}>Anticipo</label>}>
                <Main.Form.Item name="COD_PROVEEDOR_ANT" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_PROVEEDOR_ANT" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '60px' }}><span style={{color:'red'}}>*</span>Condición</label>}>
                <Main.Form.Item name="COD_CONDICION_COMPRA" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_CONDICION" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={8}>
              <Main.Form.Item label={<label style={{ width: '60px' }}><span style={{color:'red'}}>*</span>Moneda</label>}>
                <Main.Form.Item name="COD_MONEDA" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_MONEDA" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={7}>
              <Main.Form.Item label={<label style={{width:'44px'}}>Cambio</label>} name="TIP_CAMBIO">
                <Main.NumberFormat 
                  name="TIP_CAMBIO"
                  className="type-numeri"
                  thousandSeparator="."
                  decimalScale={3}
                  decimalSeparator=","
                  disabled={true}
                  style={{width:'calc(110% - 19px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={9}>
              <Main.Form.Item label={<label style={{width:'86px'}}>Cambio Dólar</label>} name="TIP_CAMBIO_US">
                <Main.NumberFormat 
                  name="TIP_CAMBIO_US"
                  className="type-numeri"
                  thousandSeparator="."
                  decimalScale={3}
                  decimalSeparator=","
                  disabled={true}        
                  style={{width:'calc(104% - 13px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={15}>
              <Main.Form.Item label={<label style={{ width: '60px' }}><span style={{ color: 'red' }}>*</span>Depósito</label>}>
                <Main.Form.Item name="COD_DEPOSITO" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_DEPOSITO" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={9}>
              <Main.Form.Item label={<label style={{width:'86px'}}>Cambio R$S</label>} name="TIP_CAMBIO_RS">
                <Main.NumberFormat 
                  name="TIP_CAMBIO_RS"
                  className="type-numeri"
                  thousandSeparator="."
                  decimalScale={3}
                  decimalSeparator=","
                  disabled={true}        
                  style={{width:'calc(104% - 13px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={7}>
              <Main.Form.Item name="NRO_TIMBRADO" label={<label style={{width:'60px'}}><span style={{color:'red',padding:'3px'}}>*</span>Timbrado</label>}>
                <Main.Input style={{width:'calc(100% - 0px)', display:'inline-block',textAlign:'right'}} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}
                  className={`requerido ${FormName}_BLOQUEO`}/>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={8}>
              <Main.Form.Item name="REFERENCIA" label={<label style={{width:'74px'}}><span style={{color:'red',padding:'3px'}}>*</span>Nro. Factura</label>}>
                <Main.Input 
                  className={`requerido ${FormName}_BLOQUEO`}
                  style={{width:'calc(100% - 0px)', display:'inline-block',textAlign:'right'}}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  onKeyUp={handleKeyUp}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={9} >
              <Main.Form.Item name="TOT_DESCUENTO" label={<label style={{width:'86px'}}>Total Desc.</label>}>
                <Main.NumberFormat
                  className={`${FormName}_BLOQUEO_AUX type-numeri ant-input ant-input-sm`}
                  thousandSeparator="."
                  decimalSeparator=","
                  onChange={(e)=>handleInputChangeNumber(e)}
                  onKeyDown={handleKeyDown} 
                  style={{textAlign:'right',width:'calc(100% - 6px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={12} >
              <Main.Form.Item name="TOT_RECARGO" label={<label style={{width:'60px'}}>Total Rec.</label>}>
                <Main.NumberFormat
                  className={`${FormName}_BLOQUEO_AUX type-numeri ant-input ant-input-sm`}
                  thousandSeparator="."
                  decimalSeparator=","
                  onKeyDown={handleKeyDown} 
                  onChange={(e)=>handleInputChangeNumber(e)}
                  style={{textAlign:'right',width:'calc(100% - 6px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={12} >
              <Main.Form.Item name="TOT_FLETE" label={<label style={{width:'60px'}}>Total Flet.</label>}>
                <Main.NumberFormat
                  className={`${FormName}_BLOQUEO_AUX type-numeri ant-input ant-input-sm`}
                  thousandSeparator="."
                  decimalSeparator=","
                  onChange={(e)=>handleInputChangeNumber(e)}
                  onKeyDown={handleKeyDown} 
                  style={{textAlign:'right',width:'calc(100% - 6px)'}}
                />
              </Main.Form.Item>
            </Main.Col>
            
          </Main.Row>
        </Main.Col>

        <Main.Col id={`form-det-${FormName}`} style={{marginTop:'12px'}} span={24}>
          <Main.HandsontableGrid
            refData={refGrid}
            columns={columns}
            FormName={FormName}
            idComp={idComp}// id del componente
            height={255}
            maxFocus={maxFocus}
            setLastFocusNext={setLastFocusNext}
            setfocusRowIndex={setfocusRowIndex}
            columnNavigationEnter={columnNavigationEnter}
            colorButtom={false}
            dataCabecera={React.useCallback(()=>{
                return dataRef.current.data[refIndex.current.indice]
              // eslint-disable-next-line
            },[dataRef.current.data])}
            executeCab={true}
            columnModal={columnModal}
            nextValidaInput={nextValidaInput}
            validaAllExterno={validaAllExterno}
            setClickCell={setClickCell}
            // focusEditMode={false} // boolean. true/ el valda externo se ejecuta solo cuando se edita el campo
          />          
        </Main.Col>

        <Main.Col span={6} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item name="DESC_PROVEEDOR_REC" label={<label style={{width:'65px'}}>Proveedor</label>}>
            <Main.Input name="DESC_PROVEEDOR_REC"  style={{width:'100%', display:'inline-block',marginTop:'5px'}} readOnly={true}/>
          </Main.Form.Item>
        </Main.Col>
        <Main.Col span={8}/>

        <Main.Col span={5} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'50px'}}>Recargo</label>} name="RECARGO">
            <Main.NumberFormat name="RECARGO" readOnly={true} className="type-numeri ant-input ant-input-sm" thousandSeparator="." decimalSeparator="," 
            style={{textAlign:'right',width:'calc(100% - 0px)'}}/>
          </Main.Form.Item>
        </Main.Col>

        <Main.Col span={5} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'50px'}}>Total</label>} name="TOT_COMPROBANTE">
            <Main.NumberFormat name="TOT_COMPROBANTE" onKeyDown={Main.onKeyDownBloqueo} readOnly={true} className="type-numeri ant-input ant-input-sm" thousandSeparator="." decimalSeparator="," 
            style={{textAlign:'right',width:'calc(100% - 0px)'}}/>
          </Main.Form.Item>
        </Main.Col>

        <Main.Col span={6} style={{marginTop:'5px'}} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'65px'}}>Creado Por</label>} name="COD_USUARIO">
            <Main.Input disabled name="COD_USUARIO" />
          </Main.Form.Item>
        </Main.Col>

        <Main.Col span={6} style={{marginTop:'5px'}} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'50px'}}>Fecha</label>} name="FEC_ALTA">
            <Main.Input disabled name="FEC_ALTA" />
          </Main.Form.Item>
        </Main.Col>

        <Main.Col span={6} style={{marginTop:'5px'}} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'80px'}}>Confir. Por</label>} name="COD_USU_ESTADO">
            <Main.Input disabled name="COD_USU_ESTADO" />
          </Main.Form.Item>
        </Main.Col>

        <Main.Col span={6} style={{marginTop:'5px'}} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'50px'}}>Fecha</label>} name="FEC_ESTADO">
              <Main.Input disabled name="FEC_ESTADO" />
          </Main.Form.Item>
        </Main.Col>
        
        <Main.Col span={24} style={{margenTop:'55px', bottom:'2px', width: '80%', fontSize:'12px' }}>
          <div className='total_registro_pg'>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>
      </Main.Row>
    </Main.Form>
  );
});

export default CMFACTUR;