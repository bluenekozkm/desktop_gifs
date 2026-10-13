// Toolbar popup: Firefox does not grant host permissions at install time like
// Chrome does, so search breaks until the user allows tenor.com. This offers
// that one-click grant and reports the current state.
(() => {
  const api = globalThis.browser ?? globalThis.chrome;
  const ORIGINS = { origins: ['https://tenor.com/*'] };

  const status = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  const allowBtn = document.getElementById('allow');
  const note = document.getElementById('note');
  const reloadNote = document.getElementById('reload-note');

  async function isGranted() {
    try { return await api.permissions.contains(ORIGINS); } catch (e) { return false; }
  }

  async function render() {
    const granted = await isGranted();
    status.dataset.on = String(granted);
    statusText.textContent = granted ? 'Tenor access is on. You are set.' : 'Tenor access is off. Search will not work.';
    allowBtn.hidden = granted;
    allowBtn.disabled = false;
    note.hidden = granted;
    reloadNote.hidden = !granted;
  }

  allowBtn.addEventListener('click', async () => {
    allowBtn.disabled = true;
    try {
      const ok = await api.permissions.request(ORIGINS);
      if (!ok) statusText.textContent = 'Not granted. You can also allow tenor.com in about:addons → Permissions.';
    } catch (e) {
      statusText.textContent = 'Could not ask for permission. Allow tenor.com in about:addons → Permissions.';
    }
    await render();
  });

  render();
})();
