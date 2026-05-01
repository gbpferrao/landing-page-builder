export function debounce(fn, wait = 250) {
  let timerId;

  const debounced = (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => fn(...args), wait);
  };

  debounced.cancel = () => window.clearTimeout(timerId);

  return debounced;
}

export default debounce;
