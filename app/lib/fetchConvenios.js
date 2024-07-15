export const fetchConvenios = async (setConvenioOptions) => {
  const response = await fetch('/convenios.json');
  const data = await response.json();
  const options = data.convenios.map(convenio => ({ value: convenio, label: convenio }));
  setConvenioOptions(options);
};
