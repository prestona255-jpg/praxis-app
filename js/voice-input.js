// =====================================================================
// voice-input.js -- Web Speech API wrapper for voice capture.
// Stage 2.5: tap-to-toggle mic button. Final transcripts only.
// Adapted from HQ-DEPLOY/js/voice-input.js with Praxis conventions
// (CSS classes for state, callback-based onTranscript/onError, no
// inline styles, no hardcoded DOM ids). var/function only.
// =====================================================================

'use strict';

(function () {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  function isSupported() {
    return !!SR;
  }

  // listen(opts) -> controller {stop, abort}. Starts ONE single-utterance
  // recognition session. This is the SOLE SpeechRecognition site -- both the
  // push-to-talk hold and the hands-free re-arm loop go through here, so the
  // engine is never duplicated. opts: onStart (recognition began),
  // onTranscript(text) (a final transcript), onError(reason), onEnd (session
  // ended for any reason). The caller decides what to do (auto-send, re-arm).
  function listen(opts) {
    opts = opts || {};
    var onStart      = typeof opts.onStart === 'function'      ? opts.onStart      : function () {};
    var onTranscript = typeof opts.onTranscript === 'function' ? opts.onTranscript : function () {};
    var onError      = typeof opts.onError === 'function'      ? opts.onError      : function () {};
    var onEnd        = typeof opts.onEnd === 'function'        ? opts.onEnd        : function () {};

    var noop = { stop: function () {}, abort: function () {} };
    if (!SR) { onError('unsupported'); onEnd(); return noop; }

    var recognition;
    try {
      recognition = new SR();
    } catch (e) {
      onError('recognition');
      onEnd();
      return noop;
    }

    recognition.continuous = false;     // single utterance; hands-free re-arms
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    var ended = false;
    function fireEnd() {
      if (ended) { return; }
      ended = true;
      onEnd();
    }

    recognition.onresult = function (event) {
      var i;
      var transcript = '';
      for (i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript = transcript + event.results[i][0].transcript;
        }
      }
      transcript = transcript.replace(/^\s+|\s+$/g, '');
      if (transcript) { onTranscript(transcript); }
    };

    recognition.onerror = function (event) {
      var reason;
      if (event && (event.error === 'not-allowed' || event.error === 'service-not-allowed')) {
        reason = 'denied';
      } else if (event && event.error === 'no-speech') {
        reason = 'no-speech';
      } else {
        reason = 'recognition';
      }
      onError(reason);
    };

    recognition.onend = function () { fireEnd(); };

    try {
      recognition.start();
      onStart();
    } catch (e) {
      onError('recognition');
      fireEnd();
      return noop;
    }

    return {
      stop:  function () { try { recognition.stop(); }  catch (e) {} },
      abort: function () { try { recognition.abort(); } catch (e) {} }
    };
  }

  // attachMicButton(btn, opts) -- wire a mic button onto listen(). opts.mode:
  //   'toggle' (default): click starts; click again stops (legacy behavior).
  //   'push': press-and-hold (pointerdown starts, release stops).
  // opts: onStart, onTranscript, onError. The recording/processing classes
  // drive the affordance. (The Yumi panel orchestrates the mic directly via
  // VoiceInput.listen for the talkMode branch + the TTS-coupled re-arm loop.)
  function attachMicButton(btn, opts) {
    if (!btn) { return; }
    opts = opts || {};
    var mode = (opts.mode === 'push') ? 'push' : 'toggle';
    var onStart      = typeof opts.onStart === 'function'      ? opts.onStart      : function () {};
    var onTranscript = typeof opts.onTranscript === 'function' ? opts.onTranscript : function () {};
    var onError      = typeof opts.onError === 'function'      ? opts.onError      : function () {};

    if (!SR) {
      btn.disabled = true;
      btn.classList.add('yumi-mic-disabled');
      onError('unsupported');
      return;
    }

    var controller = null;
    var listening = false;

    function start() {
      if (listening) { return; }
      listening = true;
      btn.classList.add('yumi-mic-recording');
      controller = listen({
        onStart:      onStart,
        onTranscript: onTranscript,
        onError: function (reason) {
          listening = false;
          btn.classList.remove('yumi-mic-recording');
          btn.classList.remove('yumi-mic-processing');
          onError(reason);
        },
        onEnd: function () {
          listening = false;
          btn.classList.remove('yumi-mic-recording');
          btn.classList.remove('yumi-mic-processing');
        }
      });
    }

    function stop() {
      if (!listening) { return; }
      btn.classList.remove('yumi-mic-recording');
      btn.classList.add('yumi-mic-processing');
      if (controller) { controller.stop(); }
    }

    if (mode === 'push') {
      btn.addEventListener('pointerdown', function (e) { e.preventDefault(); start(); });
      btn.addEventListener('pointerup',     function () { stop(); });
      btn.addEventListener('pointerleave',  function () { stop(); });
      btn.addEventListener('pointercancel', function () { stop(); });
    } else {
      btn.addEventListener('click', function () {
        if (listening) { stop(); } else { start(); }
      });
    }
  }

  window.VoiceInput = {
    isSupported:     isSupported,
    attachMicButton: attachMicButton,
    listen:          listen
  };
})();

console.log('voice-input.js loaded');
