// =====================================================================
// app.js -- Praxis startup, navigation, init
// STAGE 1.1: only proves DOMContentLoaded fires and module load order
// is intact. show() / render() / nav land in later sub-stages.
// =====================================================================

'use strict';

document.addEventListener('DOMContentLoaded', function() {
  console.log('App init');
  loadState();
  saveState();
});
