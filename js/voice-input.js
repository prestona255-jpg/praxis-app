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

  function attachMicButton(btn, opts) {
    if (!btn) { return; }
    opts = opts || {};
    var onTranscript = typeof opts.onTranscript === 'function'
      ? opts.onTranscript
      : function () {};
    var onError = typeof opts.onError === 'function'
      ? opts.onError
      : function () {};

    if (!SR) {
      btn.disabled = true;
      btn.classList.add('yumi-mic-disabled');
      onError('unsupported');
      return;
    }

    var recognition = null;
    var is_recording = false;
    var is_processing = false;
    var got_result = false;
    var session_settled = false;

    function clearStateClasses() {
      btn.classList.remove('yumi-mic-recording');
      btn.classList.remove('yumi-mic-processing');
    }

    function settleSession() {
      is_recording = false;
      is_processing = false;
      clearStateClasses();
    }

    btn.addEventListener('click', function () {
      if (is_processing) { return; }

      if (is_recording) {
        try {
          if (recognition) { recognition.stop(); }
        } catch (e) {}
        is_recording = false;
        is_processing = true;
        btn.classList.remove('yumi-mic-recording');
        btn.classList.add('yumi-mic-processing');
        return;
      }

      try {
        recognition = new SR();
      } catch (e) {
        settleSession();
        onError('recognition');
        return;
      }

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      got_result = false;
      session_settled = false;

      recognition.onresult = function (event) {
        var i;
        var transcript = '';
        for (i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript = transcript + event.results[i][0].transcript;
          }
        }
        transcript = transcript.replace(/^\s+|\s+$/g, '');
        got_result = true;
        settleSession();
        session_settled = true;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = function (event) {
        var reason;
        if (event && (event.error === 'not-allowed' || event.error === 'service-not-allowed')) {
          reason = 'denied';
        } else {
          reason = 'recognition';
        }
        settleSession();
        session_settled = true;
        onError(reason);
      };

      recognition.onend = function () {
        var was_processing = is_processing;
        var already_settled = session_settled;
        settleSession();
        session_settled = true;
        if (!already_settled && was_processing && !got_result) {
          onError('recognition');
        }
      };

      try {
        recognition.start();
        is_recording = true;
        btn.classList.add('yumi-mic-recording');
      } catch (e) {
        settleSession();
        onError('recognition');
      }
    });
  }

  window.VoiceInput = {
    isSupported:     isSupported,
    attachMicButton: attachMicButton
  };
})();

console.log('voice-input.js loaded');
