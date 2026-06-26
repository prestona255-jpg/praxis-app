/* =====================================================================
   writing-canvas.js -- the shared WritingCanvas core (Writing-Core build).

   ONE module, ONE entry point: createWritingCanvas(mountEl, opts) -> handle.
   Substrate-agnostic interface per design/writing-core-contract.md S2. Every
   composing surface binds to the HANDLE only -- never the raw element -- so a
   later textarea->contenteditable swap stays internal to this file and breaks
   no adopter.

   STAGE 2a: TEXTAREA substrate. Self-contained -- no el(), no views.js helper
   (this file loads BEFORE views.js). ES3 only: var/function and string concat;
   none of the ES5+/ES6 forms (block-scoped declarations, arrow functions,
   classes, template literals, or promise catch/finally tails). Canonical stored
   value = markdown plain-text (recon-confirmed: zero migration).

   Slices:
   - 2a.1 (this base): the substrate + the full handle (getValue / setValue /
     insertAtCaret / getSelection / onSelectionChange / focus / destroy).
   - 2a.3 appends: the autosave trigger + the calm "Saved" cue + the contextual
     formatting control + focus mode (wired at the marked seams below).
   ===================================================================== */

function createWritingCanvas(mountEl, opts) {
  if (!mountEl) { return null; }
  opts = opts || {};
  var flags = opts.flags || {};
  // flags.titleField is reserved for the artifact / sub-theory adoption (a
  // later stage); marginalia (Stage 2a) never sets it. flags.photos is the
  // deferred media slot. flags.focusMode (default true) is wired in 2a.3.

  // ---- DOM (built here; never handed to the adopter) ---------------------
  var wrap = document.createElement('div');
  wrap.className = 'wc-wrap';
  if (opts.surfaceId) { wrap.setAttribute('data-wc-surface', String(opts.surfaceId)); }

  var ta = document.createElement('textarea');
  ta.className = 'wc-input';
  ta.setAttribute('spellcheck', 'true');
  ta.setAttribute('rows', '1');
  if (typeof opts.placeholder === 'string') {
    ta.setAttribute('placeholder', opts.placeholder);
  }
  ta.value = (typeof opts.initialValue === 'string') ? opts.initialValue : '';

  wrap.appendChild(ta);
  mountEl.innerHTML = '';
  mountEl.appendChild(wrap);

  // ---- internals ---------------------------------------------------------
  var selCbs = [];

  function autogrow() {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }

  function readSelection() {
    var start = (typeof ta.selectionStart === 'number') ? ta.selectionStart : ta.value.length;
    var end = (typeof ta.selectionEnd === 'number') ? ta.selectionEnd : start;
    return {
      start: start,
      end: end,
      text: ta.value.substring(start, end),
      hasFocus: (document.activeElement === ta)
    };
  }

  function fireSelectionChange() {
    var snap = readSelection();
    var i;
    for (i = 0; i < selCbs.length; i = i + 1) {
      try { selCbs[i](snap); } catch (e) {}
    }
  }

  // ---- the handle methods (the ONLY surface adopters bind to) ------------
  function getValue() {
    return ta.value;
  }

  function setValue(md) {
    ta.value = (typeof md === 'string') ? md : '';
    autogrow();
  }

  // Splice text at the caret (or over the selection), reposition the caret to
  // the end of the inserted text, and return the resulting markdown. The raw
  // selectionStart/setSelectionRange/focus are fully internal here -- no
  // adopter ever touches them (this subsumes cite-weave's insertCitationAtCursor).
  function insertAtCaret(text) {
    text = (typeof text === 'string') ? text : '';
    var start = (typeof ta.selectionStart === 'number') ? ta.selectionStart : ta.value.length;
    var end = (typeof ta.selectionEnd === 'number') ? ta.selectionEnd : start;
    ta.value = ta.value.substring(0, start) + text + ta.value.substring(end);
    var caret = start + text.length;
    ta.focus();
    if (typeof ta.setSelectionRange === 'function') {
      ta.setSelectionRange(caret, caret);
    }
    autogrow();
    fireSelectionChange();
    return ta.value;
  }

  function getSelection() {
    return readSelection();
  }

  function onSelectionChange(cb) {
    if (typeof cb !== 'function') { return function () {}; }
    selCbs.push(cb);
    return function unsubscribe() {
      var i;
      for (i = 0; i < selCbs.length; i = i + 1) {
        if (selCbs[i] === cb) { selCbs.splice(i, 1); return; }
      }
    };
  }

  function focusCanvas() {
    ta.focus();
  }

  // ---- top bar: contextual control (left) + the "Saved" cue (right) ------
  var bar = document.createElement('div');
  bar.className = 'wc-bar';

  // The contextual formatting control. Selection-triggered; inserts markdown
  // SYNTAX via the caret API (NOT a live render -- the rendered output lands
  // with the contenteditable substrate, a later stage). Anchored in this thin
  // bar in the textarea era (pixel-over-selection positioning needs caret
  // coordinates the textarea does not expose; it arrives with contenteditable).
  var fmt = document.createElement('div');
  fmt.className = 'wc-fmt';
  function addFmtBtn(label, cls, action) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'wc-fmt-btn' + (cls ? ' ' + cls : '');
    b.appendChild(document.createTextNode(label));
    b.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep the textarea selection
    b.addEventListener('click', function (e) { e.preventDefault(); action(); });
    fmt.appendChild(b);
  }
  function wrapSelection(mark) {
    var snap = readSelection();
    insertAtCaret(mark + snap.text + mark);
    if (snap.text === '' && typeof ta.setSelectionRange === 'function') {
      var pos = snap.start + mark.length;
      ta.setSelectionRange(pos, pos);
    }
    scheduleSave();
  }
  function prefixLine(marker) {
    var v = ta.value;
    var snap = readSelection();
    var lineStart = v.lastIndexOf('\n', snap.start - 1) + 1;
    ta.value = v.substring(0, lineStart) + marker + v.substring(lineStart);
    var pos = snap.start + marker.length;
    ta.focus();
    if (typeof ta.setSelectionRange === 'function') { ta.setSelectionRange(pos, pos); }
    autogrow();
    fireSelectionChange();
    scheduleSave();
  }
  addFmtBtn('B', 'wc-fmt-b', function () { wrapSelection('**'); });
  addFmtBtn('I', 'wc-fmt-i', function () { wrapSelection('*'); });
  addFmtBtn('H', 'wc-fmt-g', function () { prefixLine('# '); });
  addFmtBtn('•', 'wc-fmt-g', function () { prefixLine('- '); });
  addFmtBtn('1.', 'wc-fmt-g', function () { prefixLine('1. '); });
  addFmtBtn('☐', 'wc-fmt-g', function () { prefixLine('[] '); });
  addFmtBtn('❝', 'wc-fmt-g', function () { prefixLine('> '); });

  function refreshFmt() {
    var snap = readSelection();
    fmt.className = (snap.hasFocus && snap.start !== snap.end) ? 'wc-fmt wc-fmt-on' : 'wc-fmt';
  }

  // The calm "Saved" cue. Reads ONLY the local-durability boolean handed back
  // through report.setLocal -- no state.js change. Never a button.
  var cue = document.createElement('div');
  cue.className = 'wc-saved';
  var cueDot = document.createElement('span');
  cueDot.className = 'wc-sdot';
  var cueText = document.createElement('span');
  cueText.className = 'wc-stext';
  cueText.appendChild(document.createTextNode('Saved'));
  cue.appendChild(cueDot);
  cue.appendChild(cueText);

  var cueT1 = null, cueT2 = null;
  function cueClear() {
    if (cueT1) { clearTimeout(cueT1); cueT1 = null; }
    if (cueT2) { clearTimeout(cueT2); cueT2 = null; }
  }
  function cueSaving() { cueClear(); cue.className = 'wc-saved wc-saving'; cueText.firstChild.nodeValue = 'Saving…'; }
  function cueSaved() {
    cueClear();
    cueT1 = setTimeout(function () {
      cue.className = 'wc-saved wc-shown';
      cueText.firstChild.nodeValue = 'Saved';
      cueT2 = setTimeout(function () { cue.className = 'wc-saved wc-rest'; }, 1600);
    }, 350);
  }
  function cueFailed() { cueClear(); cue.className = 'wc-saved wc-failed'; cueText.firstChild.nodeValue = 'Couldn’t save'; }

  bar.appendChild(fmt);
  bar.appendChild(cue);
  wrap.insertBefore(bar, ta);

  // ---- autosave (core-owned trigger: debounced input + blur flush) -------
  var saveTimer = null;
  var lastSaved = ta.value;
  var report = {
    setLocal: function (ok) { if (ok) { cueSaved(); } else { cueFailed(); } },
    setCloud: function (status) { /* deferred: the cloud-sync twin is a later stage */ }
  };
  function flushSave() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    var v = ta.value;
    if (v === lastSaved) { return; }
    lastSaved = v;
    if (v.replace(/^\s+|\s+$/g, '') === '') { return; } // never autosave an empty doc
    if (typeof opts.onSave === 'function') {
      cueSaving();
      opts.onSave(v, report);
    }
  }
  function scheduleSave() {
    if (saveTimer) { clearTimeout(saveTimer); }
    saveTimer = setTimeout(flushSave, 700);
  }

  // ---- focus mode (the surrounding chrome recedes while writing) ----------
  var focusModeOn = (flags.focusMode !== false);
  function setFocusMode(on) {
    if (!(focusModeOn && document.body && document.body.classList)) { return; }
    if (on) { document.body.classList.add('wc-focus'); }
    else { document.body.classList.remove('wc-focus'); }
  }

  // ---- wiring ------------------------------------------------------------
  function onInput() {
    autogrow();
    fireSelectionChange();
    refreshFmt();
    scheduleSave();
  }
  function onSelEvent() {
    fireSelectionChange();
    refreshFmt();
  }
  function onFocus() { setFocusMode(true); }
  function onBlur() { setFocusMode(false); flushSave(); refreshFmt(); }

  ta.addEventListener('input', onInput);
  ta.addEventListener('keyup', onSelEvent);
  ta.addEventListener('mouseup', onSelEvent);
  ta.addEventListener('select', onSelEvent);
  ta.addEventListener('focus', onFocus);
  ta.addEventListener('blur', onBlur);

  function destroy() {
    ta.removeEventListener('input', onInput);
    ta.removeEventListener('keyup', onSelEvent);
    ta.removeEventListener('mouseup', onSelEvent);
    ta.removeEventListener('select', onSelEvent);
    ta.removeEventListener('focus', onFocus);
    ta.removeEventListener('blur', onBlur);
    cueClear();
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    setFocusMode(false);
    selCbs = [];
    if (wrap.parentNode) { wrap.parentNode.removeChild(wrap); }
  }

  autogrow();
  refreshFmt();

  return {
    getValue: getValue,
    setValue: setValue,
    insertAtCaret: insertAtCaret,
    getSelection: getSelection,
    onSelectionChange: onSelectionChange,
    focus: focusCanvas,
    destroy: destroy
  };
}
