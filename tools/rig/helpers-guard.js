window.__toasts = [];
new MutationObserver(function (ms) { ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
  if (n.className === 'praxis-toast') { window.__toasts.push(n.textContent); } }); }); }).observe(document, { childList: true, subtree: true });
