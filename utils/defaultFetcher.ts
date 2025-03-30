const defaultFetcher = (url: string) => fetch(url).then((res) => res.json());

export default defaultFetcher;
