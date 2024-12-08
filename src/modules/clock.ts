import { getTime, updateFavicon } from '../utils';
import { store } from '../store';
import { getRandomThemeColor } from './themes';

const DIGITS = {
  '0': [
    [2, 3],
    [4, 3],
    [1, 3],
    [1, 3],
    [1, 2],
    [1, 4],
  ],
  '1': [[], [3, 3], [], [1, 3], [], [1, 1]],
  '2': [
    [2, 2],
    [3, 4],
    [2, 3],
    [1, 4],
    [1, 2],
    [4, 4],
  ],
  '3': [
    [2, 2],
    [3, 4],
    [2, 2],
    [1, 3],
    [2, 2],
    [1, 4],
  ],
  '4': [[3, 3], [3, 3], [1, 2], [1, 3], [], [1, 1]],
  '5': [
    [2, 3],
    [4, 4],
    [1, 2],
    [4, 3],
    [2, 2],
    [1, 4],
  ],
  '6': [
    [2, 3],
    [4, 4],
    [1, 3],
    [4, 3],
    [1, 2],
    [1, 4],
  ],
  '7': [[2, 2], [4, 3], [], [1, 3], [], [1, 1]],
  '8': [
    [2, 3],
    [4, 3],
    [1, 2],
    [4, 1],
    [1, 2],
    [1, 4],
  ],
  '9': [
    [2, 3],
    [4, 3],
    [1, 2],
    [3, 1],
    [2, 2],
    [1, 4],
  ],
} as const;

function getMillisecondsToNextMinute() {
  const now = new Date();
  return (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
}

function updateTime() {
  const time = store.get('time') || getTime();

  if (time.includes(':00') || time.includes(':30')) {
    updateFavicon(time);
  }

  document.title = document.title.replace(/[0-9]{2}:[0-9]{2}/, time);

  const timeEl = document.getElementById('time-clock');
  if (timeEl) {
    timeEl.innerHTML = time;
  }

  if (store.get('theme')?.includes('color')) {
    document.documentElement.dataset.theme = getRandomThemeColor();
  }

  const digits = time.replace(':', '').split('');

  digits.forEach((digit, i) => {
    DIGITS[digit as keyof typeof DIGITS].forEach(([hour, minute], j) => {
      const el = document.querySelector<HTMLDivElement>(`.digit:nth-child(${i + 1}) .mini-clock:nth-child(${j + 1})`)!;
      const isInactive = !hour && !minute;

      el.classList.toggle('inactive', isInactive);
      el.dataset.hour = (hour || -1).toString();
      el.dataset.minute = (minute || -1).toString();
    });
  });
}

function drawClock() {
  const clock = document.getElementById('clock-clock')!;

  for (let i = 0; i < 4; i++) {
    const digit = document.createElement('div');
    digit.className = 'digit';
    digit.dataset.number = (i + 4).toString();

    for (let j = 0; j < 6; j++) {
      const miniClock = document.createElement('div');
      miniClock.className = 'mini-clock';
      miniClock.innerHTML =
        '<div class="center"></div><div class="hands hours"></div><div class="hands minutes"></div><div class="shadow"></div>';
      digit.append(miniClock);
    }

    clock.append(digit);
  }
}

export function initClock() {
  const isTest = !!store.get('time');
  const timeToNextMinute = getMillisecondsToNextMinute();
  drawClock();

  setTimeout(() => {
    updateTime();
  }, 200);

  if (!isTest) {
    setTimeout(() => {
      updateTime();
      setInterval(updateTime, 60000);
    }, timeToNextMinute);
  }
}
