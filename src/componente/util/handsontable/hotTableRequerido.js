export const hotTableRequerido = async (ref,formName,importa_insertDefault = false)=>{
  var Addband = false
  var columnaRequerido = [] 
  if(ref.columna[formName]){
    var rowDet = ref.grid[formName].current.__hotInstance.getSourceData() !== undefined ? ref.grid[formName].current.__hotInstance.getSourceData() : []

    for (let index = 0; index < ref.columna[formName].length; index++) {
      const element = ref.columna[formName][index];
      if(element.requerido){

        if(importa_insertDefault){

          for (let i = 0; i < rowDet.length; i++) {
            const items = rowDet[i];
            if(items[element.data]){              
              if(items[element.data] === '' && !items?.insertDefault){
                Addband  = true;
                let IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);
                columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
                break
              }
            }else if( (items[element.data]?.length < 0   || 
                       items[element.data] === undefined || 
                       items[element.data] === null      || 
                       items[element.data] === ""          )  && !items?.insertDefault){//vtmonocr
              Addband  = true;
              let IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);              ;
              columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
              break
            }
          }

        }else{

          for (let i = 0; i < rowDet.length; i++) {
            const items = rowDet[i];
            
            if(items[element.data] === ''){
              Addband  = true;
              let IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);
              columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
              break          
            }else if( (items[element.data]?.length < 0  || 
                      items[element.data] === undefined || 
                      items[element.data] === null      || 
                      items[element.data] === ""        ) && !items.insertDefault){//vtmonocr
              Addband  = true;
              var IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);              ;
              columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
              break
            }
          }
        }
       
        if(Addband) break
      }
    }
  }
  return {Addband, columnaRequerido}
}

export const hotTableRequerido_allFormName = async (ref,ArrayFormName = [],importa_InsertDefault = false)=>{
  var Addband = false
  var columnaRequerido = [] 
  for (let index = 0; index < ArrayFormName.length; index++) {
    const formName = ArrayFormName[index];
    
    if(ref.columna[formName] && (ref.grid[formName] && ref.grid[formName].current)){
      var rowDet = ref.grid[formName].current.__hotInstance.getSourceData() !== undefined ? ref.grid[formName].current.__hotInstance.getSourceData() : []
      
      for (let index = 0; index < ref.columna[formName].length; index++) {
        const element = ref.columna[formName][index];
        if(element.requerido){
  
          if(importa_InsertDefault){
            
            for (let i = 0; i < rowDet.length; i++) {
              const items = rowDet[i];
              /** 
               En caso de eliminar un registro no debe de tener en cuenta el resgistr eliminado. 
               PD: igual obtiene los datos eliminados y muestra todos los valores en null 
              **/
              const todosSonNull = Object.values(items).every(valor => valor === null);
              if(!todosSonNull){
                if(items[element.data]){
                  if(items[element.data] === '' && !items?.InsertDefault){
                    Addband  = true;
                    var IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);
                    columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn, "formName":formName}
                    break
                  }
                }else if( (items[element.data]?.length < 0   || 
                           items[element.data] === undefined || 
                           items[element.data] === null      || 
                           items[element.data] === ""          )  && !items?.InsertDefault){//vtmonocr
                  Addband  = true;
                  var IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);              ;
                  columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn, "formName":formName}
                  break
                }
              }
              

            }
  
          }else{
  
            for (let i = 0; i < rowDet.length; i++) {
              const items = rowDet[i];
              if(items[element.data]){              
                if(items[element.data] === ''){
                  Addband  = true;
                  var IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);
                  columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn, "formName":formName}
                  break
                }
  
              }else if( items[element.data]?.length < 0   || 
                        items[element.data] === undefined || 
                        items[element.data] === null      || 
                        items[element.data] === ""        ){//vtmonocr
                Addband  = true;
                var IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);              ;
                columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn, "formName":formName}
                break
              }
            }
          }
         
          if(Addband) break
        }
      }
    }
    
  }
  return {Addband, columnaRequerido}
}

export const hotTableRequerido_insert_update = async (ref,formName)=>{
  var Addband = false
  var columnaRequerido = [] 
  if(ref.columna[formName]){
    var rowDet = ref.grid[formName].current.__hotInstance.getSourceData() !== undefined ? ref.grid[formName].current.__hotInstance.getSourceData() : []

    for (let index = 0; index < ref.columna[formName].length; index++) {
      const element = ref.columna[formName][index];
      if(element.requerido){

        for (let i = 0; i < rowDet.length; i++) {
          const items = rowDet[i];
          if(items?.updated === true || items?.inserted === true){
            let bandera = false
            if( items[element.data]?.length < 0 ||  items[element.data] === undefined || 
              items[element.data] === null      ||  items[element.data] === ""       ){
              Addband  = true;
              var IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);              ;
              columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
              bandera = true
            }
            if(bandera) break
          }
        }
       
        if(Addband) break
      }
    }
  }
  return {Addband, columnaRequerido}
}