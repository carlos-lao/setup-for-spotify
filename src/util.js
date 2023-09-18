const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const dateStrToObj = (date) => {
  const strArr = date.split('-');
  const retval = {}
  
  retval.day = strArr[0];
  retval.month = MONTHS[parseInt(strArr[1]) - 1];
  retval.year = strArr[2];
  
  return retval;
}

export const TRANSITION_DURATION = 500;

export const TRANSITION_STATUS = {
  UNMOUNTED_PERSIST: "unmountedpersist",
  UNMOUNTED: "unmounted",
  EXITED: "exited",
  ENTERING: "entering",
  ENTERED: "entered",
  EXITING: "exiting",
}

export const TRANSITION_STYLE = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
  unmounted: {display: 'none'},
  unmountedpersist: {opacity: 0},
};

export const ROOT = {
  PROD: 'https://carlos-lao.github.io/setup-for-spotify/',
  DEV: 'http://localhost:3000/setup-for-spotify',
}

export const API = {
  SETLISTFM_DEV: 'http://localhost:8080',
  SPOTIFY_DEV: 'http://localhost:8888',
  SETLISTFM_PROD: 'https://setup-for-spotify.onrender.com:8080/',
  SPOTIFY_PROD: 'https://setup-for-spotify.onrender.com:8888/',
}