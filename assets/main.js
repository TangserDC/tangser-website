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
    function applyFilter(f) {
      if (!f || f === "all") f = "all";
      filterBtns.forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-filter") === f); });
      workCards.forEach(function (card) {
        var tags = card.getAttribute("data-tags") || "";
        card.style.display = (f === "all" || tags.indexOf(f) > -1) ? "" : "none";
      });
    }
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter"));
        if (history.replaceState) history.replaceState(null, "", "#" + btn.getAttribute("data-filter"));
      });
    });
    /* 支持从其他页带 hash 跳转（如 listings.html#unity） */
    var hash = location.hash ? location.hash.slice(1) : "all";
    if (hash !== "all") {
      var match = document.querySelector('.filter-btn[data-filter="' + hash + '"]');
      if (match) applyFilter(hash);
    }
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

  /* 作品集视频：点击播放/暂停（不做自动播放，封面常驻显示） */
  var workVideos = document.querySelectorAll(".work-thumb video");
  if (workVideos.length) {
    workVideos.forEach(function (v) {
      var thumb = v.closest(".work-thumb");
      thumb.classList.add("has-video");
      v.addEventListener("play", function () { thumb.classList.add("playing"); });
      v.addEventListener("pause", function () { thumb.classList.remove("playing"); });
      v.addEventListener("click", function () {
        if (v.paused) {
          v.play().catch(function () { });
        } else {
          v.pause();
        }
      });
      /* 点击封面区域同样可播放 */
      thumb.addEventListener("click", function (e) {
        if (e.target === v) return;
        if (v.paused) {
          v.play().catch(function () { });
        } else {
          v.pause();
        }
      });
    });
  }

  /* 页脚年份 */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
