import React, { memo } from 'react';
import mainColumn      from './columnModal/mainColumn';
import Main            from '../../../../../../componente/util/main';

const CCMOVCAJ = memo((props) => {
  return (
    <Main.Form size="small" autoComplete="off" form={props.form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[8, 2]}>

        <Main.Col span={6} onClick={()=>props.setClickCell('CAB')}>

          <Main.Card className={`CARD_${props.FormName}`}>
            <Main.Row>

              <Main.Col span={24}>

                <Main.Form.Item label={<label style={{width:'60px'}}>Referencias</label>}>
                  <Main.Form.Item name="TIP_MOV_CAJ" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                    <Main.Input readOnly={true} onKeyDown={props.handleKeyDown} onKeyUp={props.handleKeyUp} className="search_input"
                    />
                  </Main.Form.Item>
                  <Main.Form.Item name="SER_MOV_CAJ" style={{width:'50px', display:'inline-block', marginRight:'4px'}}>
                    <Main.Input readOnly={true} onKeyDown={props.handleKeyDown} onKeyUp={props.handleKeyUp} className="search_input" 
                    />
                  </Main.Form.Item>
                  <Main.Form.Item name="NRO_MOV_CAJ" style={{width:'calc(100% - 108px)', display:'inline-block'}}>
                    <Main.Input onKeyDown={props.handleKeyDown} onKeyUp={props.handleKeyUp} className="search_input"  />
                  </Main.Form.Item>

                </Main.Form.Item>
                
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="FEC_MOV_CAJ" label={<label style={{width:'60px'}}>Fecha</label>}>
                  <Main.Input 
                    onInput={props.handleInputMascara}
                    onKeyDown={props.handleKeyDown}
                    onKeyUp={props.handleKeyUp}
                    readOnly={true}
                    style={{textAlign:'right'}} 
                    className="search_input"
                  />
                </Main.Form.Item>   
              </Main.Col>

              <Main.Col span={10}>
                <Main.Form.Item name="COD_MONEDA" label={<label style={{ width: '60px', display: 'inline-block'}}>Moneda</label>}>                  
                  <Main.Input onKeyDown={props.handleKeyDown} onChange={props.handleInputChange} onKeyUp={props.handleKeyUp}/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={14}>
                <Main.Form.Item label={<label style={{width:'45px'}}>Cambio</label>} name="TIP_CAMBIO">
                  <Main.NumberFormat 
                    className="type-numeri"
                    thousandSeparator="."
                    decimalScale={3}
                    decimalSeparator=","
                    disabled={true}
                    onKeyUp={props.handleKeyUp}
                    style={{width:'calc(110% - 14px)'}}
                  />
                </Main.Form.Item>
              </Main.Col>
              
              <Main.Col span={24}>
                <Main.Form.Item name="NRO_CUENTA" className='form-items' label={<label style={{ width: '60px' }}>Cuenta</label>} >
                  <Main.Input readOnly={true} onKeyDown={props.handleKeyDown} onKeyUp={props.handleKeyUp} className={`search_input`}/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{width:'60px'}}>Cliente</label>}>
                  <Main.Form.Item name="COD_CLIENTE"  onKeyDown={props.handleKeyDown} onChange={props.handleInputChange} onKeyUp={props.handleKeyUp} style={{width:'calc(100% - 152px)',display:'inline-block', marginRight:'4px'}}>
                    <Main.Input />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_CLIENTE" style={{ width: 'calc(100% - 73px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
              <Main.Form.Item name="TIP_COMPR_REF" label={<label style={{ width: '60px' }}>Ref</label>}>
                <Main.Select 
                  allowClear                  
                  onChange={(e)=>{
                    let value = {target : {id:'TIP_COMPR_REF',value:e}}
                    props.handleInputChange(value)  
                  }} >
                  <Main.Select.Option value="REP">Reparto           </Main.Select.Option>
                  <Main.Select.Option value="PLC">Cobranza          </Main.Select.Option>  
                  <Main.Select.Option value="IND">Individual        </Main.Select.Option>
                  <Main.Select.Option value="EXP">Pago Express      </Main.Select.Option>
                  <Main.Select.Option value="PRA">Practipagos       </Main.Select.Option>
                  <Main.Select.Option value="AQU">Aqui Pagos        </Main.Select.Option>
                  <Main.Select.Option value="VEN">Punto de Venta    </Main.Select.Option>
                  <Main.Select.Option value="RET">Canc. de Retencion</Main.Select.Option>
                  <Main.Select.Option value="NIN">Ninguno           </Main.Select.Option>
                </Main.Select>
                </Main.Form.Item>                
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item name="NRO_COMPR_REF" className='form-items' label={<label style={{ width: '60px' }}>Planilla</label>} >
                <Main.Input onKeyDown={props.handleKeyDown} onChange={props.handleInputChange} onKeyUp={props.handleKeyUp} className={`search_input`}/>
              </Main.Form.Item>
            </Main.Col>

            </Main.Row>
          </Main.Card>

        </Main.Col>

        <Main.Col span={18}>
          <Main.Row>
            <Main.Col span={24}>
              <div className={`handsontable_${props.FormName}`}>
                <Main.HandsontableGridLarge 
                  hotRef={props.refRef}
                  columns={mainColumn.columns_ref}
                  navigationIndexes={mainColumn.next_ref}
                  id={props.idCompRef}
                  height={176.5}
                  onCellKeyDown={(e)=>props.onKeyDownGrill(e,props.idCompRef)}
                  setfocusRowIndex={(e,row,comumn)=>props.setfocusRowIndex(e,row,comumn,props.idCompRef)}
                  handlechangeDet={props.handlechangeGri}
                  refhasontable={props.refhasontable}
                  modalClick={true}            
                  FormName={props.FormName}
                />
              </div> 
            </Main.Col>
            <Main.Col span={18}/>
            <Main.Col span={6}>
              <Main.Form.Item  name="TOT_NRO_MOV_CAJ" label={<label style={{width:'60px',fontWeight:'600'}}>Total Comp.</label>}x>
                <Main.NumberFormat 
                  readOnly={true} 
                  className="type-numeri ant-input ant-input-sm" 
                  thousandSeparator="." decimalSeparator="," 
                  style={{textAlign:'right',width:'calc(100% - 0px)'}}/>
              </Main.Form.Item>
            </Main.Col>
          </Main.Row>
          
        </Main.Col>

        {/* <Main.Col span={4}>
          <Main.Button className={`Button_${props.FormName}`} type='primary'>
            Cargar Retención
          </Main.Button>            
        </Main.Col> */}
        
        <Main.Col span={24} style={{marginTop:'5px'}}>
          <div className={`handsontable_${props.FormName}`}>
            <Main.HandsontableGridLarge 
              hotRef={props.refDet}
              columns={mainColumn.columns_det}
              navigationIndexes={mainColumn.next_det}
              id={props.idCompDet}
              height={180}
              onCellKeyDown={(e)=>props.onKeyDownGrill(e,props.idCompDet)}
              setfocusRowIndex={(e,row,comumn)=>props.setfocusRowIndexDet(e,row,comumn,props.idCompDet)}
              setClickCell={(e)=>props.setClickCell(e)}
              handlechangeDet={props.handlechangeGri}
              refhasontable={props.refhasontable}
              modalClick={true}            
              FormName={props.FormName}
            />
          </div>  
        </Main.Col>

        <Main.Col span={15} style={{marginTop:'5px'}}>
          <Main.Card>
            <Main.Row>
              <Main.Col span={24}>
                <Main.Form.Item name="DESC_TRANSACCION" label={<label style={{width:'95px'}}>Transacción</label>}>
                  <Main.Input readOnly={true} />
                </Main.Form.Item>                              
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="NOM_PER_JURIDICA" label={<label style={{width:'95px'}}>Banco/Emisor</label>}>
                  <Main.Input readOnly={true} />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="NOM_CLIENTE" label={<label style={{width:'95px', color:'red',fontWeight:500}}>Nombre Prop. CHE</label>}>
                  <Main.Input readOnly={true} />
                </Main.Form.Item>
              </Main.Col>

            </Main.Row>
          </Main.Card>
        </Main.Col>
        
        <Main.Col span={3}/>

        <Main.Col span={6} style={{marginTop:'5px'}}>
          <Main.Card>
            <Main.Row>
            
              <Main.Col span={24}>
                <Main.Form.Item name="TOTAL"  label={<label style={{width:'50px',color:'#386097',fontWeight:700}}>Total</label>} >
                  <Main.NumberFormat   
                    className="type-numeri ant-input ant-input-sm"
                    thousandSeparator="." decimalSeparator="," 
                    readOnly={true} 
                    style={{textAlign:'right',width:'calc(100% - 0px)'}}/>
                </Main.Form.Item>
              </Main.Col>
            
              <Main.Col span={24}>
                <Main.Form.Item name="DIFERENCIA"  label={<label style={{width:'50px',color:'red',fontWeight:600}}>Vuelto</label>} >
                  <Main.NumberFormat   
                    className="type-numeri ant-input ant-input-sm"
                    thousandSeparator="." decimalSeparator="," 
                    readOnly={true} 
                    style={{textAlign:'right',width:'calc(100% - 0px)'}}/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="COD_USUARIO" label={<label style={{width:'53px',color:'red'}}>Usuario</label>} >
                  <Main.Input />
                </Main.Form.Item>
              </Main.Col>

            </Main.Row>        

          </Main.Card>
        </Main.Col>
        
        <Main.Col span={24} style={{margenTop:'60px', width: '80%', fontSize:'12px' }}>
          <div className='total_registro_pg'>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>

      </Main.Row>
    </Main.Form>  
  );
});

export default CCMOVCAJ;