// Shared behavior for module pages: term ticks (shared with the map), answer drafts, copy answers.
(function () {
  var KEY = "p357ticks";
  var ticks = {};
  try { ticks = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}

  document.querySelectorAll(".selfcheck input[data-term]").forEach(function (cb) {
    var t = cb.getAttribute("data-term");
    cb.checked = !!ticks[t];
    cb.addEventListener("change", function () {
      ticks[t] = cb.checked;
      try { localStorage.setItem(KEY, JSON.stringify(ticks)); } catch (e) {}
    });
  });

  document.querySelectorAll(".q textarea").forEach(function (ta) {
    var k = "p357draft:" + ta.id;
    try { ta.value = localStorage.getItem(k) || ""; } catch (e) {}
    ta.addEventListener("input", function () {
      try { localStorage.setItem(k, ta.value); } catch (e) {}
    });
  });

  var btn = document.getElementById("copy-answers");
  var msg = document.getElementById("copy-msg");
  if (btn) {
    btn.addEventListener("click", function () {
      var parts = [];
      document.querySelectorAll(".q").forEach(function (q, i) {
        var ta = q.querySelector("textarea");
        parts.push((i + 1) + ". " + (ta && ta.value.trim() ? ta.value.trim() : "(no answer)"));
      });
      var text = document.title + " answers\n\n" + parts.join("\n\n");
      var done = function () { msg.textContent = "Copied. Paste it into the chat for feedback."; };
      var fallback = function () {
        var out = document.getElementById("copy-out");
        out.hidden = false; out.value = text; out.focus(); out.select();
        msg.textContent = "Copy the selected text below and paste it into the chat.";
      };
      try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
    });
  }
})();
