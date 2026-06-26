/* =====================================================================
   writing-canvas.js -- the shared WritingCanvas core (Writing-Core build).

   ONE module, ONE entry point: createWritingCanvas(mountEl, opts) -> handle.
   Substrate-agnostic interface per design/writing-core-contract.md S2. Every
   composing surface binds to the HANDLE only -- never the raw element.

   STAGE 2b: CONTENTEDITABLE substrate with LIVE block render, internal to this
   file (the contract boundary holds: the marginalia adopter in views.js is
   unchanged). Self-contained -- no el(), no views.js helper (loads before
   views.js). ES3 only: var/function and string concat; none of the ES5+/ES6
   forms (block-scoped declarations, arrow functions, classes, template literals,
   or promise catch/finally tails). DOM APIs (Range/Selection, classList,
   execCommand, contains) are not ES syntax and are used freely.

   Canonical stored value = markdown plain-text (recon-confirmed: zero migration).
   getValue serializes the rendered DOM -> the SAME markdown 2a stored; setValue
   parses markdown -> rendered DOM. render(serialize(x)) is idempotent.

   Scope notes (sanctioned):
   - LIVE block transforms (# / ## / - / * / 1. / [] / [x] / >) render as you type.
   - Stored **bold** / *italic* render on LOAD (parseInline); bold/italic are
     also created via the contextual control. The live AS-YOU-TYPE inline
     transform is DEFERRED (highest caret risk).
   - The floating-over-selection control + vignette focus polish are DEFERRED;
     the control stays in the 2a top bar and focus mode dims the nav (safe).
   ===================================================================== */

function createWritingCanvas(mountEl, opts) {
  if (!mountEl) { return null; }
  opts = opts || {};
  var flags = opts.flags || {};

  // ---- state ----
  var selCbs = [];
  var saveTimer = null;
  var snapTimer = null;
  var lastSaved = '';
  var undoStack = [];
  var redoStack = [];

  // ---- DOM ----
  var wrap = document.createElement('div');
  wrap.className = 'wc-wrap';
  if (opts.surfaceId) { wrap.setAttribute('data-wc-surface', String(opts.surfaceId)); }

  var ed = document.createElement('div');
  ed.className = 'wc-input';
  ed.setAttribute('contenteditable', 'true');
  ed.setAttribute('spellcheck', 'true');
  if (typeof opts.placeholder === 'string') { ed.setAttribute('data-ph', opts.placeholder); }

  wrap.appendChild(ed);
  mountEl.innerHTML = '';
  mountEl.appendChild(wrap);

  // ========================================================================
  // MARKDOWN <-> DOM
  // ========================================================================
  function trimEdge(s) { return (typeof s === 'string') ? s.replace(/^\s+|\s+$/g, '') : ''; }

  // markdown inline (**bold** / *italic*) -> text + <strong>/<em> nodes
  function parseInline(text, parent) {
    text = (typeof text === 'string') ? text : '';
    var re = /(\*\*([^*]+?)\*\*)|(\*([^*]+?)\*)/g;
    var last = 0;
    var m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) { parent.appendChild(document.createTextNode(text.substring(last, m.index))); }
      if (m[1] !== undefined && m[1] !== null) {
        var st = document.createElement('strong');
        st.appendChild(document.createTextNode(m[2]));
        parent.appendChild(st);
      } else {
        var em = document.createElement('em');
        em.appendChild(document.createTextNode(m[4]));
        parent.appendChild(em);
      }
      last = re.lastIndex;
    }
    if (last < text.length) { parent.appendChild(document.createTextNode(text.substring(last))); }
  }

  function appendBlock(editorEl, tag, text) {
    var el = document.createElement(tag);
    parseInline(text, el);
    editorEl.appendChild(el);
    return el;
  }
  function makeList(editorEl, kind) {
    var tag = (kind === 'num') ? 'ol' : 'ul';
    var list = document.createElement(tag);
    list.className = 'wc-' + kind;
    editorEl.appendChild(list);
    return list;
  }
  function appendListItem(list, kind, text, checked) {
    var li = document.createElement('li');
    if (kind === 'chk') {
      if (checked) { li.className = 'wc-on'; }
      var sp = document.createElement('span');
      sp.className = 'wc-lbl';
      parseInline(text, sp);
      li.appendChild(sp);
    } else {
      parseInline(text, li);
    }
    list.appendChild(li);
    return li;
  }

  // markdown string -> rendered DOM (replaces the editor contents)
  function renderMarkdown(editorEl, md) {
    editorEl.innerHTML = '';
    md = (typeof md === 'string') ? md : '';
    if (trimEdge(md) === '') { return; }
    var lines = md.split('\n');
    var curList = null, curKind = null;
    var i, line, m;
    for (i = 0; i < lines.length; i = i + 1) {
      line = lines[i];
      if (trimEdge(line) === '') { curList = null; curKind = null; continue; }
      if ((m = line.match(/^##\s+([\s\S]*)$/))) { curList = null; curKind = null; appendBlock(editorEl, 'h3', m[1]); }
      else if ((m = line.match(/^#\s+([\s\S]*)$/))) { curList = null; curKind = null; appendBlock(editorEl, 'h2', m[1]); }
      else if ((m = line.match(/^>\s+([\s\S]*)$/))) { curList = null; curKind = null; appendBlock(editorEl, 'blockquote', m[1]); }
      else if ((m = line.match(/^\[([ xX]?)\]\s+([\s\S]*)$/))) {
        if (curKind !== 'chk') { curList = makeList(editorEl, 'chk'); curKind = 'chk'; }
        appendListItem(curList, 'chk', m[2], /[xX]/.test(m[1]));
      }
      else if ((m = line.match(/^[-*]\s+([\s\S]*)$/))) {
        if (curKind !== 'bul') { curList = makeList(editorEl, 'bul'); curKind = 'bul'; }
        appendListItem(curList, 'bul', m[1], false);
      }
      else if ((m = line.match(/^\d+\.\s+([\s\S]*)$/))) {
        if (curKind !== 'num') { curList = makeList(editorEl, 'num'); curKind = 'num'; }
        appendListItem(curList, 'num', m[1], false);
      }
      else { curList = null; curKind = null; appendBlock(editorEl, 'p', line); }
    }
  }

  // inline DOM -> markdown
  function inlineOfNode(node) {
    var out = '';
    var kids = node.childNodes;
    var i;
    for (i = 0; i < kids.length; i = i + 1) {
      var c = kids[i];
      if (c.nodeType === 3) { out = out + (c.nodeValue || ''); }
      else if (c.nodeType === 1) {
        var tag = c.tagName.toLowerCase();
        if (tag === 'strong' || tag === 'b') { out = out + '**' + inlineOfNode(c) + '**'; }
        else if (tag === 'em' || tag === 'i') { out = out + '*' + inlineOfNode(c) + '*'; }
        else if (tag === 'br') { out = out + ' '; }
        else { out = out + inlineOfNode(c); }
      }
    }
    return out;
  }
  function serializeList(listNode) {
    var tag = listNode.tagName.toLowerCase();
    var isNum = (tag === 'ol');
    var isChk = listNode.className.indexOf('wc-chk') !== -1;
    var lis = listNode.children;
    var lines = [];
    var j, n = 1;
    for (j = 0; j < lis.length; j = j + 1) {
      var li = lis[j];
      if (li.tagName.toLowerCase() !== 'li') { continue; }
      var pre, txt;
      if (isChk) {
        var done = li.className.indexOf('wc-on') !== -1;
        var lbl = li.querySelector ? li.querySelector('.wc-lbl') : null;
        txt = trimEdge(lbl ? inlineOfNode(lbl) : inlineOfNode(li));
        pre = done ? '[x] ' : '[] ';
      } else if (isNum) {
        txt = trimEdge(inlineOfNode(li)); pre = n + '. '; n = n + 1;
      } else {
        txt = trimEdge(inlineOfNode(li)); pre = '- ';
      }
      lines.push(pre + txt);
    }
    return lines.join('\n');
  }
  // rendered DOM -> markdown plain-text (the stored format)
  function serializeMarkdown(editorEl) {
    var blocks = [];
    var kids = editorEl.childNodes;
    var i;
    for (i = 0; i < kids.length; i = i + 1) {
      var node = kids[i];
      if (node.nodeType === 3) {
        var tt = trimEdge(node.nodeValue || '');
        if (tt !== '') { blocks.push(tt); }
        continue;
      }
      if (node.nodeType !== 1) { continue; }
      var tag = node.tagName.toLowerCase();
      if (tag === 'h2') { blocks.push('# ' + trimEdge(inlineOfNode(node))); }
      else if (tag === 'h3') { blocks.push('## ' + trimEdge(inlineOfNode(node))); }
      else if (tag === 'blockquote') { blocks.push('> ' + trimEdge(inlineOfNode(node))); }
      else if (tag === 'ul' || tag === 'ol') { var lst = serializeList(node); if (lst !== '') { blocks.push(lst); } }
      else if (tag === 'br') { /* stray -> skip */ }
      else { var p = trimEdge(inlineOfNode(node)); if (p !== '') { blocks.push(p); } }
    }
    return blocks.join('\n\n');
  }

  // ========================================================================
  // CARET / BLOCK helpers
  // ========================================================================
  function caretToStart(el) {
    var r = document.createRange(); var s = window.getSelection();
    r.selectNodeContents(el); r.collapse(true); s.removeAllRanges(); s.addRange(r);
  }
  function caretToEnd(el) {
    var r = document.createRange(); var s = window.getSelection();
    r.selectNodeContents(el); r.collapse(false); s.removeAllRanges(); s.addRange(r);
  }
  function caretToEndOfEditor() { if (ed.lastChild) { caretToEnd(ed.lastChild); } }

  function topBlock() {
    var sel = window.getSelection();
    if (!sel || !sel.rangeCount) { return null; }
    var n = sel.getRangeAt(0).startContainer;
    if (!ed.contains(n)) { return null; }
    if (n === ed) {
      var off = sel.getRangeAt(0).startOffset;
      return ed.children[Math.min(off, ed.children.length - 1)] || null;
    }
    while (n && n.parentNode !== ed) { n = n.parentNode; }
    return (n && n.nodeType === 1) ? n : null;
  }
  function closestLi(node) {
    var n = node;
    while (n && n !== ed) {
      if (n.nodeType === 1 && n.tagName.toLowerCase() === 'li') { return n; }
      n = n.parentNode;
    }
    return null;
  }
  function prevElement(node) {
    var p = node.previousSibling;
    while (p && p.nodeType !== 1) { p = p.previousSibling; }
    return p;
  }
  function replaceInEditor(oldNode, newNode) {
    if (oldNode && oldNode.parentNode) { oldNode.parentNode.replaceChild(newNode, oldNode); }
  }
  function removeFromEditor(node) {
    if (node && node.parentNode) { node.parentNode.removeChild(node); }
  }
  function seed() {
    if (ed.childElementCount === 0) {
      var p = document.createElement('p');
      ed.appendChild(p);
      caretToStart(p);
    }
  }
  function normalize() {
    var kids = [], i;
    for (i = 0; i < ed.childNodes.length; i = i + 1) { kids.push(ed.childNodes[i]); }
    var last = null;
    for (i = 0; i < kids.length; i = i + 1) {
      var k = kids[i];
      if (k.nodeType === 3 && trimEdge(k.nodeValue || '') !== '') {
        var p = document.createElement('p');
        p.appendChild(document.createTextNode(k.nodeValue));
        ed.replaceChild(p, k);
        last = p;
      }
    }
    if (last) { caretToEnd(last); }
  }

  // convert the caret's block to a target type, stripping the md prefix
  function applyBlock(type) {
    var block = topBlock();
    if (!block) { block = document.createElement('p'); ed.appendChild(block); caretToStart(block); }
    var text = (block.textContent || '').replace(/^\s*(#{1,2}\s|[-*]\s|\d+\.\s|\[(?:\s|x|X)?\]\s|>\s)/, '');
    var li = closestLi(block);
    var host = li ? li : block;
    var parentList = null;
    var pn = host.parentNode;
    if (pn && pn.tagName && (pn.tagName.toLowerCase() === 'ul' || pn.tagName.toLowerCase() === 'ol')) { parentList = pn; }
    var anchor = parentList ? parentList : block;
    var node = null;
    if (type === 'bul' || type === 'num' || type === 'chk') {
      var tag = (type === 'num') ? 'ol' : 'ul';
      var cls = 'wc-' + type;
      var list = prevElement(parentList ? parentList : host);
      if (!(list && list.tagName && list.tagName.toLowerCase() === tag && list.className.indexOf(cls) !== -1)) {
        list = document.createElement(tag); list.className = cls;
        replaceInEditor(anchor, list);
      } else {
        removeFromEditor(anchor);
      }
      var liEl = document.createElement('li');
      if (type === 'chk') {
        var sp = document.createElement('span'); sp.className = 'wc-lbl';
        sp.appendChild(document.createTextNode(text || ''));
        liEl.appendChild(sp);
        node = sp;
      } else {
        liEl.appendChild(document.createTextNode(text));
        node = liEl;
      }
      list.appendChild(liEl);
    } else if (type === 'quote') {
      var bq = document.createElement('blockquote');
      bq.appendChild(document.createTextNode(text));
      replaceInEditor(anchor, bq); node = bq;
    } else {
      var h = document.createElement(type === 'h3' ? 'h3' : (type === 'h2' ? 'h2' : 'p'));
      h.appendChild(document.createTextNode(text));
      replaceInEditor(anchor, h); node = h;
    }
    if (node) { if ((node.textContent || '') === '') { caretToStart(node); } else { caretToEnd(node); } }
    ed.focus();
  }

  // live block shortcuts on input
  function liveBlock() {
    var block = topBlock();
    if (!block) { return; }
    if (closestLi(block)) { return; }
    if (block.tagName && block.tagName.toLowerCase() === 'blockquote') { return; }
    var t = block.textContent || '';
    var m = t.match(/^(#{1,2}|[-*]|\d+\.|\[(?:\s|x|X)?\]|>)\s/);
    if (!m) { return; }
    var tok = m[1];
    if (tok === '#') { applyBlock('h2'); return; }
    if (tok === '##') { applyBlock('h3'); return; }
    if (tok === '-' || tok === '*') { applyBlock('bul'); return; }
    if (/^\d+\.$/.test(tok)) { applyBlock('num'); return; }
    if (tok === '[' || tok === '[]' || tok === '[ ]' || /^\[(?:x|X)?\]$/.test(tok)) {
      applyBlock('chk');
      if (/[xX]/.test(tok)) {
        var liNow = closestLi(topBlock());
        if (liNow && liNow.className.indexOf('wc-on') === -1) { liNow.className = trimEdge(liNow.className + ' wc-on'); }
      }
      return;
    }
    if (tok === '>') { applyBlock('quote'); return; }
  }

  // ========================================================================
  // CARET API (handle) -- Range/Selection, same contract shape
  // ========================================================================
  function textLen(node) {
    if (node.nodeType === 3) { return (node.nodeValue || '').length; }
    var len = 0, i;
    for (i = 0; i < node.childNodes.length; i = i + 1) { len += textLen(node.childNodes[i]); }
    return len;
  }
  function textOffsetOf(node, offset) {
    var count = 0, done = false;
    function walk(n) {
      if (done) { return; }
      if (n === node) {
        if (n.nodeType === 3) { count += offset; }
        else { var k; for (k = 0; k < offset && k < n.childNodes.length; k = k + 1) { count += textLen(n.childNodes[k]); } }
        done = true; return;
      }
      if (n.nodeType === 3) { count += (n.nodeValue || '').length; return; }
      var c; for (c = 0; c < n.childNodes.length; c = c + 1) { walk(n.childNodes[c]); if (done) { return; } }
    }
    walk(ed);
    return count;
  }
  function readSelection() {
    var hasFocus = (document.activeElement === ed);
    var sel = window.getSelection();
    if (!sel || !sel.rangeCount) { return { start: 0, end: 0, text: '', hasFocus: hasFocus }; }
    var r = sel.getRangeAt(0);
    if (!ed.contains(r.startContainer)) { return { start: 0, end: 0, text: '', hasFocus: hasFocus }; }
    var start = textOffsetOf(r.startContainer, r.startOffset);
    var end = textOffsetOf(r.endContainer, r.endOffset);
    return { start: start, end: end, text: sel.toString(), hasFocus: hasFocus };
  }
  function fireSelectionChange() {
    var snap = readSelection();
    var i;
    for (i = 0; i < selCbs.length; i = i + 1) { try { selCbs[i](snap); } catch (e) {} }
  }

  function getValue() { return serializeMarkdown(ed); }
  function setValue(md) {
    renderMarkdown(ed, md);
    lastSaved = getValue();
    undoStack = [lastSaved];
    redoStack = [];
    autoCueIdle();
  }
  function insertAtCaret(text) {
    text = (typeof text === 'string') ? text : '';
    ed.focus();
    var sel = window.getSelection();
    if (sel && sel.rangeCount && ed.contains(sel.getRangeAt(0).startContainer)) {
      var r = sel.getRangeAt(0);
      r.deleteContents();
      var tn = document.createTextNode(text);
      r.insertNode(tn);
      var nr = document.createRange(); nr.setStartAfter(tn); nr.collapse(true);
      sel.removeAllRanges(); sel.addRange(nr);
    } else {
      seed();
      var lastB = ed.lastChild;
      lastB.appendChild(document.createTextNode(text));
      caretToEnd(lastB);
    }
    liveBlock();
    fireSelectionChange();
    scheduleSave();
    scheduleSnapshot();
    return getValue();
  }
  function getSelection() { return readSelection(); }
  function onSelectionChange(cb) {
    if (typeof cb !== 'function') { return function () {}; }
    selCbs.push(cb);
    return function unsubscribe() {
      var i;
      for (i = 0; i < selCbs.length; i = i + 1) { if (selCbs[i] === cb) { selCbs.splice(i, 1); return; } }
    };
  }
  function focusCanvas() { ed.focus(); }

  // ========================================================================
  // TOP BAR: contextual control (left) + "Saved" cue (right)
  // ========================================================================
  var bar = document.createElement('div');
  bar.className = 'wc-bar';

  var fmt = document.createElement('div');
  fmt.className = 'wc-fmt';
  function addFmtBtn(label, cls, action) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'wc-fmt-btn' + (cls ? ' ' + cls : '');
    b.appendChild(document.createTextNode(label));
    b.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep the selection
    b.addEventListener('click', function (e) { e.preventDefault(); action(); });
    fmt.appendChild(b);
  }
  function afterControlEdit() { fireSelectionChange(); refreshFmt(); scheduleSave(); scheduleSnapshot(); }
  function wrapInline(tag) {
    ed.focus();
    var sel = window.getSelection();
    if (!sel || !sel.rangeCount) { return; }
    var r = sel.getRangeAt(0);
    if (r.collapsed || !ed.contains(r.startContainer)) { return; }
    var txt = sel.toString();
    if (txt === '') { return; }
    var el = document.createElement(tag);
    el.appendChild(document.createTextNode(txt));
    r.deleteContents(); r.insertNode(el);
    var nr = document.createRange(); nr.setStartAfter(el); nr.collapse(true);
    sel.removeAllRanges(); sel.addRange(nr);
    afterControlEdit();
  }
  addFmtBtn('B', 'wc-fmt-b', function () { wrapInline('strong'); });
  addFmtBtn('I', 'wc-fmt-i', function () { wrapInline('em'); });
  addFmtBtn('H', 'wc-fmt-g', function () { applyBlock('h2'); afterControlEdit(); });
  addFmtBtn('•', 'wc-fmt-g', function () { applyBlock('bul'); afterControlEdit(); });
  addFmtBtn('1.', 'wc-fmt-g', function () { applyBlock('num'); afterControlEdit(); });
  addFmtBtn('☐', 'wc-fmt-g', function () { applyBlock('chk'); afterControlEdit(); });
  addFmtBtn('❝', 'wc-fmt-g', function () { applyBlock('quote'); afterControlEdit(); });

  function refreshFmt() {
    var snap = readSelection();
    fmt.className = (snap.hasFocus && snap.start !== snap.end) ? 'wc-fmt wc-fmt-on' : 'wc-fmt';
  }

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
  function autoCueIdle() { cueClear(); cue.className = 'wc-saved'; cueText.firstChild.nodeValue = 'Saved'; }
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
  wrap.insertBefore(bar, ed);

  // ========================================================================
  // AUTOSAVE (core-owned: debounced input + blur) -- reads getValue() markdown
  // ========================================================================
  var report = {
    setLocal: function (ok) { if (ok) { cueSaved(); } else { cueFailed(); } },
    setCloud: function (status) { /* deferred: the cloud-sync twin is a later stage */ }
  };
  function flushSave() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    var v = getValue();
    if (v === lastSaved) { return; }
    lastSaved = v;
    if (trimEdge(v) === '') { return; } // never autosave an empty doc
    if (typeof opts.onSave === 'function') { cueSaving(); opts.onSave(v, report); }
  }
  function scheduleSave() {
    if (saveTimer) { clearTimeout(saveTimer); }
    saveTimer = setTimeout(flushSave, 700);
  }

  // ---- undo/redo: markdown-snapshot stack (decoupled from native undo) ----
  function snapshot() {
    var v = getValue();
    if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== v) {
      undoStack.push(v);
      if (undoStack.length > 300) { undoStack.shift(); }
      redoStack = [];
    }
  }
  function scheduleSnapshot() { if (snapTimer) { clearTimeout(snapTimer); } snapTimer = setTimeout(snapshot, 400); }
  function applyHistory(md) {
    renderMarkdown(ed, md);
    caretToEndOfEditor();
    fireSelectionChange();
    refreshFmt();
    scheduleSave();
  }
  function doUndo() {
    if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; snapshot(); }
    if (undoStack.length <= 1) { return; }
    var cur = undoStack.pop(); redoStack.push(cur);
    applyHistory(undoStack[undoStack.length - 1]);
  }
  function doRedo() {
    if (redoStack.length === 0) { return; }
    var v = redoStack.pop(); undoStack.push(v);
    applyHistory(v);
  }

  // ---- focus mode (the surrounding chrome recedes while writing) ----------
  var focusModeOn = (flags.focusMode !== false);
  function setFocusMode(on) {
    if (!(focusModeOn && document.body && document.body.classList)) { return; }
    if (on) { document.body.classList.add('wc-focus'); } else { document.body.classList.remove('wc-focus'); }
  }

  // ========================================================================
  // WIRING
  // ========================================================================
  function onInput() {
    normalize();
    liveBlock();
    fireSelectionChange();
    refreshFmt();
    scheduleSave();
    scheduleSnapshot();
  }
  function onSelEvent() { fireSelectionChange(); refreshFmt(); }
  function onFocus() { seed(); setFocusMode(true); }
  function onBlur() { setFocusMode(false); flushSave(); refreshFmt(); }
  function onKeyDown(e) {
    var k = e.key || '';
    var mod = e.ctrlKey || e.metaKey;
    var isZ = (k === 'z' || k === 'Z' || e.keyCode === 90);
    var isY = (k === 'y' || k === 'Y' || e.keyCode === 89);
    if (mod && isZ) {
      e.preventDefault();
      if (e.shiftKey) { doRedo(); } else { doUndo(); }
    } else if (mod && isY) {
      e.preventDefault(); doRedo();
    }
  }
  function onPaste(e) {
    var txt = '';
    if (e.clipboardData && e.clipboardData.getData) { txt = e.clipboardData.getData('text/plain') || ''; }
    else if (window.clipboardData && window.clipboardData.getData) { txt = window.clipboardData.getData('Text') || ''; }
    e.preventDefault();
    if (document.execCommand) { document.execCommand('insertText', false, txt); }
    else { insertAtCaret(txt); }
  }
  function onChkClick(e) {
    var li = closestLi(e.target);
    if (!li || !ed.contains(li)) { return; }
    var pl = li.parentNode;
    if (!(pl && pl.className && pl.className.indexOf('wc-chk') !== -1)) { return; }
    var rect = li.getBoundingClientRect();
    if (e.clientX - rect.left < 30) {
      if (li.className.indexOf('wc-on') !== -1) { li.className = trimEdge(li.className.replace(/wc-on/, '')); }
      else { li.className = trimEdge(li.className + ' wc-on'); }
      scheduleSave(); scheduleSnapshot();
    }
  }

  // initial render BEFORE wiring (renderMarkdown sets innerHTML, no input event)
  renderMarkdown(ed, (typeof opts.initialValue === 'string') ? opts.initialValue : '');
  lastSaved = getValue();
  undoStack = [lastSaved];

  ed.addEventListener('input', onInput);
  ed.addEventListener('keyup', onSelEvent);
  ed.addEventListener('mouseup', onSelEvent);
  ed.addEventListener('keydown', onKeyDown);
  ed.addEventListener('focus', onFocus);
  ed.addEventListener('blur', onBlur);
  ed.addEventListener('paste', onPaste);
  ed.addEventListener('click', onChkClick);

  function destroy() {
    ed.removeEventListener('input', onInput);
    ed.removeEventListener('keyup', onSelEvent);
    ed.removeEventListener('mouseup', onSelEvent);
    ed.removeEventListener('keydown', onKeyDown);
    ed.removeEventListener('focus', onFocus);
    ed.removeEventListener('blur', onBlur);
    ed.removeEventListener('paste', onPaste);
    ed.removeEventListener('click', onChkClick);
    cueClear();
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; }
    setFocusMode(false);
    selCbs = [];
    if (wrap.parentNode) { wrap.parentNode.removeChild(wrap); }
  }

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
