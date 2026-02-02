
  document.getElementsByClassName("about-cv").addEventListener("click", function() {
    window.open("Hamza Rafique.pdf", "_blank"); 
    // Replace "my_cv.pdf" with the actual path to your CV
  }); 

 document.addEventListener('DOMContentLoaded', () => {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const tabs = skillsSection.querySelectorAll('.skills-tab');
  const panels = skillsSection.querySelectorAll('.skills-panel');

  function openPanel(id) {
    panels.forEach(p => {
      p.classList.toggle('active', p.id === id);
      // restart bar animation by forcing reflow each time a panel becomes active
      if (p.id === id) {
        const fills = p.querySelectorAll('.skillbar-fill');
        fills.forEach(f => {
          f.style.animation = 'none';
          // force reflow
          // eslint-disable-next-line no-unused-expressions
          f.offsetHeight;
          f.style.animation = 'fillGrow .9s ease forwards, hueShift 6s linear infinite';
        });
      }
    });
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      openPanel(targetId);
    });
  });
});



