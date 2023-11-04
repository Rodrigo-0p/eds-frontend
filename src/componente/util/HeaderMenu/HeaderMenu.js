import React, { memo }   from 'react';
import { Button }        from 'antd';
import nuevo             from '../../../assets/icons/add.svg';
import deleteIcon        from '../../../assets/icons/delete.svg';
import guardarIcon       from '../../../assets/icons/diskette.svg';
import cancelarEdit      from '../../../assets/icons/iconsCancelar.svg';
import next_left         from '../../../assets/icons/iconsLeft.png';
import doble_next_left   from '../../../assets/icons/doubleLeft.png';
import doble_next_right  from '../../../assets/icons/doubleRight.png';
import next_right        from '../../../assets/icons/nextRight.png';
import printer           from '../../../assets/icons/printer.png';
import excel             from '../../../assets/icons/excel.svg';
import expotTxt          from '../../../assets/icons/txt.svg';
import iconBuscar        from '../../../assets/icons/iconsDetective.png';
import iconBinacular     from '../../../assets/icons/detective.png';
import atras             from '../../../assets/icons/logout.svg';
import Main              from '../main';

import Input             from '@mui/material/Input';
import InputAdornment    from '@mui/material/InputAdornment';
import SearchIcon        from '@mui/icons-material/Search';

import './headerMenu.css';

const HeaderMenu = memo(({AddForm, SaveForm , deleteRows    , cancelar     , 
                          NavigateArrow     , refs          , formName     ,
                          reporte           , funcionBuscar , 
                          buttonBuscar      , activateAtras , funcionAtras ,
                          excelfuncion      , addButton     , textfuncion  , 
                          search            , searchChange
                         }) => {
    

    const funcion_cancelar = async ()=>{
        cancelar()
    }
    let Permiso  = Main.VerificaPermiso(formName)

    return (
        <div className="paper-header-menu">
             {  AddForm
                 ?
                 <Button
                    icon={<img alt="add" src={nuevo} width="20"/>}         
                    className="paper-header-menu-button"
                    disabled={Permiso.insert === 'S' ? false : true}
                    onClick={AddForm}
                />
                : null
            }
            {
                SaveForm ?
                    <Button
                        icon={<img alt="save" src={guardarIcon} width="20" />}
                        className="paper-header-menu-button"
                        ref={refs.ref}
                        onClick={SaveForm}
                    />
                : null
            }
            {
                deleteRows ?
                <Button 
                    style={{marginRight:'3px'}}
                    icon={<img alt='delete' src={deleteIcon} width="20"/>}
                    className="paper-header-menu-button" 
                    disabled={Permiso.delete === 'S' ? false : true}
                    onClick={deleteRows}
                />
                : null 
            }
            {
                NavigateArrow ?
                <>
                    <Button
                    id="left-arrow"
                        icon={<img alt='left' src={doble_next_left} width="20"  id="left-arrow"/>}
                        className="paper-header-menu-button"
                        onClick={()=>NavigateArrow('next-left')}
                    />
                    <Button
                        id="left-arrow"
                        icon={<img alt='left-row' src={next_left} width="20"  id="left-arrow"/>}
                        className="paper-header-menu-button"
                        onClick={()=>NavigateArrow('left')}
                    />
                    <Button 
                        id="right-arrow"
                        icon={<img alt='right' src={next_right} width="20" id="right-arrow"/>}
                        className="paper-header-menu-button"
                        onClick={()=>NavigateArrow('right')}
                    />
                    <Button 
                        id="right-arrow"
                        icon={<img alt='right-arrow' src={doble_next_right} width="20" id="right-arrow"/>}
                        className="paper-header-menu-button"
                        onClick={()=>NavigateArrow('next-right')}
                    />
                </>
                :
                null
            }
            {
                funcionBuscar ?
                <>
                    <Button 
                        id="buscador-f7"
                         // eslint-disable-next-line
                        icon={<img src={iconBinacular} width="20" id="right-arrow"/>}
                        className={`paper-header-menu-button ${formName}_prepare_search`} 
                        onClick={()=>funcionBuscar(false)}
                    />
                    <Button 
                        id="buscador-f7"
                        // eslint-disable-next-line
                        icon={<img src={iconBuscar} width="20" id="right-arrow"/>}
                        className={`button-buscar-ocultar-visible paper-header-menu-button ${formName}_search`}                                     
                        onClick={()=>funcionBuscar(true)}
                    />                    
                </>
                : null
            }
                            
            {
                reporte ? 
                    <Button 
                        style={{marginLeft:'10px'}}
                        icon={<img alt='' src={printer} width="20" id="right-arrow"/>}
                        className="paper-header-menu-button" 
                        onClick={reporte}
                    />
                : null
            }
            {
                excelfuncion ?
                    <Button 
                        style={{marginLeft:'3px'}}
                        icon={<img alt='' src={excel} width="15px"/>} 
                        className="paper-header-menu-button"
                        onClick={excelfuncion}
                    />
                : null
            }
            {
                textfuncion ?
                    <Button 
                        style={{marginLeft:'3px'}}
                        icon={<img alt='' src={expotTxt} width="15px"/>} 
                        className="paper-header-menu-button"
                        onClick={textfuncion}
                    />
                : null
            }
            {
                activateAtras === false || activateAtras === undefined ? null : 
                <Button 
                    id="buscador-f7"
                    icon={<img alt='' src={atras} width="20" id="right-arrow"/>}
                    className="paper-header-menu-button" 
                    onClick={()=>funcionAtras(buttonBuscar)}
                />
            }
            <Button 
                style={{marginLeft:'10px'}}
                icon={<img alt='' src={cancelarEdit} width="19"/>}
                className={`${formName}-cancelar button-cancelar-ocultar-visible-grid paper-header-menu-button stylesCancelar`}
                onClick={funcion_cancelar}
            />
            {
                addButton ? addButton : null
            }

            {
                search ?
                    <Input
                        id="searchInputArticulo"
                        autoComplete="off"
                        onKeyDown={searchChange}                        
                        style={{marginRight: '10px', float: 'right'}}
                        startAdornment={
                            <InputAdornment position="start" >
                                <SearchIcon />
                            </InputAdornment>
                        }
                    />

               : null
            }
      </div>
    );
});

export default HeaderMenu;