export const desactivarSpinner = ()=>{
  // Eliminamos la classNameContent del contenedor
  let classNameContent  = 'ant-spin-blur';
  document.getElementsByClassName(classNameContent)[0]?.classList?.remove(classNameContent);
}
export const activarSpinner = ()=>{
  let AddclassNameContent = 'ant-spin-blur'
  let classNameContent    = 'ant-spin-container'
  let valorClass          = document.getElementsByClassName(classNameContent);  
  valorClass[0]?.classList?.add(AddclassNameContent);
}