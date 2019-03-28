function useValidateResponse(res) {
  if (res.hasError) {
    return res.data.errors.reduce(
      (errorsObject, { param, msg }) =>
        errorsObject[param] ? errorsObject : { ...errorsObject, [param]: msg },
      {},
    );
  }
  return {};
}

export default useValidateResponse;
