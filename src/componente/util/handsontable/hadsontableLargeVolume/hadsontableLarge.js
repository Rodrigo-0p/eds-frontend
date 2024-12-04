import React, { memo } from 'react';
import { HotTable, HotColumn } from '@handsontable/react';
import '../handsontable.css';
import iconDelete              from '../../../../assets/icons/delete.svg';
import iconsBinoculars         from '../../../../assets/icons/icons-binoculars.svg';
import iconsDescarga           from '../../../../assets/icons/icons-downloads-folder.png'
import iconsReport             from '../../../../assets/icons/printer.png';
import iconsRefresh            from '../../../../assets/icons/icons-refresh.svg';
import _                       from 'underscore';
import Handsontable            from 'handsontable' // No eliminar
import numbro                  from 'numbro';
import deDE                    from 'numbro/languages/de-DE';


const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const diasSemanaCorto = ["Dom", "Lun", "Mar", "Mier", "Juev", "Vier", "Sab"];
numbro.registerLanguage(deDE);

class KeyValueListEditor extends Handsontable.editors.HandsontableEditor {
  prepare(row, col, prop, td, value, cellProperties) {
    super.prepare(row, col, prop, td, value, cellProperties);

    Object.assign(this.htOptions, {
      licenseKey: 'non-commercial-and-evaluation',
      data: this.cellProperties.source,
      className:'handsontable_opcion',
      columns: [
        { data: 'id'   },
        { data: 'label' , type:'autocomplete'},
      ],
      hiddenColumns: {
        columns: [1],
      },
      colWidths: (cellProperties.width + cellProperties.width) - 40,
      beforeValueRender(value, { row, instance }) {
        return instance.getDataAtRowProp(row, 'label');
      },
    });

    if (cellProperties.keyValueListCells) {
      this.htOptions.cells = cellProperties.keyValueListCells;
    }
    if (this.htEditor) {
      this.htEditor.destroy();
    }

    this.htEditor = new Handsontable(this.htContainer, this.htOptions);
  }
  
  setValue(value) {
    if (this.htEditor) {
      const index = this.htEditor.getDataAtProp('id').findIndex(id => id === value);

      if (index !== -1) {
        value = this.htEditor.getDataAtRowProp(index, 'label');
      }
    }
    super.setValue(value);
  }
  
  getValue() {
    const value = super.getValue();

    if (this.htEditor) {
      const labels = this.htEditor.getDataAtProp('label');
      const row = labels.indexOf(value);

      if (row !== -1) {
        return this.htEditor.getDataAtRowProp(row, 'id');
      }
    }

    return value;
  }
}
const keyValueListValidator = function(value, callback) {
  let valueToValidate = value;

  if (valueToValidate === null || valueToValidate === void 0) {
    valueToValidate = '';
  }

  if (this.allowEmpty && valueToValidate === '') {
    callback(true);
  } else {
    callback(this.source.find(({ id }) => id === value) ? true : false);
  }
};
const keyValueListRenderer = function(hot, TD, row, col, prop, value, cellProperties) {
  const item = cellProperties.source.find(({ id }) => id === value);
  
  if (item) {
    value = item.label;
  }
  
  Handsontable.renderers.getRenderer('autocomplete').call(hot, hot, TD, row, col, prop, value, cellProperties);
};

const HandsontableLarge = memo((props) => {

  const currentColumn = React.useRef({index:0})

  const acciontButton =  React.useCallback((row,col)=>{
    let rowValue = props.hotRef.current.__hotInstance.getSourceDataAtRow(row)
    if(props.buttomAccion){      
      props.buttomAccion(rowValue,row,col,props.idComp);
    }
  },[]);
  const customRenderer = (instance, TD, row, col, icon) => {
    const buttonIcon = TD.querySelector('button') || document.createElement('button');
    buttonIcon.className = `${props.columns[col].data}${props.idComp}`;
    buttonIcon.id = "button_iconsBinoculars";
    const rowIndex = props.hotRef.current.hotInstance.toPhysicalRow(row);
    buttonIcon.onclick = () => acciontButton(rowIndex, col);
    buttonIcon.innerHTML = `<img src=${icon == 'BI' ? iconsBinoculars : 
                                       icon == 'IM' ? iconsReport     : 
                                       icon == 'DE' ? iconsDescarga   :
                                       icon == 'BO' ? iconDelete      : 
                                       icon == 'RE' ? iconsRefresh    : ''
                                      } className="img-icon bi-${props.idComp}" width="18px" id="right-arrow"/>`;
    TD.appendChild(buttonIcon);
  };

  const handleAfterSelection = ( row, col) => {
    if(props.hotRef){
      const indiceFilaFuenteDeDatos = props.hotRef.current.hotInstance.toPhysicalRow(row !== -1 ? row : 0);
      const valor = props.hotRef.current.hotInstance.getSourceDataAtRow(indiceFilaFuenteDeDatos);
      if(props.setfocusRowIndex)props.setfocusRowIndex(valor,row,col,false);    
    }
  };
  const getHeaderAlignment = (col,TH) => {
    if(TH.colSpan > 1) TH.classList.add(`HEADER_${props.idComp}_${props.columns[col].data}`)
      switch (props.columns[col]?.className) {
      case "htLeft":
        return 'left';
      case "htCenter":
        return 'center';
      case "htRight":
        return 'right';
      default:
        return 'left';
    }
  };
  const removeColumnMenuButton = (col, TH) => {
    if (!props.columns[col].filter) {
      const button = TH.querySelector('.changeType');
      button && button.parentElement.removeChild(button);
    }

    if (['numeric', 'htRight'].includes(props.columns[col].type)) {
      const button = TH.querySelector('span');
      button && button.classList.add('withStyles');
    }
  };
  const customAfterGetColHeader = (col, TH) => {
    TH.style.textAlign = getHeaderAlignment(col,TH);
    removeColumnMenuButton(col, TH);
  };
  const beforeKeyDown = React.useCallback((event) => {
    if(props.modalClick){
      const buttonElement = document.querySelector('.modal-ok_'+props.FormName);
      if (buttonElement && [13,9].includes(event.keyCode)) {
        buttonElement.click(); // Enfocar el botón del modal
        return
      }
    }
    if (props.onCellKeyDown) props.onCellKeyDown(event);
    if (props.navigationIndexes && props.navigationIndexes.length > 0) {
      if (event.keyCode === 13 || event.keyCode === 9){
        const hotInstance = props.hotRef?.current?.hotInstance;
        const selected    = hotInstance?.getSelected() ? hotInstance?.getSelected()[0] : false;
        event.preventDefault();
        if(selected)navegacion(event,selected[0],selected[1]);
      } 
    }
    const { key } = event;
    if (key === ' ') {
      const selection = props.hotRef.current.hotInstance.getSelected();
      if(selection){
        const [startRow, startColumn] = selection[0];
        const cellMeta = props.hotRef.current.hotInstance.getCellMeta(startRow, startColumn);
        if (props.columns[cellMeta.visualCol] &&  props.hotRef && props.columns[cellMeta.visualCol].type === 'radio') {
          // console.log(cellMeta);
          let opcionName = props.columns[cellMeta.visualCol].id_valor
          let values     = props.columns[cellMeta.visualCol].valor
          props.hotRef.current.hotInstance.view.settings.data[cellMeta.visualRow][opcionName] = values
          props.hotRef.current.hotInstance.setDataAtRowProp(cellMeta.visualRow,cellMeta.visualCol,values);
          props.hotRef.current.hotInstance.updateSettings({
            cellRow:cellMeta.visualRow,
          },);
        }
      } 
    }
    const selected   = props.hotRef?.current?.hotInstance?.getSelected() ? props.hotRef?.current?.hotInstance?.getSelected()[0] : [0,0,0,0];
    setTimeout(()=>{
      let activeEditor = props.hotRef.current.hotInstance?.getActiveEditor();
      if((activeEditor && activeEditor.isOpened()) > 0 && props.columns[selected[1]]?.upper){
        if(!event.target.classList.value.includes('handsontable-upper')){
          event.target.classList.add('handsontable-upper');              
        }
        setTimeout(()=>event.target.value = event.target.value.toLocaleUpperCase())
      }else{
        if(event.target.classList.value.includes('handsontable-upper')) event.target.classList.remove('handsontable-upper');
      }
    })
  }, [props.onCellKeyDown]);
  const navegacion = (e, rowIndex, columnIndex) => {
    if (props.navigationIndexes && props.navigationIndexes.length > 0) {
      const hotInstance = props.hotRef?.current?.hotInstance;
      // const totalColumns = hotInstance.countCols();
      const totalRows = hotInstance.countRows();
      const currentColumnIndex = props.navigationIndexes.indexOf(columnIndex);
  
      let newIndex;
  
      if (e.key === 'Enter' && e.shiftKey) {
        // Flecha izquierda
        newIndex = (currentColumnIndex - 1 + props.navigationIndexes.length) % props.navigationIndexes.length;
        rowIndex = newIndex < currentColumnIndex ? rowIndex - 1 : rowIndex;
      } else if (e.keyCode === 13 || e.keyCode === 9) {
        // Flecha derecha
        newIndex = (currentColumnIndex + 1) % props.navigationIndexes.length;
        rowIndex = newIndex < currentColumnIndex ? rowIndex + 1 : rowIndex;
      }
  
      // Verificar si la nueva fila es válida
      if (rowIndex < 0) {
        rowIndex = 0;
      } else if (rowIndex >= totalRows) {
        rowIndex = totalRows - 1;
      }

      // Verificar si la nueva columna es editable
      while (props.navigationIndexes.indexOf(props.navigationIndexes[newIndex]) === -1) {
        if (e.key === 'Enter' && e.shiftKey) {
          // Flecha izquierda
          newIndex = (newIndex - 1 + props.navigationIndexes.length) % props.navigationIndexes.length;
          rowIndex = newIndex < currentColumnIndex ? rowIndex - 1 : rowIndex;
        } else if (e.keyCode === 13 || e.keyCode === 9) {
          // Flecha derecha
          newIndex = (newIndex + 1) % props.navigationIndexes.length;
          rowIndex = newIndex < currentColumnIndex ? rowIndex + 1 : rowIndex;
        }
  
        if (rowIndex < 0) {
          rowIndex = 0;
        }
      }

      e.stopImmediatePropagation();      
      currentColumn.current.index = newIndex
      // Cambiar la celda seleccionada
      if(props.refhasontable){
        if(props.refhasontable?.current?.stopFoscus) props.refhasontable.current.stopFoscus = false
        else hotInstance?.selectCell(rowIndex, props.navigationIndexes[newIndex]);
      }else hotInstance?.selectCell(rowIndex, props.navigationIndexes[newIndex]);      
    }
  };
  const isValidDate = (dateString)=> {
    let valor = {isDate:false,date:''}

    const dateRegex = /^(\d{2})(\/)?(\d{2})\2(\d{4})$/;
    if (!dateRegex.test(dateString)) {
      return valor;
    }
  
    const [, day, , month, year] = dateString.match(dateRegex);
  
    const dateObject = new Date(`${year}-${month}-${day}T00:00:00`);
    
    
    if( dateObject.getDate()     === parseInt(day, 10)       &&
        dateObject.getMonth()    === parseInt(month, 10) - 1 &&
        dateObject.getFullYear() === parseInt(year, 10)){
  
      let date     = `${day}/${month}/${year}`
      valor.date   = date;     
      valor.isDate = true
    }
  
    return valor
  }
  const onBeforeChange = React.useCallback((changes,source) => {
    for (let i = 0; i < changes.length; i++) {
      const [row, prop, oldVal, newVal] = changes[i];
      let columnIndex = props.hotRef?.current?.hotInstance.propToCol(prop)
      if (props.columns[columnIndex] && props.columns[columnIndex].type === 'numeric' && _.isNumber(newVal)) {
        // Rechazar el cambio si el nuevo valor no es numérico
        if(newVal !== "") return false;
      }else if(props.columns[columnIndex] && props.columns[columnIndex].type == 'date'){
        let valor = isValidDate(newVal)
        if(valor.isDate){
          changes[i][3] = valor.date;
        }else{
          return valor.date
        }        
      }else if(props.columns[columnIndex] && props.columns[columnIndex].type == 'select'){
        const item = props.columns[columnIndex].options.find(({ id }) => id === newVal);
        if(!item) return false
      }
    }
    
    if(props.handlechangeDet)props.handlechangeDet(changes,props.id);
  },[props.handlechangeDet])

  const handleCellClick = React.useCallback((event, coords, td)=>{
    try {
      if(props.setClickCell)props.setClickCell(props.id,coords);

      const selection = props.hotRef.current.hotInstance.getSelected();
      const [startRow, startColumn] = selection[0];      
      if(startRow !== -1){
        const cellMeta = props.hotRef.current.hotInstance.getCellMeta(startRow, startColumn);
        if (props.columns[cellMeta.visualCol] &&  props.hotRef && props.columns[cellMeta.visualCol].type === 'radio') {      
          let opcionName = props.columns[cellMeta.visualCol].id_valor
          let values     = props.columns[cellMeta.visualCol].valor
          props.hotRef.current.hotInstance.view.settings.data[cellMeta.visualRow][opcionName] = values
          props.hotRef.current.hotInstance.setDataAtRowProp(cellMeta.visualRow,cellMeta.visualCol,values);
          props.hotRef.current.hotInstance.updateSettings({
            cellRow:cellMeta.visualRow,
          },);
        }
      }  
    } catch (error) {
      console.log(error)
    }
  },[props.setClickCell]);

  const renderRadioButton = (td, row, optionName,id_valor,hotInstance,className,columnIndex)=> {
    const selRadio   = td.querySelector('input[type="radio"]') ? td.querySelector('input[type="radio"]') : document.createElement('input') ; 
    selRadio.type    = 'radio';
    selRadio.id      = id_valor
    selRadio.name    = `selectedOptionRow${row}`;    
    selRadio.value   = optionName;
    selRadio.checked = hotInstance.getSourceDataAtRow(row)[id_valor] === optionName ? true : false;
    selRadio.classList.add(`custom-radio-button`)
    selRadio.addEventListener('focus', (event) => {
      event.stopPropagation();
    })
    selRadio.addEventListener('keydown', (event) => {
      if(['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(event.key)) hotInstance.selectCell(row, columnIndex);
    })
    td.classList.add(`custom-radio-button_${className}`)
    td.appendChild(selRadio);
  }

  const beforeOnCellMouseDown = React.useCallback((e,row)=>{
    if(props.OnCellMouseDown)props.OnCellMouseDown(e,row,props.id)
  },[])

  const afterDocumentKeyDown = React.useCallback((e)=>{
    if(props.afterDocumentKeyDown)props.afterDocumentKeyDown(e,props.id)
  })

   // MULTIPLE HEADER
  const getkeysValue = (value)=>{
    var arrayValue = []
    if(value.length > 0){
      value.map((items)=>{
        let keys = items.title;
        arrayValue.push(keys);
      })
    }
    return arrayValue;
  }
  const generateNestedHeaders = ()=>{
    var rowArray = []
    var banArray = false;
    props.columns.map((itemSubTitle)=>{
      if(itemSubTitle.subTitle){
        banArray      = true;
        if(itemSubTitle.subTitle.length > 0){
          rowArray.push(itemSubTitle.subTitle)
        }
      }
    });

    if(banArray){
      let keyColumn = getkeysValue(props.columns)
      rowArray.push(keyColumn);
    }

    if(!banArray)return false
    else return rowArray;
  }
  const nestedHeaders = props.multipleHeader ? generateNestedHeaders() : false;  
  

  return (
    <div className={`componente-handsontable handsontable-large`}>
      <HotTable
        ref={props.hotRef}
        data={props.hotRef?.current?.hotInstance ? props.hotRef?.current?.hotInstance.getSourceData() : []}
        height={props.height}
        copyPaste={true}
        trimRows={true}
        snapToBottom={true}
        enterBeginsEditing={false}
        autoWrapRow={true}
        autoWrapCol={false}
        dragToScroll={true}
        renderAllColumns={props.renderAllColumns}
        renderAllRows={props.renderAllRows}
        language="es-MX"
        stretchH={'all'}
        filters={true}
        contextMenu={['alignment','undo','copy']}
        dropdownMenu={['filter_by_value', 'filter_action_bar']}
        afterDropdownMenuShow={(instance) => instance.hot.getPlugin('filters').components.get('filter_by_value').elements[0].onClearAllClick({ preventDefault: () => {} })}
        colHeaders={props.columns.map((col) => `<div class="handsontable_${col.className}">${col.title}</div>`)}
        enterMoves={() => ({ row: 0, col: 1 })}        
        afterOnCellMouseDown={handleCellClick}
        afterGetColHeader={customAfterGetColHeader}
        beforeKeyDown={beforeKeyDown}
        beforeChange={onBeforeChange}
        afterSelection={handleAfterSelection}
        beforeOnCellMouseDown={beforeOnCellMouseDown}
        afterDocumentKeyDown={afterDocumentKeyDown}
        nestedHeaders={nestedHeaders}
        
        licenseKey="non-commercial-and-evaluation"
      >
        {props.columns.map((col, index) => (
          
          col.type === 'date' ?
            <HotColumn
              key={index}
              data={col.data}
              type={col.type}
              title={col.title}
              width={col.width}
              className={`${col.className}`}
              readOnly={col.readOnly}
              correctFormat={true}
              columnSorting={col.sorter ? { headerAction: true } : { headerAction: false }}
              dateFormat="DD/MM/YYYY" 
              allowHtml={false}
              datePickerConfig={{
                showOnFocus: false,
                showWeekNumber: false,
                i18n: {
                  previousMonth: 'Mes Anterior',
                  nextMonth: "Próximo Mes",
                  months: meses,
                  weekdays: ["Domingo", "lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"],
                  weekdaysShort: diasSemanaCorto                  
                },
                onOpen:()=>{
                  const datePicker = document.querySelector('.htDatepickerHolder');
                  if (datePicker) datePicker.classList.add(`${props.id}_htDatepickerHolder`);
                }
              }}
            />
            : col.type === 'numeric' ?
              <HotColumn
                key={index}
                data={col.data}
                type={col.type}
                title={col.title}
                width={col.width}
                className={col.className}
                readOnly={col.readOnly}
                columnSorting={col.sorter ? { headerAction: true } : { headerAction: false }}
                numericFormat={ col.format ?  col.format : { pattern:'0,0',culture:'de-DE' }}
              />
            : col.type === 'button' ?
              <HotColumn
                key={index}
                data={col.data}
                title={col.title}
                width={col.width}
                className={col.className}
                renderer={(instance, TD, row, colum) => customRenderer(instance, TD, row, colum, col.icon)}
                readOnly={true}
              />
            : col.type === 'radio' ?
              <HotColumn
                key={index}
                data={col.data}
                title={col.title}
                width={col.width}
                className={col.className}
                renderer={(instance, TD, row) => renderRadioButton(TD, row, col.valor, col.id_valor, instance,col.className,index)} // Usar col.optionName en lugar de col.value
                readOnly={true}
              />
            : col.type == 'select' ?
              <HotColumn
                key={index}
                data={col.data}
                type='dropdown'            
                title={col.title}
                width={col.width}
                className={`${col.className}`}
                readOnly={col.readOnly ? col.readOnly : false}
                source={col.options ? col.options : []}
                validator={keyValueListValidator}
                renderer={keyValueListRenderer}
                editor={KeyValueListEditor}
                columnSorting={col.sorter == true ? {headerAction:true} : {headerAction:false}}
              />
            :
              <HotColumn
                key={index}
                data={col.data}
                title={col.title}
                type={col.type}
                width={col.width}
                readOnly={col.readOnly || false}
                className={`${col.className, col.textWrap ? "unwraptext" : col.className}`}
                checkedTemplate  ={col?.checkbox?.length > 0 ? col?.checkbox[0] : ''}
                uncheckedTemplate={col?.checkbox?.length > 0 ? col?.checkbox[1] : ''}
              />
        ))}
      </HotTable>
    </div>
  );
});

export default HandsontableLarge;