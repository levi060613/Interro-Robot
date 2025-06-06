export default async function renderStudyPlanPage() {
    const container = document.createElement("div");
    
    container.style.backgroundColor = "#f0f0f0";
    const title = document.createElement("h2");
    title.textContent = "暫時放置";
  
    container.appendChild(title);
  
    return container;
  }