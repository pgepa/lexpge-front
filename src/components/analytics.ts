import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-9R7C0RCNJ0'); // Substitua pelo ID correto
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};
