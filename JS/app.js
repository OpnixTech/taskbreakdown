const STORAGE_KEY = "taskbreak_projects";

// ================================
// CREATE PROJECT
// ================================

const projectForm = document.getElementById("projectForm");

if (projectForm) {
  projectForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("projectName").value.trim();

    const description = document
      .getElementById("projectDescription")
      .value.trim();

    const deadline = document.getElementById("projectDeadline").value;

    const project = {
      id: Date.now(),

      name: name,

      description: description,

      deadline: deadline,

      tasks: [],
    };

    let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    projects.push(project);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    window.location.href = "index.html";
  });
}

// ================================
// LOAD PROJECTS
// ================================

const projectsGrid = document.getElementById("projectsGrid");

if (projectsGrid) {
  loadProjects();
}

function loadProjects() {
  const projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const projectCount = document.getElementById("projectCount");

  projectCount.textContent = `${projects.length} ${
    projects.length === 1 ? "Project" : "Projects"
  }`;

  // No projects

  if (projects.length === 0) {
    projectsGrid.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📋
                </div>

                <h3>
                    No projects yet
                </h3>

                <p>
                    Create your first project and start
                    breaking it into tasks.
                </p>

                <a
                    href="create-project.html"
                    class="new-project-btn"
                >
                    + Create Project
                </a>

            </div>

        `;

    return;
  }

  // Display projects

  projectsGrid.innerHTML = projects
    .map((project) => createProjectCard(project))
    .join("");
}

// ================================
// PROJECT CARD
// ================================

function createProjectCard(project) {
  const totalTasks = project.tasks.length;

  const completedTasks = project.tasks.filter((task) => task.completed).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return `

        <article class="project-card">

            <div class="project-icon">
                📋
            </div>


            <div class="project-content">

                <h3>
                    ${project.name}
                </h3>


                <p>
                    ${project.description}
                </p>


                <div class="progress-info">

                    <span>
                        ${completedTasks} of ${totalTasks} tasks
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress"
                        style="width: ${progress}%"
                    ></div>

                </div>


                <button
                    class="open-project"
                    onclick="openProject(${project.id})"
                >
                    Open Project →
                </button>

            </div>

        </article>

    `;
}

// ================================
// OPEN PROJECT
// ================================

function openProject(projectId) {
  localStorage.setItem("selected_project", projectId);

  window.location.href = "project.html";
}

// =================================
// PROJECT DASHBOARD
// =================================

const taskList = document.getElementById("taskList");

if (taskList) {
  loadProject();
}

// Get selected project

function getSelectedProject() {
  const projectId = Number(localStorage.getItem("selected_project"));

  const projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  return projects.find((project) => project.id === projectId);
}

// Load project

function loadProject() {
  const project = getSelectedProject();

  if (!project) {
    window.location.href = "index.html";

    return;
  }

  document.getElementById("projectName").textContent = project.name;

  document.getElementById("projectDescription").textContent =
    project.description;

  renderTasks(project);
}

// =================================
// RENDER TASKS
// =================================

function renderTasks(project) {
  const tasks = project.tasks || [];

  const completedTasks = tasks.filter((task) => task.completed).length;

  const progress =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  document.getElementById("progressPercent").textContent = `${progress}%`;

  document.getElementById("taskSummary").textContent =
    `${completedTasks} of ${tasks.length} tasks completed`;

  if (tasks.length === 0) {
    taskList.innerHTML = `

            <div class="empty-tasks">

                <div class="empty-tasks-icon">
                    📝
                </div>

                <h3>
                    No tasks yet
                </h3>

                <p>
                    Add your first task to start
                    breaking down this project.
                </p>

            </div>

        `;

    return;
  }

  taskList.innerHTML = tasks.map((task) => createTaskHTML(task)).join("");

  // Checkbox events

  document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      toggleTask(Number(this.dataset.id));
    });
  });
}

// =================================
// TASK HTML
// =================================

function createTaskHTML(task) {
  const completedClass = task.completed ? "completed" : "";

  const priorityClass = task.priority.toLowerCase();

  return `

        <div class="task-item ${completedClass}">

            <input
                type="checkbox"
                class="task-checkbox"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >


            <div class="task-info">

                <div class="task-name">
                    ${task.name}
                </div>


                <div class="task-meta">

                    <span class="task-category">
                        ${task.category}
                    </span>

                    <span class="task-priority ${priorityClass}">
                        ${task.priority}
                    </span>

                </div>

            </div>

        </div>

    `;
}

// =================================
// TOGGLE TASK
// =================================

function toggleTask(taskId) {
  const projectId = Number(localStorage.getItem("selected_project"));

  let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const project = projects.find((project) => project.id === projectId);

  if (!project) return;

  const task = project.tasks.find((task) => task.id === taskId);

  if (!task) return;

  task.completed = !task.completed;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  renderTasks(project);
}

// =================================
// ADD TASK
// =================================

const addTaskBtn = document.getElementById("addTaskBtn");

const taskModal = document.getElementById("taskModal");

const closeModal = document.getElementById("closeModal");

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", function () {
    taskModal.classList.add("active");
  });
}

if (closeModal) {
  closeModal.addEventListener("click", function () {
    taskModal.classList.remove("active");
  });
}

// =================================
// TASK FORM
// =================================

const taskForm = document.getElementById("taskForm");

if (taskForm) {
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("taskName").value.trim();

    const category = document.getElementById("taskCategory").value;

    const priority = document.getElementById("taskPriority").value;

    const project = getSelectedProject();

    if (!project) return;

    const task = {
      id: Date.now(),

      name: name,

      category: category,

      priority: priority,

      completed: false,
    };

    project.tasks.push(task);

    updateProject(project);

    taskForm.reset();

    taskModal.classList.remove("active");

    renderTasks(project);
  });
}

// =================================
// UPDATE PROJECT
// =================================

function updateProject(updatedProject) {
  let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const index = projects.findIndex(
    (project) => project.id === updatedProject.id,
  );

  if (index === -1) return;

  projects[index] = updatedProject;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
// =================================
// PROJECT TEMPLATES
// =================================

const projectTemplates = {
  website: [
    {
      name: "Define project requirements",
      category: "Planning",
      priority: "High",
    },

    {
      name: "Decide required pages",
      category: "Planning",
      priority: "Medium",
    },

    {
      name: "Collect website content",
      category: "Planning",
      priority: "Medium",
    },

    {
      name: "Create homepage design",
      category: "Design",
      priority: "High",
    },

    {
      name: "Create remaining page designs",
      category: "Design",
      priority: "Medium",
    },

    {
      name: "Create project structure",
      category: "Development",
      priority: "High",
    },

    {
      name: "Build navigation",
      category: "Development",
      priority: "High",
    },

    {
      name: "Build homepage",
      category: "Development",
      priority: "High",
    },

    {
      name: "Build remaining pages",
      category: "Development",
      priority: "Medium",
    },

    {
      name: "Test mobile responsiveness",
      category: "Testing",
      priority: "High",
    },

    {
      name: "Test desktop layout",
      category: "Testing",
      priority: "Medium",
    },

    {
      name: "Fix bugs",
      category: "Testing",
      priority: "High",
    },

    {
      name: "Deploy website",
      category: "Launch",
      priority: "Medium",
    },
  ],

  mobile: [
    {
      name: "Define app requirements",
      category: "Planning",
      priority: "High",
    },

    {
      name: "Plan app screens",
      category: "Planning",
      priority: "High",
    },

    {
      name: "Create UI wireframes",
      category: "Design",
      priority: "Medium",
    },

    {
      name: "Design app screens",
      category: "Design",
      priority: "High",
    },

    {
      name: "Set up development project",
      category: "Development",
      priority: "High",
    },

    {
      name: "Build main screens",
      category: "Development",
      priority: "High",
    },

    {
      name: "Connect app functionality",
      category: "Development",
      priority: "High",
    },

    {
      name: "Test app",
      category: "Testing",
      priority: "High",
    },

    {
      name: "Fix bugs",
      category: "Testing",
      priority: "High",
    },

    {
      name: "Prepare release",
      category: "Launch",
      priority: "Medium",
    },
  ],

  design: [
    {
      name: "Understand project requirements",
      category: "Planning",
      priority: "High",
    },

    {
      name: "Research references",
      category: "Planning",
      priority: "Medium",
    },

    {
      name: "Create design concepts",
      category: "Design",
      priority: "High",
    },

    {
      name: "Create first draft",
      category: "Design",
      priority: "High",
    },

    {
      name: "Review design",
      category: "Design",
      priority: "Medium",
    },

    {
      name: "Apply revisions",
      category: "Design",
      priority: "High",
    },

    {
      name: "Export final files",
      category: "Launch",
      priority: "Medium",
    },
  ],

  marketing: [
    {
      name: "Define target audience",
      category: "Planning",
      priority: "High",
    },

    {
      name: "Research competitors",
      category: "Planning",
      priority: "Medium",
    },

    {
      name: "Create campaign strategy",
      category: "Planning",
      priority: "High",
    },

    {
      name: "Create content",
      category: "Design",
      priority: "High",
    },

    {
      name: "Create campaign graphics",
      category: "Design",
      priority: "Medium",
    },

    {
      name: "Schedule campaign",
      category: "Development",
      priority: "Medium",
    },

    {
      name: "Publish campaign",
      category: "Launch",
      priority: "High",
    },

    {
      name: "Analyze campaign results",
      category: "Testing",
      priority: "Medium",
    },
  ],

  college: [
    {
      name: "Define project topic",
      category: "Planning",
      priority: "High",
    },

    {
      name: "Research the topic",
      category: "Planning",
      priority: "High",
    },

    {
      name: "Prepare project plan",
      category: "Planning",
      priority: "Medium",
    },

    {
      name: "Build project",
      category: "Development",
      priority: "High",
    },

    {
      name: "Test project",
      category: "Testing",
      priority: "High",
    },

    {
      name: "Prepare documentation",
      category: "Documentation",
      priority: "Medium",
    },

    {
      name: "Prepare presentation",
      category: "Documentation",
      priority: "Medium",
    },

    {
      name: "Final project review",
      category: "Testing",
      priority: "High",
    },
  ],
};

// =================================
// BREAKDOWN MODALS
// =================================

const breakdownBtn = document.getElementById("breakdownBtn");

const breakdownModal = document.getElementById("breakdownModal");

const closeBreakdown = document.getElementById("closeBreakdown");

const templateOption = document.getElementById("templateOption");

const aiOption = document.getElementById("aiOption");

const templateModal = document.getElementById("templateModal");

const closeTemplate = document.getElementById("closeTemplate");

// Open breakdown

if (breakdownBtn) {
  breakdownBtn.addEventListener("click", function () {
    breakdownModal.classList.add("active");
  });
}

// Close breakdown

if (closeBreakdown) {
  closeBreakdown.addEventListener("click", function () {
    breakdownModal.classList.remove("active");
  });
}

// Open templates

if (templateOption) {
  templateOption.addEventListener("click", function () {
    breakdownModal.classList.remove("active");

    templateModal.classList.add("active");
  });
}

// Close templates

if (closeTemplate) {
  closeTemplate.addEventListener("click", function () {
    templateModal.classList.remove("active");
  });
}

// =================================
// AI BREAKDOWN MODAL
// =================================

const aiModal = document.getElementById("aiModal");
const closeAi = document.getElementById("closeAi");
const aiProjectName = document.getElementById("aiProjectName");
const aiProjectDescription = document.getElementById("aiProjectDescription");

if (aiOption) {
  aiOption.addEventListener("click", function () {
    const project = getSelectedProject();

    if (!project) {
      alert("Project not found.");
      return;
    }

    // Show current project information
    aiProjectName.textContent = project.name;

    aiProjectDescription.textContent =
      project.description || "No project description provided.";

    // Close breakdown modal
    breakdownModal.classList.remove("active");

    // Open AI modal
    aiModal.classList.add("active");
  });
}

if (closeAi) {
  closeAi.addEventListener("click", function () {
    aiModal.classList.remove("active");
  });
}
// =================================
// APPLY TEMPLATE
// =================================

document.querySelectorAll(".template-card").forEach((card) => {
  card.addEventListener("click", function () {
    const templateName = this.dataset.template;

    const template = projectTemplates[templateName];

    if (!template) return;

    const project = getSelectedProject();

    if (!project) return;

    // Add template tasks
    template.forEach((taskData) => {
      project.tasks.push({
        id: Date.now() + Math.random(),

        name: taskData.name,

        category: taskData.category,

        priority: taskData.priority,

        completed: false,
      });
    });

    updateProject(project);

    templateModal.classList.remove("active");

    renderTasks(project);
  });
});

// =================================
// DOWNLOAD PROJECT PDF
// =================================

const downloadPdfBtn = document.getElementById("downloadPdfBtn");

if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener("click", function () {
    const project = getSelectedProject();

    if (!project) {
      alert("Project not found.");
      return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    // Project title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(project.name, 20, y);

    y += 10;

    // Description
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    if (project.description) {
      doc.text(project.description, 20, y, {
        maxWidth: 170,
      });

      y += 15;
    }

    // Deadline
    doc.setFont("helvetica", "bold");
    doc.text("Deadline: " + (project.deadline || "Not set"), 20, y);

    y += 10;

    // Progress
    const totalTasks = project.tasks.length;

    const completedTasks = project.tasks.filter(
      (task) => task.completed,
    ).length;

    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    doc.text("Progress: " + progress + "%", 20, y);

    y += 15;

    // Tasks heading
    doc.setFontSize(16);
    doc.text("Tasks", 20, y);

    y += 10;

    // Tasks
    doc.setFontSize(11);

    project.tasks.forEach((task, index) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }

      const status = task.completed ? "[Completed]" : "[Pending]";

      const taskText =
        index +
        1 +
        ". " +
        task.name +
        " - " +
        task.category +
        " - " +
        task.priority +
        " " +
        status;

      doc.text(taskText, 20, y, {
        maxWidth: 170,
      });

      y += 8;
    });

    // Download
    const fileName =
      project.name.replace(/[^a-z0-9]/gi, "-") + "-TaskBreak.pdf";

    doc.save(fileName);
  });
}

// =================================
// AI BREAKDOWN - GENERATE TASKS
// =================================

// =================================
// AI BREAKDOWN - REAL GEMINI AI
// =================================

const generateAiBtn =
  document.getElementById("generateAiBtn");

const aiResults =
  document.getElementById("aiResults");

const aiTaskList =
  document.getElementById("aiTaskList");


// =================================
// GENERATE AI TASKS
// =================================

if (generateAiBtn) {

  generateAiBtn.addEventListener(
    "click",
    async function () {

      const project = getSelectedProject();

      if (!project) {
        alert("Project not found.");
        return;
      }


      // Get selected detail
      const detail =
        document.getElementById("aiDetail").value;


      // Loading state
      generateAiBtn.disabled = true;

      generateAiBtn.textContent =
        "✨ Generating...";


      try {

        // =================================
        // SEND PROJECT TO BACKEND
        // =================================

        const response = await fetch(
          "https://taskbreakdown.onrender.com/api/breakdown",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({

              projectName:
                project.name,

              projectDescription:
                project.description || "",

              detail:
                detail

            })
          }
        );


        // =================================
        // GET RESPONSE
        // =================================

        const data =
          await response.json();


        // Check for backend error
        if (!response.ok) {

          throw new Error(
            data.error ||
            "Failed to generate AI breakdown."
          );

        }


        // =================================
        // CHECK AI TASKS
        // =================================

        if (
          !data.tasks ||
          !Array.isArray(data.tasks) ||
          data.tasks.length === 0
        ) {

          throw new Error(
            "No tasks were generated."
          );

        }


        // =================================
        // SAVE AI TASKS
        // =================================

        window.generatedTasks =
          data.tasks;


        // =================================
        // CLEAR OLD RESULTS
        // =================================

        aiTaskList.innerHTML = "";


        // =================================
        // DISPLAY AI TASKS
        // =================================

        window.generatedTasks.forEach(
          function (task, index) {

            const taskHTML = `

              <label class="ai-task-item">

                <input
                  type="checkbox"
                  value="${index}"
                >

                <span class="ai-task-info">

                  <span class="ai-task-name">
                    ${task.name}
                  </span>

                  <span class="ai-task-meta">

                    <span class="ai-task-category">
                      ${task.category}
                    </span>

                    <span class="ai-task-priority">
                      ${task.priority}
                    </span>

                  </span>

                </span>

              </label>

            `;


            aiTaskList.insertAdjacentHTML(
              "beforeend",
              taskHTML
            );

          }
        );


        // =================================
        // SHOW RESULTS
        // =================================

        aiResults.style.display =
          "block";


        // Change button text
        generateAiBtn.textContent =
          "✨ Regenerate Breakdown";


      } catch (error) {

        console.error(
          "AI Breakdown Error:",
          error
        );


        alert(
          "Unable to generate AI breakdown.\n\n" +
          error.message
        );


        generateAiBtn.textContent =
          "✨ Generate Breakdown";

      } finally {

        generateAiBtn.disabled =
          false;

      }

    }
  );

}


// =================================
// ADD SELECTED AI TASKS
// =================================

const addAiTasksBtn =
  document.getElementById(
    "addAiTasksBtn"
  );


if (addAiTasksBtn) {

  addAiTasksBtn.addEventListener(
    "click",
    function () {

      const project =
        getSelectedProject();


      // =================================
      // CHECK PROJECT
      // =================================

      if (!project) {

        alert(
          "Project not found."
        );

        return;

      }


      // =================================
      // CHECK GENERATED TASKS
      // =================================

      if (
        !window.generatedTasks ||
        window.generatedTasks.length === 0
      ) {

        alert(
          "Please generate AI tasks first."
        );

        return;

      }


      // =================================
      // FIND SELECTED TASKS
      // =================================

      const selectedTasks =
        aiTaskList.querySelectorAll(
          'input[type="checkbox"]:checked'
        );


      if (selectedTasks.length === 0) {

        alert(
          "Please select at least one task."
        );

        return;

      }


      // =================================
      // ADD SELECTED TASKS TO PROJECT
      // =================================

      selectedTasks.forEach(
        function (checkbox) {

          const taskIndex =
            Number(checkbox.value);


          const taskData =
            window.generatedTasks[
              taskIndex
            ];


          if (!taskData) {
            return;
          }


          project.tasks.push({

            id:
              Date.now() +
              Math.random(),

            name:
              taskData.name,

            category:
              taskData.category,

            priority:
              taskData.priority,

            completed:
              false

          });

        }
      );


      // =================================
      // SAVE PROJECT
      // =================================

      updateProject(project);


      // =================================
      // REFRESH TASKS
      // =================================

      renderTasks(project);


      // =================================
      // CLOSE AI MODAL
      // =================================

      if (aiModal) {

        aiModal.classList.remove(
          "active"
        );

      }


      // =================================
      // SUCCESS MESSAGE
      // =================================

      alert(
        selectedTasks.length +
        " task(s) added successfully!"
      );


      // =================================
      // CLEAR GENERATED TASKS
      // =================================

      window.generatedTasks = [];

    }
  );

}