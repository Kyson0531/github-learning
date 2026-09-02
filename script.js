(() => {
  const EMAIL = "858154849@qq.com";

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  function flashCopied(btn) {
    const label = btn.querySelector(".email-pill-label");
    const done = btn.querySelector(".email-pill-done");
    btn.classList.add("is-copied");
    if (label) label.hidden = true;
    if (done) done.hidden = false;
    window.clearTimeout(btn._copyTimer);
    btn._copyTimer = window.setTimeout(() => {
      btn.classList.remove("is-copied");
      if (label) label.hidden = false;
      if (done) done.hidden = true;
    }, 1600);
  }

  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-email") || EMAIL;
      try {
        await copyText(email);
        flashCopied(btn);
      } catch {
        window.prompt("复制邮箱：", email);
      }
    });
  });
})();
