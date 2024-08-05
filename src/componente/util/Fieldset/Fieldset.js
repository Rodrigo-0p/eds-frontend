import React, { memo } from 'react'
import './fieldset.css'

export default memo(function ContainerText(props) {
    return (
        <>
            <div className="contenedor" style={{marginTop:props.margenTop, width:props.anchoContenedor,marginLeft:props.marginLeft}}>
                <fieldset className="scheduler-border" style={{textAlign:props.alineacionContenedor,padding:props.padding ? props.padding : '0 1.4em 0.4em 1.4em'}} >
                    <legend className="scheduler-border" style={{textAlign:props.alineacionTitle,fontSize:props.tamañoTitle}}>
                        {props.title}
                    </legend>
                        <span>
                            {props.contenedor}
                        </span>
                </fieldset>
            </div>
        </>
    )
})