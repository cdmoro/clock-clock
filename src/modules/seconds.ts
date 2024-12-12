import { store } from '../store';

let interval: NodeJS.Timeout;

export function initSeconds() {
  const secondHand = document.createElement('div');
  secondHand.className = 'second';
  document.querySelector('.mini-clock:first-child')?.append(secondHand);

  if (store.get('seconds')) {
    startSecondsInterval();
  }

  document.getElementById('seconds')?.addEventListener('click', () => {
    const isSeconds = store.toggle('seconds');

    if (isSeconds) {
      startSecondsInterval();
    } else {
      clearInterval(interval);
    }
  });
}

function startSecondsInterval() {
  interval = setInterval(() => updateSeconds(), 100);
}

function updateSeconds() {
  const now = new Date();
  const time = now.getSeconds() + (now.getMilliseconds() / 1000);
  document.getElementById("clock")!.style.setProperty('--seconds-rotate', `${((time * 360) / 60) - 90}deg`);
}