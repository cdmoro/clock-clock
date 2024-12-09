import { store } from '../store';

export function initSeconds() {
  document.getElementById('seconds')?.addEventListener('click', () => store.toggle('seconds'));
}
