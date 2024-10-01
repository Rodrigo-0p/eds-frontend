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
                  COD_DEPOSITO      : mainUrl.url_valida_deposito,
                  COD_DEPOSITO_ENT  : mainUrl.url_valida_deposito_ent,
                  COD_UNIDAD_MEDIDA : mainUrl.url_valida_um,
                  CANTIDAD          : mainUrl.url_valida_cantidad,
                  COD_CAUSA         : mainUrl.url_valida_causa,
                }],
  urlBuscador: [{ COD_ARTICULO      : mainUrl.url_buscar_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_buscar_um,
                  COD_CAUSA         : mainUrl.url_buscar_causa,
                }],
  title      : [{ COD_ARTICULO      : "Articulo",
                  COD_UNIDAD_MEDIDA : "Unidad Medida",
                  COD_CAUSA         : "Causa",
                }],
  COD_ARTICULO: [
    { data: 'COD_ARTICULO'      , title: 'Código'       ,className:'htLeft' },
    { data: 'DESC_ARTICULO'     , title: 'Descripción'  ,className:'htLeft' },
  ],
  COD_UNIDAD_MEDIDA: [
    { data: 'COD_UNIDAD_MEDIDA' , title: 'Código'       ,className:'htLeft' },
    { data: 'DESC_UM'           , title: 'Descripción'  ,className:'htLeft' },
  ],
  COD_CAUSA: [
    { data: 'COD_CAUSA'         , title: 'Código'       ,className:'htLeft' },
    { data: 'DESC_CAUSA'        , title: 'Descripción'  ,className:'htLeft' },
  ],
  config:{
    COD_ARTICULO:{
      depende_de:[],
      dependencia_de:[],
      depende_ex_cab:[{id:'COD_SUCURSAL' ,label: 'Sucursal'   }],
    },
    COD_DEPOSITO:{
      depende_de:[],
      dependencia_de:[],
      depende_ex_cab:[{id:'COD_SUCURSAL' ,label: 'Sucursal'   }],
    },
    COD_DEPOSITO_ENT:{
      depende_de:[],
      dependencia_de:[],
      depende_ex_cab:[{id:'COD_SUCURSAL' ,label: 'Sucursal'   }],
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[{id:'COD_ARTICULO'     ,label: 'Articulo'   }],
      dependencia_de:[],
      depende_ex_cab:[],
    },
    CANTIDAD:{
      depende_de:[{id:'COD_ARTICULO'     ,label: 'Articulo'    },
                  {id:'COD_DEPOSITO'     ,label: 'Deposito'    },                      
                  {id:'NRO_LOTE'         ,label: 'Nro Lote'    },
                  {id:'CANTIDAD_ANT'     ,label: 'Cantidad ant'},
                  {id:'MULT'             ,label: 'Mult'        },
                  {id:'DIV'              ,label: 'Div'         },
                  {id:'DESC_ARTICULO'    ,label: 'Desc Art'    },
                  {id:'DESC_UM'          ,label: 'Desc Um'     },
                 ],      
      dependencia_de:[],
      depende_ex_cab:[{id:'COD_SUCURSAL',label: 'Sucursal'     },],
    }
  },
};

let subTitle = [
  {},
  {},
  {label:'Deposito',colspan:2}
  ,
]

export const columns = [
  { data: 'COD_ARTICULO'     , title: 'Articulo'    , width : 35  , className: 'htLeft'  , requerido:true    , readOnly:false }, 
  { data: 'DESC_ARTICULO'    , title: 'Descripcion' , width : 120 , readOnly:true        , filter:false      , textWrap:true  }, 
  { data: 'COD_DEPOSITO'     , title: 'Salida'      , width : 35  , className: 'htCenter', requerido:true    , readOnly:false  , subTitle:subTitle},
  { data: 'COD_DEPOSITO_ENT' , title: 'Entrada'     , width : 35  , className: 'htCenter', requerido:true    , readOnly:false },
  { data: 'COD_UNIDAD_MEDIDA', title: 'U.M'         , width : 25  , className: 'htLeft'  , requerido:true    , readOnly:false  , editFocus:true   },
  { data: 'DESC_UM'          , title: 'Descripcion' , width : 100 , readOnly:true        , filter:false  }   , 
  { data: 'CANTIDAD'         , title: 'Cantidad'    , width : 55  , type:'numeric'       , requerido:true    , className: 'htRight' , readOnly:false  , format:{pattern: '0,000'}},
  { data: 'CANTIDAD_UB'      , title: 'Cantidad Ub' , width : 55  , type:'numeric'       , requerido:true    , className: 'htRight' , readOnly:true   , format:{pattern: '0,000'}},
  { data: 'COD_CAUSA'        , title: 'Causa'       , width : 60  , className:'htLeft'   , requerido:true}   ,
  { data: 'DESC_CAUSA'       , title: 'Descripcion' , width : 130 , textWrap:true        , readOnly:true}    ,      
]

const columnNavigationEnter = [0,2,3,4,6,8];

const STENVIO = memo(({refGrid         ,form    ,FormName,  idComp, handleKeyDown, handleInputChange,      handleKeyUp ,
                       setfocusRowIndex,dataRef ,validaExterno    , setClickCell , activateButtonCancelar, refBloqueo  ,
                       setLastFocusNext}) => {


  const maxFocus = [{
    id:idComp         ,
    hasta:"COD_CAUSA" ,
    newAddRow:true    ,
    nextId:''
  }];
                      
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px' }}>
      <Main.Row gutter={[4, 2]}>

        <Main.Col span={12} onClick={()=>setClickCell('CAB')}>
          <Main.Row id={`form-cab-${FormName}`} gutter={[2,2]}>

          <Main.Col span={12}>            
              <Main.Form.Item className='form-items' name="NRO_COMPROBANTE" type="text" label={<label style={{ marginLeft: '43px' }}>Número</label>} >
                <Main.Input 
                  onKeyUp={handleKeyUp} 
                  onKeyDown={handleKeyDown}
                  className={`search_input ${FormName}_BLOQUEO`}
                  name="NRO_COMPROBANTE" 
              />
              </Main.Form.Item>            
          </Main.Col>

          <Main.Col span={12}>
            <ConfigProvider locale={locale} >
              <Main.Form.Item name="FEC_COMPROBANTE" label={<label style={{width:'45px'}}>Fecha</label>}>
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
            </ConfigProvider>
          </Main.Col>

          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{width:'81px'}}>Cambio U$</label>} name="TIP_CAMBIO_US">
              <Main.NumberFormat 
                className="type-numeri requerido"
                thousandSeparator="."
                decimalScale={3}
                decimalSeparator=","
                disabled={true}        
                onKeyDown={handleKeyDown}
                style={{width:'calc(104% - 22px)'}}
              />
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={24}>
              <Main.Form.Item label={<label style={{width:'81px'}}>Estado</label>} name="ESTADO"                
                onChange={(e)=>{
                  let valor = {target:{}}
                  valor.target.id    = "ESTADO"
                  valor.target.value = e.target.value
                  if((e.target.value === 'C' || e.target.value === 'A') && form.getFieldValue('NRO_COMPROBANTE') === ''){                                        
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
                  <Main.Radio value="P"  onKeyDown={ handleKeyDown} >
                    Pendiente
                  </Main.Radio>
                  <Main.Radio value="C" onKeyDown={ handleKeyDown }>
                    Confirmado
                  </Main.Radio>
                  <Main.Radio value="A" onKeyDown={ handleKeyDown } >
                    Anulado
                  </Main.Radio>
                </Main.Radio.Group>
              </Main.Form.Item>
          </Main.Col>

          <Main.Col span={24}>
            <Main.Row>
              <Main.Col span={12}>
                <Main.Form.Item className='form-items' name="NRO_PLANILLA" type="text" label={<label style={{ marginLeft: '22px' }}>Nro. Planilla</label>} >
                  <Main.Input 
                    onKeyUp={handleKeyUp} 
                    onKeyDown={handleKeyDown}
                    className={`search_input ${FormName}_BLOQUEO`}
                    name="NRO_PLANILLA" />
                </Main.Form.Item>              
              </Main.Col>
              <Main.Col span={12}>

                <Main.Form.Item label={<label style={{width:'60px'}}>Referencias</label>}>
                  
                  <Main.Form.Item name="TIP_COMPROBANTE_REF" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                    <Main.Input className={`search_input ${FormName}_BLOQUEO`} onKeyUp={handleKeyUp}  onChange={handleInputChange} onKeyDown={handleKeyDown}/>
                  </Main.Form.Item>
                  <Main.Form.Item name="SER_COMPROBANTE_REF" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                    <Main.Input className={`search_input ${FormName}_BLOQUEO`}  onKeyUp={handleKeyUp}  onChange={handleInputChange}  onKeyDown={handleKeyDown}/>
                  </Main.Form.Item>
                  <Main.Form.Item name="NRO_COMPROBANTE_REF" style={{width:'calc(100% - 108px)', display:'inline-block'}}>
                    <Main.Input type="number" className={`search_input ${FormName}_BLOQUEO`}  onKeyUp={handleKeyUp}  onChange={handleInputChange} onKeyDown={handleKeyDown} />
                  </Main.Form.Item>
                </Main.Form.Item>

              </Main.Col>
            </Main.Row>

          </Main.Col>


          </Main.Row>
        </Main.Col>

        <Main.Col span={12} onClick={()=>setClickCell('CAB')} >
          <Main.Row>

              <Main.Col span={24}>

                <Main.Form.Item label={<label style={{ width: '60px' }}><span style={{ color: 'red' }}>*</span>Sucursal</label>}>
                  <Main.Form.Item name="COD_SUCURSAL" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input className={`${FormName}_BLOQUEO`} onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}/>
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_SUCURSAL" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                      <Main.Input disabled/>
                  </Main.Form.Item>
                </Main.Form.Item>

              </Main.Col>
              
            <Main.Col span={24}>

              <Main.Form.Item label={<label style={{ width: '60px' }}><span style={{ color: 'red' }}>*</span>Motivo</label>}>
                <Main.Form.Item name="COD_MOTIVO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} className={`${FormName}_BLOQUEO`} onKeyUp={handleKeyUp} />
                </Main.Form.Item>
                <Main.Form.Item name="DESC_MOTIVO" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>

              <Main.Col span={24} onClick={()=>setClickCell('CAB')}>
                <Main.Form.Item label={<label style={{width:'60px'}}>Observ.</label>} name="COMENTARIO">
                  <Main.Input.TextArea style={{height:'55px'}} className={`${FormName}_COMENTARIO`} onChange={handleInputChange}  onKeyDown={handleKeyDown}/>
                </Main.Form.Item>
              </Main.Col>

            </Main.Col>
            

          </Main.Row>          

        </Main.Col>

        <Main.Col span={24} style={{marginTop:'12px'}}>
          
          <Main.HandsontableGrid
            refData={refGrid}
            columns={columns}
            FormName={FormName}
            idComp={idComp}// id del componente
            height={355}
            setfocusRowIndex={setfocusRowIndex}
            columnNavigationEnter={columnNavigationEnter}
            setLastFocusNext={setLastFocusNext}
            maxFocus={maxFocus}
            colorButtom={false}
            dataCabecera={dataRef}
            columnModal={columnModal}
            // validaExterno={validaExterno}
            setClickCell={setClickCell}
            //multipleHeader={true} 
            focusEditMode={false} // boolean. true/ el valda externo se ejecuta solo cuando se edita el campo
          />         

        </Main.Col>
        
        <Main.Col span={24}>
          <Main.Row>

            <Main.Col span={5}>
              <Main.Form.Item label={<label style={{width:'70px'}}>Dep. Salida</label>} name="DESC_DEPOSITO">
                <Main.Input disabled={true}/>
              </Main.Form.Item>
            </Main.Col>
            <Main.Col span={5}>
              <Main.Form.Item label={<label style={{width:'75px'}}>Dep. Entrada</label>} name="DESC_DEPOSITO_ENT">
                <Main.Input disabled={true}/>
              </Main.Form.Item>
            </Main.Col>
            <Main.Col span={3}>
              <Main.Form.Item label={<label style={{width:'45px'}}>Ultimo</label>} name="COSTO_ULTIMO">
                <Main.NumberFormat 
                  className="type-numeri"
                  thousandSeparator="."
                  decimalScale={3}
                  decimalSeparator=","
                  disabled={true}
                  style={{width:'calc(110% - 13px)'}}
                />
              </Main.Form.Item>
            </Main.Col>
            <Main.Col span={3}>
              <Main.Form.Item label={<label style={{width:'70px'}}>Unid. Básica</label>} name="CANTIDAD_UB">
                <Main.Input disabled={true} style={{textAlign:'right'}}/>
              </Main.Form.Item>
            </Main.Col>
            <Main.Col span={4}> 
              <Main.Form.Item label={<label style={{width:'65px'}}>Creado por</label>} name="COD_USUARIO">
                <Main.Input disabled={true}/>
              </Main.Form.Item>
            </Main.Col>
            <Main.Col span={4}>
              <Main.Form.Item label={<label style={{width:'49px'}}>Fec. Alta</label>} name="FEC_ALTA">
                <Main.Input disabled={true}/>
              </Main.Form.Item> 
            </Main.Col>

          </Main.Row>
        </Main.Col>

        <Main.Col span={24} style={{ position: '',margenTop:'42px' , bottom:'5px', width: '80%', fontSize:'12px' }}>
          <div className='total_registro_pg'>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>

      </Main.Row>
    </Main.Form>      
  );
});

export default STENVIO;