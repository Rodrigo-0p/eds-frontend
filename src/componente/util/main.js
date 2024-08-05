import _ 														 from 'underscore'
import { Request,RequestImg } 			 from '../../config/request';
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
import currency											 from "currency.js"
import {  modifico, setModifico 	}  from './ButtonCancelar/cancelar'
import 	  FormModalSearch 					 from './ModalForm/FormModalSearch';
import 	  ModalHadsontable					 from './ModalForm/ModalHadsontable';
import {  VerificaPermiso,
				  getPermisosEspecial			}	 from './verificarPermisos/verificaPermiso'
import    moment										 from 'moment'
import    validarCamposRequeridos,
			 {  quitarClaseRequerido		}	 from './campoRequerido/mainCampRequerido'
import {  useHotkeys 							}  from 'react-hotkeys-hook';
import NumberFormat 								 from "react-number-format";
import {  GeneraUpdateInsertCab
		  	, GeneraUpdateInsertDet 	}  from './generaInsertUpdate/mainGeneraUpdateInsert';	
import {  activarSpinner 
	      , desactivarSpinner				}  from './sppiner';
import ProgressBar                   from "@ramonak/react-progress-bar";
import { setBuscar,getViewBuscar	}  from './HeaderMenu/iconButtonBuscar';
import Fieldset                      from './Fieldset/Fieldset';
import dayjs 												 from 'dayjs';
import ImgCrop              				 from 'antd-img-crop';
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
	message		, Spin	    , Row	    , Col	   ,
	Form			, Card	    , Input   , Button ,
	Modal			, Divider   , Radio   , Select ,
	Checkbox	, List 		  , Tooltip	, Tabs 	 , 
	Typography, DatePicker,	ConfigProvider	 ,
	Dropdown	, Space			, Avatar	, Image	 ,
	Upload} from 'antd';
import locale	 		  			  			       	from 'antd/lib/locale/es_ES';
import {NumerosALetras} 		from './numerosALetras';

const { TabPane } = Tabs;
const { Title } = Typography;


const mayuscula = (e) => {
	e.target.value = ("" + e.target.value).toUpperCase();
};

const alert = (content = '',titulo = '',  type = 'info', desc_ok = 'Aceptar', desc_cancel = 'Cancelat', funcionAceptar = false , funcionCancelar= false,FormName = '') => {
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
			okButtonProps:{className:`${FormName}_alert`},
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

const soloNumero = (e) =>{
	var key = window.event ? e.which : e.keyCode;
	if (key < 48 || key > 57) e.preventDefault();
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
const numerico = (valor, decimales = null)=>{
	if (typeof valor === 'string') {	
		// Redondear el valor y convertirlo a cadena
		let result = Math.round(valor).toString();
		// eslint-disable-next-line
		if(result === "NaN") valor = valor;
		
		// Eliminar puntos y reemplazar comas por puntos
		valor = valor.split('.').join('');
		valor = valor.split(',').join('.');
	
		// Convertir la cadena a un número
		let numero = Number(valor.replace(/[^0-9.]/g, ""));
	
		// Verificar si el resultado de parseFloat es un número válido
		if (!isNaN(numero)) {
			// Redondear a la cantidad de decimales especificada (si se proporciona)
			if (decimales !== null) {
				numero = parseFloat(numero.toFixed(decimales));
			}
			return numero;
		} else {
			return null;
		}
	} else {
		return valor; 
	}	
}
const numerico_grilla = (valor, decimales = 0)=>{
	// Verificar si el valor es una cadena y contiene puntos
if (typeof valor === 'string') {
		// Eliminar comas
		valor = valor.replace(/,/g, '');
		valor = valor.includes('.') ? (decimales === 0 || decimales === "0") ? parseFloat(valor) : parseFloat(valor).toFixed(decimales) : valor
		// Convertir la cadena a un número
		let numero = typeof valor === 'string' ? Number(valor.replace(/[^0-9,]/g, '')) : valor;
	
		if (!isNaN(numero)) {				
				return numero;
		} else {
				return null;
		}
	} else {
		let numero = (decimales === 0 || decimales === "0") ? parseFloat(valor) : parseFloat(valor).toFixed(decimales);
		numero = typeof numero === 'string' ? Number(numero.replace(/[^0-9,]/g, '')) : numero;
		if (!isNaN(numero)) {				
				return numero;
		} else {
				return null;
		}
	}
} 
// BLOQUEO Y DESBLOQUEO DE FECHA
const setBloqueoFecha = (className,valor)=>{
	
	let inputDate = document?.getElementsByClassName(`${className}`)[0]?.querySelector('input')
	inputDate.disabled = valor
	let inputDate2 = document?.getElementsByClassName(`${className}`)[0]	

	if(inputDate2.querySelectorAll('span')[2]){
		if(valor){
			inputDate2.querySelectorAll('span')[2].style.visibility = 'collapse'
		}else{
			inputDate2.querySelectorAll('span')[2].style.visibility = 'visible'		
		}
	}
}
const openStart = (className,indice = 0)=>{
	let valor = getBloqueoFecha(className)
	if(!valor){
		if(document.getElementsByClassName('ant-picker-dropdown')[indice])document.getElementsByClassName('ant-picker-dropdown')[indice].style.visibility = 'visible';
	}else{
		setTimeout(()=>{
			if(document.getElementsByClassName('ant-picker-dropdown')[indice])document.getElementsByClassName('ant-picker-dropdown')[indice].style.visibility = 'collapse';
		})
	}
}
const getBloqueoFecha = (className)=>{
	let inputDate = document?.getElementsByClassName(`${className}`)[0]?.querySelector('input')
	return inputDate?.disabled
}
// BLOQUEO DE RADIO
const setBloqueoRadio = (className,p_bloqueo)=>{
	let inputBloqueo = document?.getElementsByClassName(`${className}`)[0]
	if(inputBloqueo.querySelectorAll('input')){
		for (let i = 0; i < inputBloqueo.querySelectorAll('input').length; i++) {
			inputBloqueo.querySelectorAll('input')[i].disabled = p_bloqueo;
		}
	}
}
const format_N = (date_time) => {
	let DateUtc = moment.utc(date_time);    
	return DateUtc.format('DD/MM/YYYY');
}

const getData = async (data, url) => {
	try {
		let params = await data;
		return await Request(url, "POST", params).then(resp => { return resp.data.rows });
	} catch (error) {
		console.log(error);
		return [];
	}
};

const onKeyDownBloqueo = (e)=>{e.preventDefault()}

const nvl = (value, defaultValue)=> {
	return (value !== null && value !== undefined && value !== "") ? value : defaultValue;
}

const round = (number, decimals)=>{
	let factor = Math.pow(10, decimals);
	return Math.round(number * factor) / factor;
}

const ajustarTexto = (rectWidth, fontSize, texto) => {
  const charWidth = 0.6 * fontSize; // Este valor es aproximado y puede variar según la fuente
  // Calcula el número máximo de caracteres que caben en el ancho del rectángulo
  const maxChars = Math.floor(rectWidth / charWidth);
  if (texto.length > maxChars) {
    texto = texto.substring(0, maxChars - 3) + "...";
  }
  return texto;
}

var Guardar = 'f10';

const Igmpredefault = "data:image/png;base64,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"

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    // reader.onerror = error => reject(error);
  });
}


const Main = {
	 Guardar	
	, _
	, mayuscula
	, Request
	, RequestImg
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
	, Fieldset
	, soloNumero
	, NumberFormat
	, numerico
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
	, Tooltip
	, Tabs
	, TabPane
	, DatePicker
	,	ConfigProvider
	, locale
	, Dropdown
	, Space
	, Avatar
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
	, currency
	, setBloqueoFecha
	, getBloqueoFecha
	, format_N
	, openStart
	, setBloqueoRadio
	, dayjs
	, getData
	, onKeyDownBloqueo
	, numerico_grilla
	, nvl
	, round
	, ajustarTexto
	, NumerosALetras
	, Image
	, getBase64
	, Igmpredefault
	, ImgCrop
	, Upload
}


export default Main;