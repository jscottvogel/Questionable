export const proxyUrl = process.env.NODE_ENV === 'development' ? `http://${ process.env.REACT_APP_PROXY_HOSTNAME }:${ process.env.REACT_APP_PROXY_PORT }` : '';

