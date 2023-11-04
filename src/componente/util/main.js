import _ 														 from 'underscore'
import { Request } 									 from '../../config/request';
import axios 										  	 from 'axios';
import AntLayout 										 from "./antLayout";
import Helmet 											 from 'react-helmet';
import { DireccionMenu, Menu} 			 from './FocusMenu/FocusMenu'
import HeaderMenu 									 from './HeaderMenu/HeaderMenu';
import Paper 												 from '@mui/material/Paper'
import info           				  		 from '../../assets/icons/icon-advertencia.png';
import error           			     		 from '../../assets/icons/error.svg';
import confirmar 								  	 from '../../assets/icons/icon-Exclamacion.png';
import alerta          					  	 from '../../assets/icons/advertencia.svg';
import { v4 as uuidID } 			 			 from "uuid";

import {  Typography } 				    	 from 'antd'
import {  modifico, setModifico 	}  from './ButtonCancelar/cancelar'
import 	  FormModalSearch 					 from './ModalForm/FormModalSearch';
import 	  ModalHadsontable					 from './ModalForm/ModalHadsontable';
import {  VerificaPermiso,
				  getPermisosEspecial			}	 from './verificarPermisos/verificaPermiso'
import    moment										 from 'moment'
import    validarCamposRequeridos,
			 {  quitarClaseRequerido		}	 from './campoRequerido/mainCampRequerido'
import {  useHotkeys 							}  from 'react-hotkeys-hook';
import {  GeneraUpdateInsertCab
		  	, GeneraUpdateInsertDet 	}  from './generaInsertUpdate/mainGeneraUpdateInsert';	
import {  activarSpinner 
	      , desactivarSpinner				}  from './sppiner';
import ProgressBar                   from "@ramonak/react-progress-bar";
import { setBuscar,getViewBuscar	}  from './HeaderMenu/iconButtonBuscar';
// Handsontable
import HandsontableGrid,{	
		   g_getRowFocus  , setFocusedRowIndex
		, setEventGlobal	, eventGlobal
		, banScroll 		  , setBanScroll
		, newArrayPushHedSeled , newSetArrayHedSeled   
		, setIndiceCabecera    , setCambiosPendiente 
		, getCambiosPendiente  , limpiar_CambiosPendiente} 	
																		from './handsontable/Handsontable';
// eslint-disable-next-line
import { hotTableRequerido } 			  from './handsontable/hotTableRequerido';
// FORM 1
import {
	message	, Spin	  , Row	  , Col	   ,
	Form		, Card	  , Input , Button ,
	Modal		, Divider , Radio , Select ,
	Checkbox, List } from 'antd';

const { Title } = Typography;


const mayuscula = (e) => {
	e.target.value = ("" + e.target.value).toUpperCase();
};

const alert = (content = '',titulo = '',  type = 'info', desc_ok = 'Aceptar', desc_cancel = 'Cancelat', funcionAceptar = false , funcionCancelar= false) => {
	setTimeout(()=>{
		Modal[type === 'alert' ? 'info' : type]({
			title:<div className='titleModal'>{titulo}</div>,
			icon: <img alt='' src={ type === 'info' ? info : type === 'alert' ? alerta : type === 'error' ? error : confirmar } width="25" style={{float:'left',margin:"0px 15px 0px 0px"}}/>,
			content: content,
			okText: desc_ok,
			style : {marginTop: '15vh'},		
			okType: 'primary',
			onOk(){ 
				if(funcionAceptar) funcionAceptar()
				else Modal.destroyAll() 
			},
			
			cancelText:desc_cancel,
			onCancel() {
				if(funcionCancelar) funcionCancelar()
				else Modal.destroyAll()}
		})
	})	
}

const format_h = (date_time) => {
	let DateUtc = moment.utc(date_time);    
	return DateUtc.format('DD/MM/YYYY HH:mm:ss');
}


var interval = 0
const clearLoadingProgressBar = (idComp) => {        
    let content = document.getElementsByClassName(`${idComp}-ProgressBar-content`)
    
    let process = document.getElementsByClassName('ProgressBar-completed')
    let span    = process[0].querySelector('span')
    process[0].classList.add(`${idComp}-stopProgressBar`)
    process[0].style.width      = `0%`
    span.innerHTML              = `0%`

    setTimeout(()=>{       
        content[0].style.position   = 'fixed'
        content[0].style.visibility = 'hidden'
        process[0].style.width      = `0%`
        clearInterval(interval); 
    },90);
};
const errorLoadingProgressBar = (idComp, color = '#882a2a', mensaje = 'Error inesperado') => {
    clearInterval(interval);   
    let process = document.getElementsByClassName(`${idComp}-ProgressBar-completed`)
    let span    = process[0].querySelector('span')
    process[0].classList.add(`${idComp}-stopProgressBar`)
    process[0].style.background = color
    process[0].style.width      = `${(mensaje.length / 2) + 5}%`
    span.innerHTML              = `${mensaje}`  
    
};
const stopLoadingProgressBar = (idComp, colorFinal = '#4a9353', mensaje = '100%') => {
    clearInterval(interval);  
    let content = document.getElementsByClassName(`${idComp}-ProgressBar-content`)
    let process = document.getElementsByClassName(`${idComp}-ProgressBar-completed`)
    let span    = process[0].querySelector('span')

    process[0].style.background = colorFinal
    process[0].style.width      = `100%`
    span.innerHTML              = `${mensaje}`  
  
    setTimeout(()=>{   
        if(!process[0].classList.value.includes(`${idComp}-stopProgressBar`)){
            content[0].style.position   = 'fixed'
            content[0].style.visibility = 'hidden'
            process[0].style.width      = `0%`
        }
    },1200);
};
const startLoadingProgressBar = (idComp, colorCarga = '#5a6978',tiempo = 1000) => {
    
    let content = document.getElementsByClassName(`${idComp}-ProgressBar-content`)
    content[0].style.position   = 'inherit'
    content[0].style.visibility = 'visible'

    let process = document.getElementsByClassName(`${idComp}-ProgressBar-completed`)
    process[0].classList.remove(`${idComp}-stopProgressBar`)
    let span            = process[0].querySelector('span')
    let currentProgress = 0;
    process[0].style.background = colorCarga
    interval = setInterval(() => {
        if(!process[0].classList.value.includes(`${idComp}-stopProgressBar`)){
            currentProgress += 10;
            if (currentProgress >= 90) {  
                clearInterval(interval);   
            }      
            process[0].style.width = `${currentProgress}%`
            span.innerHTML         = `${currentProgress}%`
        }else{
          clearInterval(interval);   
        }
    },tiempo); 
};

const ProgressBarMain = (props)=>{
    return(
        <ProgressBar {...props} 
           completed={0} 
           animateOnRender={true} 
           completedClassName={`${props.idComp}-ProgressBar-completed ProgressBar-completed`}
           className={`${props.idComp}-ProgressBar-content ProgressBar-content`}
        />
    )
}

var Guardar = 'f10';

const Main = {
	 Guardar	
	, _
	, mayuscula
	, Request
	, axios
	, activarSpinner
	, desactivarSpinner
	, Helmet
	, DireccionMenu
	, Menu
	, AntLayout
	, HeaderMenu
	, Paper
	, Title
	, modifico
	, setModifico
	, VerificaPermiso
	, getPermisosEspecial
	, uuidID
	, format_h
	, moment
	, quitarClaseRequerido
	, validarCamposRequeridos
	, useHotkeys
	, GeneraUpdateInsertCab
	, GeneraUpdateInsertDet
	, setBuscar
	, getViewBuscar
	// ANT
	, Spin
	, message
	, Row
	, Col
	, Form
	, Card
	, Input
	, Button
	, Modal
	, Radio
	, Divider
	, Select
	, Checkbox
	, List
	//----------------   
	, ProgressBarMain
	, startLoadingProgressBar
	, stopLoadingProgressBar
	, clearLoadingProgressBar
	, errorLoadingProgressBar
	// --
	, alert
	, FormModalSearch
	, ModalHadsontable
	// --------------------
	, HandsontableGrid
	, g_getRowFocus 
	, setFocusedRowIndex
  , setEventGlobal	
	, eventGlobal
	, banScroll
  , setBanScroll
	, newArrayPushHedSeled
	, newSetArrayHedSeled   
	, setIndiceCabecera
	, setCambiosPendiente
	, getCambiosPendiente
	, limpiar_CambiosPendiente
	, hotTableRequerido
}


export default Main;