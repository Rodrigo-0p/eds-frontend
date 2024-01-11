import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import STENSAL         from './view';
import './styles/STENSAL.css'

const FormName     = 'STENSAL';
const TituloList   = "Ajustes de Stock";
const idComp       = `GRID_${FormName}`


var id_cabecera    	  = '';
const set_id_cabecera = (e)=>{
  id_cabecera = e;
}
const get_id_cabecera = ()=>{
  return id_cabecera;
}
var indice = 0
const setIndice = (e) => {
  Main.setIndiceCabecera(e,idComp);
  indice = e
}
const getIndice = () => {
  return indice
}

// CANTIDAD DE REGISTRO POR GET
const data_len = 100;
var mitad_data    	 = data_len / 2;
const set_mitad_data = (e)=>{
  mitad_data = e;
}
// BANDERA
var bandPost_Cab_Det = true;


const MainST = memo(() => {

  const [form]              = Main.Form.useForm()
  const defaultOpenKeys     = Main.DireccionMenu(FormName);
  const defaultSelectedKeys = Main.Menu(FormName);
  const cod_empresa         = sessionStorage.cod_empresa;
  
  // USE REF
  const refData	            = React.useRef();
  const buttonSaveRef       = React.useRef();
  
  React.useEffect(()=>{
    // document.getElementById(`form-cab-${FormName}`)?.addEventListener('click', function (e){
    //   refAdd.current.bandNew = false //Focus Cabecera
    //   document.getElementById("total_registro").textContent = refCab.current.data.length;
    // });
    // document.getElementById(`form-det-${FormName}`)?.addEventListener('click', function (e){
    //   refAdd.current.bandNew = true //Focus detalle
    //   let resul = refData.current.hotInstance.getSourceData()
    //   document.getElementById("total_registro").textContent = resul.length;
    // });
    // setTimeout(()=>{
    //   if (!sessionStorage.getItem("hash")) {
    //     history.push({pathname:'/login'}) 
    //   }else{
    //     inicialForm()
    //   }
    // })
    // eslint-disable-next-line
  },[])

  Main.useHotkeys(Main.Guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});

  // -----------------------------------------------------------------------
  const guardar = ()=>{

  }
  const addRow = ()=>{

  }
  const deleteRow =()=>{

  }
  const funcionCancelar =()=>{

  }
  // -----------------------------------------------------------------------
  const funcionBuscar = (e)=>{
    // if(e){
    //   if(!refCab.current.activateCambio){
    //     Main.setModifico(FormName);        
    //     getDataCab(true);
    //   }else{
    //     Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,funcionCancelar)
    //   }
    // }else{
    //   manejaF7('DESCRIPCION')
    // };
    // Main.setBuscar(FormName,!e)
  }
  const NavigateArrow = (id) => {
    // Main.activarSpinner()
    // switch (id) {
    //   case 'left':
    //     leftData();  
    //     break;
    //   case 'right':
    //     rightData();
    //     break;
    //   case 'next-left':
    //     if(refCab.current.data.length > 1){setIndice(0);leftData();} 
    //     else Main.desactivarSpinner();
    //     break;
    //   case 'next-right':
    //     if(refCab.current.data.length > 1){
    //       let index =  refCab.current.data.length - 1
    //       setIndice(index);
    //       postQueryCab(refCab.current.data[index],false,index);
    //       document.getElementById("indice").textContent = refCab.current.data.length;
    //     }
    //     else Main.desactivarSpinner();
    //     break;
    //   default:
    //     break;
    // }  
  }

  return (
    <Main.Spin spinning={false} delay={500}>
      <Main.AntLayout defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys}>
        <Main.Paper className="paper-style">
          <div className="paper-header">
            <Main.Title level={4} className="title-color">
              {TituloList}<div level={5} style={{ float: 'right', marginTop: '10px', marginRight: '5px', fontSize: '10px' }} className="title-color">{FormName}</div>
            </Main.Title>
          </div>

          <Main.HeaderMenu
            AddForm={()=>addRow()}
            SaveForm={guardar}
            deleteRows={deleteRow}
            cancelar={funcionCancelar}
            formName={FormName}
            vprinf={false}
            refs={{ref:buttonSaveRef}}
            funcionBuscar={funcionBuscar}
            NavigateArrow={NavigateArrow}            
          />


          <STENSAL
            form={form}
            FormName={FormName}
          /> 
        </Main.Paper>  
      </Main.AntLayout>
    </Main.Spin>     
  );
});

export default MainST;