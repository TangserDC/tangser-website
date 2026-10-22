/* ============================================================
   Tangser 技术博客 — 全站交互脚本
   ============================================================ */
(function () {
  "use strict";

  /* 页眉滚动状态 */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 移动端菜单 */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("open");
        nav.classList.remove("open");
      });
    });
  }

  /* FAQ 手风琴 */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) { o.classList.remove("open"); });
      if (!open) item.classList.add("open");
    });
  });

  /* 作品集筛选 */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var workCards = document.querySelectorAll(".work-card");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        workCards.forEach(function (card) {
          var tags = card.getAttribute("data-tags") || "";
          card.style.display = (f === "all" || tags.indexOf(f) > -1) ? "" : "none";
        });
      });
    });
  }

  /* 联系表单验证 */
  var form = document.querySelector("#contact-form");
  var successBox = document.querySelector("#form-success");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[data-rule]").forEach(function (input) {
        var rule = input.getAttribute("data-rule");
        var field = input.closest(".field");
        var val = input.value.trim();
        var bad = false;
        if (rule.indexOf("required") > -1 && !val) bad = true;
        if (val && rule.indexOf("email") > -1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) bad = true;
        if (val && rule.indexOf("phone") > -1 && !/^[\d+\-\s]{6,20}$/.test(val)) bad = true;
        field.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) {
        showToast("请检查标记的字段是否填写正确");
        return;
      }
      form.style.display = "none";
      if (successBox) successBox.classList.add("show");
      showToast("提交成功，我们会尽快与您联系");
    });
  }

  /* Toast */
  var toastEl = null;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.innerHTML = '<span class="dot"></span><span></span>';
      document.body.appendChild(toastEl);
    }
    toastEl.querySelector("span:last-child").textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }
  window.TangserToast = showToast;

  /* 页脚年份 */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
