import React, { memo } from 'react';
import Main            from '../../../../../../componente/util/main';
import { ConfigProvider
        , DatePicker } from 'antd'
import locale          from "antd/es/locale/es_ES";
import mainColumn      from './columnModal/mianColumn';
import "dayjs/locale/es";

const CCNCRDEF = memo((props) => {
    
  const maxFocus = [{
    id:props.idComp               ,
    hasta:"PRECIO_UNITARIO_C_IVA" ,
    newAddRow:true                 ,
    nextId:''
  }];
  
  return (
    <Main.Form size="small" autoComplete="off" form={props.form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row>
        <Main.Col span={13} onClick={()=>props.setClickCell('CAB')} >
          <Main.Row id={`form-cab-${props.FormName}`} gutter={[2,0]}>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '85px' }}><span style={{ color: 'red' }}>*</span>Sucursal</label>}>
                <Main.Form.Item name="COD_SUCURSAL" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyUp={props.handleKeyUp} onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`${props.FormName}_BLOQUEO requerido`}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_SUCURSAL" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{width:'85px'}}>Comprobante</label>}>
                <Main.Form.Item name="TIP_COMPROBANTE"  style={{width:'100px',  display:'inline-block', marginRight:'4px'}}>
                  <Main.Input onKeyUp={props.handleKeyUp} readOnly={true} className="search_input"/>
                </Main.Form.Item>
                <Main.Form.Item name="SER_COMPROBANTE"  style={{width:'100px', display:'inline-block', marginRight:'4px'}}>
                  <Main.Input onKeyUp={props.handleKeyUp} readOnly={true} className="search_input"/>
                </Main.Form.Item>
                <Main.Form.Item onKeyDown={props.handleKeyDown} name="NRO_COMPROBANTE" style={{width:'calc(100% - 209px)', display:'inline-block'}}>
                  <Main.Input onKeyUp={props.handleKeyUp} onChange={props.handleInputChange} type="number" className={`search_input  ${props.FormName}_BLOQUEO_NRO_COMP`} />
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '85px' }}><span style={{ color: 'red' }}>*</span>Cliente</label>}>
                <Main.Form.Item name="COD_CLIENTE" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyUp={props.handleKeyUp} onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`${props.FormName}_BLOQUEO requerido`}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_CLIENTE" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item className='form-items' name="DIR_CLIENTE" type="text" label={<label style={{ marginLeft: '45px' }}>Dircción</label>} >
                <Main.Input readOnly={true} className={`search_input ${props.FormName}_BLOQUEO`} />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={12}>
              <Main.Form.Item className='form-items' name="TEL_CLIENTE" type="text" label={<label style={{ marginLeft: '44px' }}>Teléfono</label>} >
                <Main.Input onKeyUp={props.handleKeyUp} readOnly={true} className={`search_input ${props.FormName}_BLOQUEO`} />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={12}>
              <Main.Form.Item className='form-items' name="CI" type="text" label={<label style={{ marginLeft: '11px' }}>C.I</label>} >
                <Main.Input  onKeyUp={props.handleKeyUp} readOnly={true} className={`search_input ${props.FormName}_BLOQUEO`} />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{width:'85px'}}>Nota Prov.</label>}>
                <Main.Form.Item name="TIP_COMPROBANTE_REF" style={{width:'51px',  display:'inline-block', marginRight:'4px'}}>
                  <Main.Input onKeyUp={props.handleKeyUp} readOnly={true} className="search_input"/>
                </Main.Form.Item>
                <Main.Form.Item name="SER_COMPROBANTE_REF" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                  <Main.Input onKeyUp={props.handleKeyUp} readOnly={true} className="search_input"/>
                </Main.Form.Item>
                <Main.Form.Item name="NRO_COMPROBANTE_REF" style={{width:'calc(100% - 111px)', display:'inline-block'}}>
                  <Main.Input  onKeyUp={props.handleKeyUp} onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} type="number" className="search_input" />
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '85px' }}>Cond. Venta</label>}>
                <Main.Form.Item name="COD_CONDICION_VENTA" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyUp={props.handleKeyUp} onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`${props.FormName}_BLOQUEO requerido`}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_CONDICION" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '85px' }}>Motivo NCR</label>}>
                <Main.Form.Item name="COD_MOTIVO_NCR" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyUp={props.handleKeyUp} onChange={props.handleInputChange} onKeyDown={props.handleKeyDown}  className={`${props.FormName}_BLOQUEO requerido`}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_MOTIVO_NCR" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '85px' }}>Lista de Precios</label>}>
                <Main.Form.Item name="COD_LISTA_PRECIO" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyUp={props.handleKeyUp} onChange={props.handleInputChange} onKeyDown={props.handleKeyDown}  className={`${props.FormName}_BLOQUEO requerido`}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_LISTA_PRECIO" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>
          
          </Main.Row>
        </Main.Col>
        
        <Main.Col span={11} onClick={()=>props.setClickCell('CAB')}>
          <Main.Row id={`form-cab-${props.FormName}`} gutter={[0,0]}>
            <Main.Col span={4}/>
            
            <Main.Col span={20}>
              <ConfigProvider locale={locale} >
                <Main.Form.Item name="FEC_COMPROBANTE" label={<label style={{width:'69px'}}>Fecha</label>}>
                 <DatePicker
                  style={{width:'100%',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>props.handleKeyDown(e)}
                  onChange={(e)=>{props.activateButtonCancelar(e,"FEC_COMPROBANTE")}}
                  format={['DD/MM/YYYY']}
                  key="FEC_COMPROBANTE"
                  placeholder=""
                  className={`${props.FormName}_FEC_COMPROBANTE`}
                  onClick={(()=>Main.openStart(`${props.FormName}_FEC_COMPROBANTE`))}
                />
                </Main.Form.Item>
              </ConfigProvider>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '69px' }}>Sub Cliente</label>}>
                <Main.Form.Item name="COD_SUBCLIENTE" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`${props.FormName}_BLOQUEO requerido`}/>
                </Main.Form.Item>
                <Main.Form.Item name="NOM_SUBCLIENTE" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>
           
            <Main.Col span={24}>            
              <Main.Form.Item className='form-items' name="RUC" label={<label style={{ marginLeft: '43px' }}>R.U.C</label>} >
                <Main.Input onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`search_input ${props.FormName}_BLOQUEO`} style={{display: 'inline-block' }}  />
              </Main.Form.Item>            
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '69px' }}>Zona</label>}>
                <Main.Form.Item name="COD_ZONA" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`${props.FormName}_BLOQUEO requerido`}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_ZONA" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{width:'69px'}}>Referencia</label>}>
                <Main.Form.Item name="TIP_REFERENCIA"  style={{width:'100px', display:'inline-block', marginRight:'4px'}}>
                  <Main.Input readOnly={true} className="search_input"/>
                </Main.Form.Item>
                <Main.Form.Item name="SER_REFERENCIA"  style={{width:'100px', display:'inline-block', marginRight:'4px'}}>
                  <Main.Input readOnly={true} className="search_input"/>
                </Main.Form.Item>
                <Main.Form.Item name="NRO_REFERENCIA"  style={{width:'calc(100% - 209px)', display:'inline-block'}}>
                  <Main.Input readOnly={true} className="search_input" />
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '69px' }}>Vendedor</label>}>
                <Main.Form.Item name="COD_VENDEDOR" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`${props.FormName}_BLOQUEO requerido`}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_VENDEDOR" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

          <Main.Col span={12}>
            <Main.Form.Item label={<label style={{ width: '69px' }}>Moneda</label>}>
              <Main.Form.Item name="COD_MONEDA" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                <Main.Input onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`${props.FormName}_BLOQUEO requerido`} />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_MONEDA" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

           <Main.Col span={12}>
            <Main.Form.Item label={<label style={{width:'44px'}}>Cambio</label>} name="TIP_CAMBIO">
              <Main.NumberFormat 
                className="type-numeri"
                thousandSeparator="."
                decimalScale={3}
                decimalSeparator=","
                disabled={true}
                style={{width:'calc(100% - 5px)'}}
              />
            </Main.Form.Item>
          </Main.Col>


          <Main.Col span={12}/>                       
          <Main.Col span={12}>            
            <Main.Form.Item name="NRO_NCR_CLIENTE" className='form-items' label={<label style={{ marginLeft: '43px' }}>Nro. NCR Cliente</label>} >
              <Main.Input onChange={props.handleInputChange} onKeyDown={props.handleKeyDown} className={`search_input ${props.FormName}_BLOQUEO`} style={{display: 'inline-block' }}  />
            </Main.Form.Item>            
          </Main.Col>

          </Main.Row>
        </Main.Col>

        <Main.Col id={`form-det-${props.FormName}`} style={{marginTop:'1px'}} span={24}>
          <Main.HandsontableGrid
            refData={props.refGrid}
            columns={mainColumn.columnDet}
            FormName={props.FormName}
            idComp={props.idComp}// id del componente
            height={140}
            maxFocus={maxFocus}
            setLastFocusNext={props.setLastFocusNext}
            setfocusRowIndex={props.setfocusRowIndex}
            columnModal={mainColumn.columnModalDet}
            columnNavigationEnter={mainColumn.nextEnter}
            // colorButtom={false}
            dataCabecera={React.useCallback(()=>{
              return props.dataRef.current.data[props.refIndex.current.indice]
              // eslint-disable-next-line
            },[props.dataRef.current.data])}
            executeCab={true}
            nextValidaInput={props.nextValidaInput}
            validaAllExterno={props.validaAllExterno}
            // afterChangeBoolean={false} // esto desactiva el evento de eliminacion KeyDown despues de una edicion
            setClickCell={props.setClickCell}
            // focusEditMode={false} // boolean. true/ el valda externo se ejecuta solo cuando se edita el campo
          />          
        </Main.Col>

        <Main.Col span={6} onClick={()=>props.setClickCell('CAB')}>
          <Main.Form.Item name="DESC_UNIDAD_MEDIDA" label={<label style={{width:'50px'}}>U.Medida</label>}>
            <Main.Input  style={{width:'100%', display:'inline-block',marginTop:'5px'}} readOnly={true}/>
          </Main.Form.Item>
        </Main.Col>
        
        <Main.Col span={16}/>

        <Main.Col span={24}>
          <Main.Row>
          
            <Main.Col span={12}>
              <Main.Card>
                <Main.Row>
                  
                  <Main.Col span={12}>
                    <Main.Form.Item name="ESTADO" label={<label style={{width:'55px'}}>Estado</label>}>
                      <Main.Select 
                        onChange={(e)=>{
                          let value = {target : {id:'ESTADO',value:e}}
                          props.handleInputChangeSelect(value)                        
                        }} className="ESTADO" allowClear placeholder="" >
                        <Main.Select.Option value="P">Pendiente</Main.Select.Option>
                        <Main.Select.Option value="C">Aplicado</Main.Select.Option>
                        <Main.Select.Option value="A">Anulado</Main.Select.Option>
                      </Main.Select>
                    </Main.Form.Item>
                  </Main.Col>
                  
                  <Main.Col span={12}/>
                  
                  <Main.Col span={12}>
                    <Main.Form.Item label={<label style={{width:'55px'}}>Fec Estado</label>} name="FEC_ESTADO">
                      <Main.Input disabled />
                    </Main.Form.Item>
                  </Main.Col>
                  <Main.Col span={12}>
                    <Main.Form.Item label={<label style={{width:'55px'}}>Usuario</label>} name="COD_USUARIO_MODI">
                      <Main.Input disabled />
                    </Main.Form.Item>
                  </Main.Col>

                  <Main.Col span={24} style={{marginTop:'5px'}}>
                    <Main.Form.Item name="OBSERVACION" label={<label style={{width:'55px'}}>Obs.</label>}>
                      <Main.Input.TextArea className={`${props.FormName}_OBSERVACION`} onChange={props.handleInputChange} />
                    </Main.Form.Item>
                  </Main.Col>

                </Main.Row>
              </Main.Card>

            </Main.Col>
            
            <Main.Col span={12}>
              <Main.Card>
                <Main.Row gutter={[2,2]}>
                  <Main.Col span={12}><label style={{fontWeight:'bold'}}>Descuento Financiero</label></Main.Col>
                  <Main.Col span={12}><label style={{fontWeight:'bold'}}>Descuento Varios</label></Main.Col>

                  <Main.Col span={12}>
                    <Main.Form.Item name="PORC_DESC_FIN" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input onKeyDown={props.handleKeyDown} readOnly={true} />
                    </Main.Form.Item>
                    <Main.Form.Item name="DESCUENTO_FIN" style={{ width: 'calc(100% - 56px)', display: 'inline-block' }}>
                      <Main.Input disabled/>
                    </Main.Form.Item>
                    
                    <Main.Form.Item name="SUM_DESCUENTO_FIN" label={<label style={{width:'41px'}}>Total</label>}>
                      <Main.NumberFormat
                        className={` type-numeri ant-input ant-input-sm`}
                        thousandSeparator="."
                        decimalSeparator=","
                        style={{textAlign:'right',width:'100%'}}
                        disabled
                      />
                    </Main.Form.Item>
                  </Main.Col>

                  <Main.Col span={12}>
                    <Main.Form.Item name="PORC_DESC_VAR" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input onKeyDown={props.handleKeyDown} readOnly={true} />
                    </Main.Form.Item>
                    <Main.Form.Item name="DESCUENTO_VAR" style={{ width: 'calc(100% - 56px)', display: 'inline-block' }}>
                      <Main.Input disabled/>
                    </Main.Form.Item>
                    
                    <Main.Form.Item name="SUM_DESCUENTO_VAR" label={<label style={{width:'41px'}}>Total</label>}>
                      <Main.NumberFormat
                        className={`type-numeri ant-input ant-input-sm`}
                        thousandSeparator="."
                        decimalSeparator=","
                        style={{textAlign:'right',width:'100%'}}
                        disabled
                      />
                    </Main.Form.Item>
                  </Main.Col>

                  <Main.Col span={6}>
                    <Main.Form.Item name="TOT_EXENTAS" label={<label style={{width:'41px'}}>Exentas</label>}>
                      <Main.NumberFormat
                        className={`type-numeri ant-input ant-input-sm`}
                        thousandSeparator="."
                        decimalSeparator=","
                        style={{textAlign:'right',width:'95%'}}
                        disabled
                      />
                    </Main.Form.Item>
                  </Main.Col>
                  <Main.Col span={6}>
                    <Main.Form.Item name="TOT_GRAVADAS" label={<label style={{width:'45px'}}>Grabadas</label>}>
                      <Main.NumberFormat
                        className={`type-numeri ant-input ant-input-sm`}
                        thousandSeparator="."
                        decimalSeparator=","
                        style={{textAlign:'right',width:'100%'}}
                        disabled
                      />
                    </Main.Form.Item>
                  </Main.Col>
                  <Main.Col span={6}>
                    <Main.Form.Item name="TOT_IVA" label={<label style={{width:'41px'}}>I.V.A</label>}>
                      <Main.NumberFormat
                        className={`type-numeri ant-input ant-input-sm`}
                        thousandSeparator="."
                        decimalSeparator=","
                        style={{textAlign:'right',width:'95%'}}
                        disabled
                      />
                    </Main.Form.Item>
                  </Main.Col>
                  <Main.Col span={6}>
                    <Main.Form.Item name="SUMA_MONTO_TOTAL" label={<label style={{width:'24px',fontWeight:'600',color:'red'}}>Total</label>}>
                      <Main.NumberFormat
                        className={`type-numeri ant-input ant-input-sm`}
                        thousandSeparator="."
                        decimalSeparator=","
                        style={{textAlign:'right',width:'100%'}}
                        disabled
                      />
                    </Main.Form.Item>
                  </Main.Col>

                </Main.Row>
              </Main.Card>
            </Main.Col>

          </Main.Row>
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

export default CCNCRDEF;