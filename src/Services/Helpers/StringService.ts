export const createAlias = (text: string) => text
  .replace(/ /g,"_")
  .replace(/[ÀÁÂÃÄÅ]/g,"A")
  .replace(/[àáâãäå]/g,"a")
  .replace(/[ÈÉÊẼË]/g,"E")
  .replace(/[èéêẽë]/g,"e")
  .replace(/[ÌÍÎĨÏ]/g,"I")
  .replace(/[ìíîĩï]/g,"i")
  .replace(/[ÒÓÔÕÖ]/g,"O")
  .replace(/[òóôõö]/g,"o")
  .replace(/[ÙÚÛŨÜ]/g,"U")
  .replace(/[ùúûũü]/g,"u")
  .replace(/[^a-z0-9]/gi,'');
