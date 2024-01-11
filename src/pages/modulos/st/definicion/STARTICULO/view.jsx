import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import mainUrl         from './url/mainUrl'

const columnModal = {
  urlValidar : [{ 
                  COD_UNIDAD_REL : mainUrl.url_valida_um,
                }],
  urlBuscador: [{ 
                  COD_UNIDAD_REL : mainUrl.url_buscar_um ,
                }],
  title      : [{ 
                  COD_UNIDAD_REL : "Unidad Medida"   ,
                }],
  COD_UNIDAD_REL: [
    { data: 'COD_UNIDAD_REL' , title: 'Código'       ,className:'htLeft'   },
    { data: 'REFERENCIA'     , title: 'Descripción'  ,className:'htLeft' 	 },
  ],
  config:{
    },
    // COD_PAIS:{
    //   depende_de:[],
    //   dependencia_de:[],
    //   depende_ex_cab:[],
    // },
};

export const columns = [
  { data: 'COD_UNIDAD_REL' , title: 'U.M'            , width : 25  , className: 'htLeft'   , requerido:true  , readOnly:true   }, 
  { data: 'REFERENCIA'     , title: 'Referencia'     , width : 130 , readOnly:false        , requerido:true  , filter:false    , textWrap:true    }, 
  { data: 'MULT'           , title: 'Cantidad'       , width : 40  , type:'numeric'        , requerido:true  , className: 'htLeft',edit:true       , readOnly:false }, 
  { data: 'KG_PESO_NETO'   , title: 'Peso(Kg)'       , width : 40  , type:'numeric'        , requerido:true  , className: 'htLeft',edit:true       , readOnly:false }, 
  { data: 'COD_BARRA_ART'  , title: 'Código de Barra', width : 55  , type:'numeric'        , className: 'htLeft'                 , readOnly:false },   
  { data: 'LARGO_M'        , title: 'Largo(M)'       , width : 40  , type:'numeric'        , requerido:true  , className: 'htLeft'                 , readOnly:false },   
  { data: 'ANCHO_M'        , title: 'Ancho(M)'       , width : 40  , type:'numeric'        , requerido:true  , className: 'htLeft'                 , readOnly:false },   
  { data: 'ALTO_M'         , title: 'Alto(M)'        , width : 40  , type:'numeric'        , requerido:true  , className: 'htLeft'                 , readOnly:false },   
  { data: 'IND_BASICO'     , title: 'Basica'         , width : 25  , className: 'htCenter' , type:'checkbox' , checkbox:['S','N'], readOnly:false }, 
]
const columnNavigationEnter = [1,2,3,4,5,6,7,8];

const STARTICU = memo(({form     , refGrid  , FormName     , idComp     , dataRef,
                        handleInputChange   , handleKeyDown, handleKeyUp, bloqueoArticulo,
                        handleCheckbox      , setfocusRowIndex, setLastFocusNext,setUpdateEdit}) => {
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[4, 2]}>

      <Main.Col span={16}>
        <Main.Row id={`form-cab-${FormName}`} gutter={[2, 2]}>

          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Articulo</label>}>
              <Main.Form.Item name="COD_ARTICULO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} ref={bloqueoArticulo} onKeyUp={handleKeyUp} />
              </Main.Form.Item>
              <Main.Form.Item name="DESCRIPCION" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}  className='requerido'  />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col  span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Proveedor</label>}>
              <Main.Form.Item name="COD_PROVEEDOR_DFLT" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className='requerido'  />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_PROVEEDOR" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col  span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Marca</label>}>
              <Main.Form.Item name="COD_MARCA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className='requerido'  />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_MARCA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col  span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Linea</label>}>
              <Main.Form.Item name="COD_LINEA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className='requerido'  />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_LINEA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>


          <Main.Col  span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Categoria</label>}>
              <Main.Form.Item name="COD_CATEGORIA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className='requerido'  />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_CATEGORIA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col  span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Rubro</label>}>
              <Main.Form.Item name="COD_RUBRO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className='requerido' />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_RUBRO" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col  span={17}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Grupo</label>}>
              <Main.Form.Item name="COD_GRUPO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp}  className='requerido' />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_GRUPO" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>
          
          <Main.Col  span={7}>
            <Main.Form.Item className='form-items' name="PROCESAR" type="text" label={<label style={{ marginLeft: '20px' }}>PROCESAR</label>} >
              <Main.Input 
              onKeyUp={handleKeyUp} 
              onKeyDown={handleKeyDown} 
              // ref={stateRef.bloqueoCliente} 
              className='search_input'  />
            </Main.Form.Item>
          </Main.Col>
      
          <Main.Col  span={12}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Iva</label>}>
              <Main.Form.Item name="COD_IVA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input  onKeyDown={handleKeyDown} onChange={handleInputChange}  className='requerido'/>
              </Main.Form.Item>
              <Main.Form.Item name="DESC_IVA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled />
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col  span={5} style={{marginLeft:'12px'}}>
            <Main.Form.Item name="MANEJA_COSTO"
                valuePropName="checked"
                onKeyDown={handleKeyDown}
                onChange={(e) => handleCheckbox(e, ["S", "N"])}
                >
                <Main.Checkbox> Maneja Costo  </Main.Checkbox>
            </Main.Form.Item>
          </Main.Col>

        </Main.Row>

        <Main.Col id={`form-det-${FormName}`} style={{marginTop:'12px'}} span={24}>
          <Main.HandsontableGrid
              refData={refGrid}
              columns={columns}
              FormName={FormName}
              idComp={idComp}// id del componente
              height={220}
              setfocusRowIndex={setfocusRowIndex}
              columnNavigationEnter={columnNavigationEnter}
              colorButtom={false}
              dataCabecera={dataRef}
              columnModal={columnModal}
              setLastFocusNext={setLastFocusNext}
              setUpdateEdit={setUpdateEdit}
            />
        </Main.Col>

      </Main.Col>
      
      <Main.Col  id={`form-cab-${FormName}`} span={7}>
        <Main.Fieldset
          anchoContenedor="100%"
          alineacionTitle="left"
          alineacionContenedor="left"
          margenTop="0px"
          tamañoTitle="15px"
          title="Costos Gs"
          contenedor={

            <Main.Row>
              <Main.Col span={24}>

                <Main.Form.Item name="COSTO_ULT_ANT_GS" label={<label style={{ width: '90px' }}>Ultimo Anterior</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
                <Main.Form.Item name="COSTO_PROM_ANT_GS" label={<label style={{ width: '90px' }}>Promedio Anterior</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
                <Main.Form.Item name="COSTO_ULTIMO_GS" label={<label style={{ width: '90px' }}>Ultimo</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
                <Main.Form.Item name="COSTO_PROM_GS" label={<label style={{ width: '90px' }}>Promedio</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
              
                <Main.Divider className={`${FormName}_Divider`} orientation="left">Costos U$S.</Main.Divider>
              
                <Main.Form.Item name="COSTO_ULT_ANT_US" label={<label style={{ width: '90px' }}>Ultimo Anterior</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
                <Main.Form.Item name="COSTO_PROM_ANT_US" label={<label style={{ width: '90px' }}>Promedio Anterior</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
                <Main.Form.Item name="COSTO_ULTIMO_US" label={<label style={{ width: '90px' }}>Ultimo</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
                <Main.Form.Item name="COSTO_PROM_US" label={<label style={{ width: '90px' }}>Promedio</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
              
                <Main.Divider className={`${FormName}_Divider`} orientation="left">Fechas de.</Main.Divider>
            
                <Main.Form.Item name="FEC_ULTIMA_COMP" label={<label style={{ width: '90px' }}>Última Compra</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
                <Main.Form.Item name="FEC_ULTIMA_VENTA" label={<label style={{ width: '90px' }}>Última Venta</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
              </Main.Col>
            </Main.Row>          
          }
              
        />
      </Main.Col>
      
      <Main.Col  id={`form-cab-${FormName}`} span={5}>
        <Main.Fieldset
          anchoContenedor="100%"
          alineacionTitle="left"
          alineacionContenedor="left"
          margenTop="0px"
          tamañoTitle="13px"
          title="Usuario"
          contenedor={

            <Main.Row>
              <Main.Col span={24}>
                <Main.Form.Item name="COD_USUARIO_ALTA">
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
              </Main.Col>
            </Main.Row>          
          }
              
        />
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

export default STARTICU;