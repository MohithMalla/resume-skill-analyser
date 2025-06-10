const SKILL_SETS = {
  frontend: [
    "HTML", "CSS", "JavaScript", "React", "Redux", "Tailwind", "Bootstrap",
    "Responsive Design", "Figma", "UI/UX", "Accessibility", "Version Control"
  ],
  backend: [
    "Node.js", "Express", "MongoDB", "SQL", "MySQL", "PostgreSQL",
    "REST APIs", "Authentication", "JWT", "ORM", "Docker", "Redis"
  ],
  fullstack: [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB",
    "SQL", "REST APIs", "Git", "Deployment", "API Integration"
  ]
};

function analyzeResume() {
  const category = document.getElementById("categorySelect").value;
  const resumeText = document.getElementById("resumeInput").value.toLowerCase();
  const skillSet = SKILL_SETS[category];

  const matched = [];
  const missing = [];

  skillSet.forEach(skill => {
    if (resumeText.includes(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  renderList("matchedSkills", matched);
  renderList("missingSkills", missing);
  drawRadarChart(skillSet, matched);

  window.lastAnalysis = { category, matched, missing };
}

function renderList(elementId, items) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

function drawRadarChart(skillSet, matchedSkills) {
  const canvas = document.getElementById("skillChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 100;
  const angleStep = (2 * Math.PI) / skillSet.length;

  // Outer polygon
  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  skillSet.forEach((_, i) => {
    const angle = i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();

  // Skill match shape
  ctx.beginPath();
  skillSet.forEach((skill, i) => {
    const angle = i * angleStep;
    const skillRadius = matchedSkills.includes(skill) ? radius : radius * 0.2;
    const x = centerX + skillRadius * Math.cos(angle);
    const y = centerY + skillRadius * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(0, 123, 255, 0.4)";
  ctx.fill();
  ctx.strokeStyle = "#007bff";
  ctx.stroke();

  // Labels
  ctx.fillStyle = "#000";
  ctx.font = "11px sans-serif";
  skillSet.forEach((skill, i) => {
    const angle = i * angleStep;
    const x = centerX + (radius + 15) * Math.cos(angle);
    const y = centerY + (radius + 15) * Math.sin(angle);
    ctx.fillText(skill, x - 20, y);
  });
}

function exportToPDF() {
  const originalTitle = document.title;
  document.title = "Resume Skill Analysis";
  window.print();
  document.title = originalTitle;
}

function downloadAsJSON() {
  if (!window.lastAnalysis) return alert("Run analysis first!");

  const blob = new Blob([JSON.stringify(window.lastAnalysis, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-analysis-${window.lastAnalysis.category}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
