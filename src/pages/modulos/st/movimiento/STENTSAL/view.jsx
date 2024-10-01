import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import mainUrl         from './url/mainUrl';
import updateLocale    from "dayjs/plugin/updateLocale";
import locale          from "antd/es/locale/es_ES";
import dayjs           from "dayjs";
import "dayjs/locale/es";
import {ConfigProvider,DatePicker} from 'antd'
dayjs.extend(updateLocale);
dayjs.updateLocale("es", {
  weekStart: 0
});

const columnModal = {
  urlValidar : [{ COD_ARTICULO      : mainUrl.url_valida_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_valida_um,
                  CANTIDAD          : mainUrl.url_valida_cantidad
                }],
  urlBuscador: [{ COD_ARTICULO      : mainUrl.url_buscar_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_buscar_um,
                }],
  title      : [{ COD_ARTICULO      : "Articulo",
                  COD_UNIDAD_MEDIDA : "Unidad Medida"
                }],
  COD_ARTICULO: [
    { data: 'COD_ARTICULO'      , title: 'Código'       ,className:'htLeft' },
    { data: 'DESC_ARTICULO'     , title: 'Descripción'  ,className:'htLeft' },
  ],
  COD_UNIDAD_MEDIDA: [
    { data: 'COD_UNIDAD_MEDIDA' , title: 'Código'       ,className:'htLeft' },
    { data: 'DESC_UM'           , title: 'Descripción'  ,className:'htLeft' },
  ],
  config:{
    COD_ARTICULO:{
      depende_de:[],
      dependencia_de:[],
      depende_ex_cab:[{id:'COD_SUCURSAL' ,label: 'Sucursal'   }],
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[{id:'COD_ARTICULO'     ,label: 'Articulo'   }],
      dependencia_de:[],
      depende_ex_cab:[{id:'COD_SUCURSAL' ,label: 'Sucursal'    },                      
                      {id:'COD_MONEDA'   ,label: 'Moneda'      },
                      {id:'TIP_CAMBIO'   ,label: 'Tip Cambio'  },
                      {id:'DECIMALES'    ,label: 'Decimales'   }],
    },
    CANTIDAD:{
      depende_de:[{id:'COD_ARTICULO'     ,label: 'Articulo'    },
                  {id:'NRO_LOTE'         ,label: 'Nro Lote'    },
                  {id:'CANTIDAD_ANT'     ,label: 'Cantidad ant'},
                  {id:'MULT'             ,label: 'Mult'        },
                  {id:'DIV'              ,label: 'Div'         },
                  {id:'DESC_ARTICULO'    ,label: 'Desc Art'    },
                  {id:'DESC_UM'          ,label: 'Desc Um'     },
                  {id:'COSTO_UNITARIO'   ,label: '',isnull:true},                  
                 ],      
      dependencia_de:[],
      depende_ex_cab:[{id:'COD_SUCURSAL',label: 'Sucursal'    },      
                      {id:'COD_DEPOSITO',label: 'Deposito'    },
                      {id:'IND_ENT_SAL' ,label: 'IND_ENT_SAL' },             
                      {id:'DECIMALES'   ,label: 'Decimales'   },
                    ],
    }
  },
};

export const columns = [
  { data: 'COD_ARTICULO'     , title: 'Articulo'    , width : 25  , className: 'htLeft' , requerido:true     , readOnly:false }, 
  { data: 'DESC_ARTICULO'    , title: 'Descripcion' , width : 130 , readOnly:true       , filter:false       , textWrap:true  }, 
  { data: 'COD_UNIDAD_MEDIDA', title: 'U.M'         , width : 25  , className: 'htLeft' , requerido:true     , readOnly:false  , editFocus:true}, 
  { data: 'DESC_UM'          , title: 'Descripcion' , width : 120 , readOnly:true       , filter:false   }   , 
  { data: 'CANTIDAD'         , title: 'Cantidad'    , width : 55  , type:'numeric'      , requerido:true     , className: 'htRight' , readOnly:false  , format:{pattern: '0,0'}},   
  { data: 'COSTO_UNITARIO'   , title: 'Costo'       , width : 55  , type:'numeric'      , requerido:true     , className: 'htRight' , readOnly:false  , validaExterno:true},   
  { data: 'MONTO_TOTAL'      , title: 'Total'       , width : 60  , type:'numeric'      , className:'htRight', readOnly:true   },     
]
// format:c
const columnNavigationEnter = [0,2,4,5];

const STENSAL = memo(({refGrid         ,form    ,FormName,  idComp, handleKeyDown, handleInputChange,      handleKeyUp ,
                       setfocusRowIndex,dataRef ,validaExterno    , setClickCell , activateButtonCancelar}) => {

  const maxFocus = [{
    id       : idComp         ,
    hasta    :"COSTO_UNITARIO",
    newAddRow:true            ,
    nextId   :'MONTO_TOTAL'
  }];
  
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px' }}>
      <Main.Row gutter={[4, 2]}>
        
        <Main.Col span={12} onClick={()=>setClickCell('CAB')}>
          <Main.Row id={`form-cab-${FormName}`} gutter={[2,2]}>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Sucursal</label>}>
                <Main.Form.Item name="COD_SUCURSAL" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_SUCURSAL" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={12}>            
                <Main.Form.Item className='form-items' name="NRO_ENT_SAL" type="text" label={<label style={{ marginLeft: '43px' }}>Número</label>} >
                  <Main.Input 
                    onKeyUp={handleKeyUp} 
                    onKeyDown={handleKeyDown}
                    className={`search_input ${FormName}_BLOQUEO`}
                    name="NRO_ENT_SAL" 
                />
                </Main.Form.Item>            
            </Main.Col>

            <Main.Col span={12}>
              <ConfigProvider locale={locale} >
                <Main.Form.Item name="FEC_ENT_SAL" label={<label style={{width:'65px'}}>Fecha</label>}>
                 <DatePicker
                  style={{width:'100%',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  onChange={(e)=>{activateButtonCancelar(e,"FEC_ENT_SAL")}}
                  format={['DD/MM/YYYY']}
                  key="FEC_ENT_SAL"
                  placeholder=""
                  className={`${FormName}_FEC_ENT_SAL`}
                  onClick={(()=>Main.openStart(`${FormName}_FEC_ENT_SAL`))}
                />
                </Main.Form.Item>
              </ConfigProvider>

            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Motivo</label>}>
                <Main.Form.Item name="COD_MOTIVO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className={`${FormName}_BLOQUEO requerido`}
                    />
                </Main.Form.Item>
                <Main.Form.Item name="DESC_MOTIVO" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Deposito</label>}>
                <Main.Form.Item name="COD_DEPOSITO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className={`${FormName}_BLOQUEO requerido`} />
                </Main.Form.Item>
                <Main.Form.Item name="DESC_DEPOSITO" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>


          </Main.Row>
        </Main.Col>
        
        <Main.Col span={12} onClick={()=>setClickCell('CAB')}>
          <Main.Row id={`form-cab-${FormName}`} gutter={[2,2]}>

            <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '55px' }}><span style={{ color: 'red' }}>*</span>Proveedor</label>}>
                  <Main.Form.Item name="COD_PROVEEDOR" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input  onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className={`${FormName}_BLOQUEO requerido`}/>
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_PROVEEDOR" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                      <Main.Input disabled/>
                  </Main.Form.Item>
                </Main.Form.Item>
            </Main.Col>

            <Main.Col span={18}>
                <Main.Form.Item label={<label style={{ width: '55px' }}><span style={{ color: 'red' }}>*</span>Moneda</label>}>
                  <Main.Form.Item name="COD_MONEDA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className={`${FormName}_BLOQUEO requerido`} />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_MONEDA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                      <Main.Input disabled/>
                  </Main.Form.Item>
                </Main.Form.Item>
            </Main.Col>

            <Main.Col span={6}>
              <Main.Form.Item label={<label style={{width:'45px'}}>Cambio</label>} name="TIP_CAMBIO">
                <Main.NumberFormat 
                  className="type-numeri"
                  thousandSeparator="."
                  decimalScale={3}
                  decimalSeparator=","
                  onKeyDown={handleKeyDown} 
                  disabled={true}
                  style={{width:'calc(110% - 13px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={10}>
              <Main.Form.Item label={<label style={{width:'55px'}}>Cambio U$</label>} name="TIP_CAMBIO_US">
                <Main.NumberFormat 
                  className="type-numeri"
                  thousandSeparator="."
                  decimalScale={3}
                  decimalSeparator=","
                  disabled={true}        
                  onKeyDown={handleKeyDown}
                  style={{width:'calc(104% - 13px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={14}>
              <Main.Form.Item label={<label style={{width:'60px'}}>Referencias</label>}>
                <Main.Form.Item name="TIP_COMPROBANTE_REF" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                  <Main.Input className="search_input" onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDown}
                  />
                </Main.Form.Item>
                <Main.Form.Item name="SER_COMPROBANTE_REF" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                  <Main.Input className="search_input" onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDown}
                  />
                </Main.Form.Item>
                <Main.Form.Item name="NRO_COMPROBANTE_REF" style={{width:'calc(100% - 108px)', display:'inline-block'}}>
                  <Main.Input type="number" className="search_input" onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                </Main.Form.Item>

              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{width:'55px'}}>Estado</label>} name="ESTADO"                
                onChange={(e)=>{
                  let valor = {target:{}}
                  valor.target.id    = "ESTADO"
                  valor.target.value = e.target.value
                  if((e.target.value === 'C' || e.target.value === 'A') && form.getFieldValue('NRO_ENT_SAL') === ''){                                        
                    Main.message.warning({
                      content  : `Desbes guardar los datos antes de confirmar`,
                      className: 'custom-class',
                      duration : `${2}`,
                      style    : {marginTop: '2vh'},
                    });        
                    form.setFieldsValue({
                      ...form.getFieldsValue(),
                      ESTADO : 'P'
                    });
                  }else{
                    handleInputChange(valor);
                  }
                }} id="ESTADO">
                <Main.Radio.Group className={`${FormName}_ESTADO`}>
                  <Main.Radio value="P" onKeyDown={ handleKeyDown }>
                    Pendiente
                  </Main.Radio>
                  <Main.Radio value="C" onKeyDown={ handleKeyDown }>
                    Confirmado
                  </Main.Radio>
                  <Main.Radio value="A" onKeyDown={ handleKeyDown }>
                    Anulado
                  </Main.Radio>
                </Main.Radio.Group>
              </Main.Form.Item>
            </Main.Col>

          </Main.Row>
        </Main.Col>
        
        <Main.Col span={24} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'82px'}}>Observ.</label>} name="OBSERVACION">
            <Main.Input.TextArea className={`${FormName}_OBSERVACION`} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
          </Main.Form.Item>
        </Main.Col>
        
        <Main.Col id={`form-det-${FormName}`} style={{marginTop:'12px'}} span={24}>
          <Main.HandsontableGrid
            refData={refGrid}
            columns={columns}
            FormName={FormName}
            idComp={idComp}// id del componente
            height={205}
            maxFocus={maxFocus}
            setfocusRowIndex={setfocusRowIndex}
            columnNavigationEnter={columnNavigationEnter}
            colorButtom={false}
            dataCabecera={dataRef}
            columnModal={columnModal}
            validaExterno={validaExterno}
            setClickCell={setClickCell}
            focusEditMode={false} // boolean. true/ el valda externo se ejecuta solo cuando se edita el campo
          />          
        </Main.Col>
        <Main.Col span={14}/>
        
        <Main.Col span={5} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'125px'}}>Costo Unidad Básica</label>} name="COSTO_UB">
            <Main.NumberFormat 
              className="type-numeri"
              thousandSeparator="."
              decimalScale={3}
              decimalSeparator=","
              disabled={true}
              style={{width:'calc(104% - 13px)'}}
            />
          </Main.Form.Item>
        </Main.Col>

        <Main.Col span={5} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'60px'}}>Total</label>} name="TOT_COMPROBANTE">
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

        <Main.Col span={12} onClick={()=>setClickCell('CAB')}>
          <Main.Divider orientation="left" style={{margin:'2px 0'}}>Costo</Main.Divider>

          <Main.Card>
            <Main.Form.Item name="COSTO_ULTIMO" label={<label style={{ width: '130px' }}>Ultimo</label>}>
              <Main.Input style={{ width: '190px' }} disabled />
            </Main.Form.Item>
          </Main.Card>

        </Main.Col>

        <Main.Col span={12} onClick={()=>setClickCell('CAB')}>
          <Main.Divider orientation="left" style={{margin:'2px 0'}}>Auditoria</Main.Divider>
          
          <Main.Card>

            <Main.Row>

              <Main.Col span={12}>
                <Main.Form.Item label={<label style={{width:'80px'}}>Creado por </label>} name="COD_USUARIO">
                  <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item label={<label style={{width:'80px'}}>Modificado por</label>} name="COD_USUARIO_MODI">
                  <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item label={<label style={{width:'80px'}}>Fec Alta</label>} name="FEC_ALTA">
                  <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item label={<label style={{width:'80px'}}>Fec Modi</label>} name="FEC_MODI">
                  <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Col>

            </Main.Row>
            
          </Main.Card>

        </Main.Col>

        <Main.Col span={24} style={{ position: '',margenTop:'42px' , bottom:'5px', width: '80%', fontSize:'12px' }} >
          <div className='total_registro_pg'>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>

      </Main.Row>
    </Main.Form>      
  );
});

export default STENSAL;