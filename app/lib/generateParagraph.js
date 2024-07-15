export const generateParagraph = (auditor, convenio, location, coordinates, tipo, observacion) => {
  return `Auditor: ${auditor}\nConvenio: ${convenio ? convenio.label : ''}\nCalle:${location?.street}\nCiudad:${location?.city}\nEstado:${location?.state}\nCP:${location?.postalCode}\nCoordinadas: ${coordinates}\nTipo: ${tipo}\nObservación: ${observacion}`;
};
