import React, { memo } from 'react';
import Main            from '../../../../../../componente/util/main';
import mainUrl         from './url/mainUrl';
import './VTLISPRE';

const columnModal = {
  urlValidar : [{ COD_ARTICULO      : mainUrl.url_valida_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_valida_um,
                }],
  urlBuscador: [{ COD_ARTICULO      : mainUrl.url_buscar_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_buscar_um,
                }],
  title      : [{ COD_ARTICULO      : "Articulo",
                  COD_UNIDAD_MEDIDA : "Unidad Medida"   ,
                }],
  COD_UNIDAD_MEDIDA: [
    { data: 'COD_UNIDAD_MEDIDA'  , title: 'Código'      ,className:'htLeft'  },
    { data: 'DESC_UNIDAD_MEDIDA' , title: 'Descripción' ,className:'htLeft' 	},
  ],
  COD_ARTICULO: [
    { data: 'COD_ARTICULO' , title: 'Código'       ,className:'htLeft'  },
    { data: 'DESC_ARTICULO', title: 'Descripción'  ,className:'htLeft'  },
  ],
  config:{    
    COD_UNIDAD_MEDIDA:{
      depende_de:[{id: 'COD_ARTICULO' ,label: 'Articulo'}],
      dependencia_de:[],
      depende_ex_cab:[],
    },
  }
};

export const columns = [
  { data: 'COD_ARTICULO'      , title: 'Articulo'     , width : 20  , className: 'htLeft'   , requerido:true   , filter:true   }, 
  { data: 'DESC_ARTICULO'     , title: 'Descripcion'  , width : 100 , readOnly:true         , requerido:false  , filter:true    , textWrap:true}, 
  { data: 'COD_UNIDAD_MEDIDA' , title: 'Unidad Medida', width : 35  , className: 'htLeft'   , requerido:true   , readOnly:false}, 
  { data: 'DESC_UNIDAD_MEDIDA', title: 'Descripcion'  , width : 100 , readOnly:true         , requerido:false  , filter:false  }, 
  { data: 'FEC_VIGENCIA'      , title: 'Fecha'        , width : 30  , className: 'htLeft '  , readOnly:false   , type:'date'    , hora:true},
  { data: 'PRECIO_FIJO'       , title: 'Precio Venta' , width : 20  , className: 'htRight'  , requerido:true   , type:'numeric' , format:{pattern: '0,0.00'}}, 
]
const columnNavigationEnter = [0,2,3,4,5];

const STLISPRE = memo(({ form            , refGrid        , FormName   , idComp          , handleKeyDown   , handleKeyUp      , 
                        handleInputChange, handleCheckbox , dataRef    , setfocusRowIndex, setLastFocusNext, bloqueoListPrecio,
                        bloqueoMoneda  }) => {
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row id={`form-cab-${FormName}`}>
        <Main.Col span={24}>
          <Main.Row>
            <Main.Col span={4}/>
            <Main.Col span={16}>
              <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Listado de Precio</label>}>
                <Main.Form.Item name="COD_LISTA_PRECIO" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} ref={bloqueoListPrecio} onKeyUp={handleKeyUp} />
                </Main.Form.Item>
                <Main.Form.Item name="DESCRIPCION" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                    <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} onKeyUp={handleKeyUp} className='requerido' />
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>
            <Main.Col span={4}/>
            <Main.Col span={4}/>
            <Main.Col span={10}>
              <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Moneda</label>}>
                <Main.Form.Item name="COD_MONEDA" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} className='requerido' ref={bloqueoMoneda}/>
                </Main.Form.Item>
                <Main.Form.Item name="DESC_MONEDA" style={{ width: 'calc(100% - 95px)', display: 'inline-block' }}>
                    <Main.Input disabled />
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>
            <Main.Col span={4}>
              <Main.Form.Item name="TIP_CAMBIO" label={<label style={{ width: '62px' }}>Tipo Cambio</label>}>
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
            <Main.Col span={5} style={{marginLeft:'15px'}}>
              <Main.Form.Item name="ESTADO"
                  valuePropName="checked"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleCheckbox(e, ["A", "I"])}
                  >
                  <Main.Checkbox>¿Activo?</Main.Checkbox>
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
            height={420}
            setfocusRowIndex={setfocusRowIndex}
            columnNavigationEnter={columnNavigationEnter}
            colorButtom={false}
            dataCabecera={dataRef}
            columnModal={columnModal}
            setLastFocusNext={setLastFocusNext}
            // setUpdateEdit={setUpdateEdit}
          />      
        </Main.Col>
        <Main.Col id={`form-cab-${FormName}`} span={14}/>

        <Main.Col id={`form-cab-${FormName}`} span={6}>
          <Main.Form.Item name="FEC_MODI" label={<label style={{ width: '112px' }}>Fecha de Actualización</label>} >
            <Main.Input className="search_input" disabled />
          </Main.Form.Item>
        </Main.Col>

        <Main.Col id={`form-cab-${FormName}`} span={4}>
          <Main.Form.Item name="COD_MODI" label={<label style={{ width: '45px' }}>Usuario</label>} >
            <Main.Input className="search_input" disabled />
          </Main.Form.Item>
        </Main.Col>
        
        <Main.Col id={`form-cab-${FormName}`} span={24} style={{ position: '',margenTop:'42px' , bottom:'5px', width: '80%', fontSize:'12px' }} >
          <div className='total_registro_pg'>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>

      </Main.Row>
    </Main.Form>
  );
});

export default STLISPRE;