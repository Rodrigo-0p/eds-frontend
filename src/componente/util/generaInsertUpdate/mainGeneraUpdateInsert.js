import _    from 'underscore'
import Main from '../main';

const GeneraUpdateInsertCab = async (rows, key, url, updateDependencia, autoCodigo, cod_Not_null, cod_auto_porDef = false) => {
  var updateInsert = [];
  var rowsAux = [];
  var codigo  = null;
  var update  = false
  var insert  = false
  var content = rows.filter(item => item.inserted === true);
  if (content.length > 0) {
    if (autoCodigo !== false) {
      codigo = await Main.Request(url, 'GET', {})
        .then(response => {
          return response.data.rows;
        })
      codigo = codigo[0].ID
      codigo = codigo + (content.length - 1);
    } else if (cod_Not_null) {
      if (content[0][key] !== "" || content[0][key] !== null) {
        codigo = await Main.Request(url, 'GET', {})
          .then(response => {
            return response.data.rows;
          })
        codigo = codigo[0].ID
        codigo = codigo + (content.length - 1);
      }
    }
  }
  for (let index = 0; index < rows.length; index++) {
    const element = rows[index];
    if (element.updated === true) {
      update = true
      updateInsert.push(element);
    }
    if (element.inserted === true && !element[key]) {
      insert = true
      element[key] = codigo;
      updateInsert.push(element);
      codigo--;
    } else if (element.inserted === true && cod_auto_porDef) {
      insert = true
      element[key] = codigo;
      updateInsert.push(element);
      codigo--;
    } else if (element.inserted === true) {
      insert = true
      updateInsert.push(element);
    }

    if (updateDependencia) {
      if (rows.length > 1) {
        rowsAux.push(_.omit(element, 'updated', 'inserted'));
        for (let i = 0; i < updateDependencia.length; i++) {
          let ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
          let ObjectValueKey = Object.keys(updateDependencia[i])[0];
          if (rowsAux[index]) {
            if (rowsAux[index][ObjectKey] !== rowsAux[index][ObjectValueKey]) {
              rowsAux[index][ObjectKey] = rowsAux[index][ObjectValueKey];
            }
          }
        }
      } else {
        rowsAux.push(_.omit(element, 'updated', 'inserted'));
        for (let i = 0; i < updateDependencia.length; i++) {
          let ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
          let ObjectValueKey = Object.keys(updateDependencia[i])[0];
          if (rowsAux[index]) {
            if (rowsAux[index][ObjectKey] !== rowsAux[index][ObjectValueKey]) {
              rowsAux[index][ObjectKey] = rowsAux[index][ObjectValueKey];
            }
          }
        }
      }
    } else {
      rowsAux.push(_.omit(element, ['inserted', 'updated']))
    }

  }
  return {
    updateInsert: updateInsert,
    rowsAux     : rowsAux,
    actualizar  : update,
    insertar    : insert,
  }
};

const GeneraUpdateInsertDet = async (rows, keyNotNull, rowCabecera, updateDependencia, cod_cabecera, url, key, orderByKey = "DESC", keyCab_add_rowDEt = [], nro_serial = undefined) => {
  var updateInsert = [];
  var rowsAux = [];
  var update  = false
  var insert  = false

  var codigo = null;
  var content = rows.filter(item => item.inserted === true);

  if (content.length > 0) {
    if (url !== undefined) {
      codigo = await Main.Request(url, 'GET', {})
        .then(response => {
          return response.data.rows;
        })
      codigo = codigo[0].ID
      switch (orderByKey) {
        case "ASC":
          // eslint-disable-next-line
          codigo = codigo;
          break;
        case "DESC":
          codigo = codigo + (content.length - 1);
          break;
        default:
          break;
      }
    } else if (nro_serial !== undefined) {
      codigo = nro_serial
    }
  }

  for (let index = 0; index < rows.length; index++) {
    const item = rows[index];
    if (item.updated === true) {
      update = true
      if (keyNotNull.length > 0) {
        for (let i = 0; i < keyNotNull.length; i++) {
          const element = keyNotNull[i];
          if ((item[element] !== undefined && item[element] !== null && item[element] !== "")) {
            updateInsert.push(item);
          }
        }
      }
    }
    if (item.updated === true && !item[key] && url !== undefined) {
      update = true
      if (keyNotNull.length > 0) {
        for (let i = 0; i < keyNotNull.length; i++) {
          const element = keyNotNull[i];
          if ((item[element] !== undefined && item[element] !== null && item[element] !== "")) {
            updateInsert.push(item);
          }
        }
      }
    }
    if (item.inserted === true && !item[key] && (url !== undefined || nro_serial !== undefined)) {
      insert = true;
      switch (orderByKey) {
        case "ASC":
          item[key] = codigo;
          codigo++;
          break;
        case "DESC":
          item[key] = codigo;
          codigo--;
          break;
        default:
          break;
      }      
    }
    if (item.inserted === true) {
      insert = true;
      if (keyNotNull.length > 0) {
        for (let i = 0; i < keyNotNull.length; i++) {
          const element = keyNotNull[i];
          if ((item[element] !== undefined && item[element] !== null && item[element] !== "")) {
            if (cod_cabecera !== undefined) {
              // eslint-disable-next-line 
              var datosCabecera = await rowCabecera.filter((index) => { if (index.ID == item.idCabecera) return index });
              if (datosCabecera.length > 0) {
                item[cod_cabecera] = await datosCabecera[0][cod_cabecera];
                if (keyCab_add_rowDEt.length > 0) {
                  for (let key_cab = 0; key_cab < keyCab_add_rowDEt.length; key_cab++) {
                    const keyCab = keyCab_add_rowDEt[key_cab];
                    item[keyCab] = datosCabecera[0][keyCab]
                  }
                }
              }
            }
            updateInsert.push(item);
          }
        }
      }
    }
    if (rows.length > 1) {
      if (!item.insertDefault) {
        rowsAux.push(_.omit(item, 'updated', 'inserted'));
        for (let i = 0; i < updateDependencia.length; i++) {
          var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
          var ObjectValueKey = Object.keys(updateDependencia[i])[0];
          if (rowsAux[index]) {
            if (rowsAux[index][ObjectKey] !== rowsAux[index][ObjectValueKey]) {
              rowsAux[index][ObjectKey] = rowsAux[index][ObjectValueKey];
            }
          }
        }
      }
    } else {
      // if(!item.insertDefault){
      rowsAux.push(_.omit(item, 'updated', 'inserted'));
      for (let i = 0; i < updateDependencia.length; i++) {
        let ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
        let ObjectValueKey = Object.keys(updateDependencia[i])[0];
        if (rowsAux[index]) {
          if (rowsAux[index][ObjectKey] !== rowsAux[index][ObjectValueKey]) {
            rowsAux[index][ObjectKey] = rowsAux[index][ObjectValueKey];
          }
        }
      }
      // }
    }
  }
  return {
    updateInsert: updateInsert,
    rowsAux: rowsAux,
    actualizar: update,
    insertar: insert,
  }
}

export {
   GeneraUpdateInsertCab
 , GeneraUpdateInsertDet
}