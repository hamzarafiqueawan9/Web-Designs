document.addEventListener("DOMContentLoaded", () => {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".skills-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // remove active from all
      tabBtns.forEach(b => b.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      // add active to clicked
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
});
