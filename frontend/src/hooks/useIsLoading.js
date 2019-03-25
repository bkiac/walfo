function useIsLoading(responses) {
  return responses.some(r => r.isLoading);
}

export default useIsLoading;
