/*
 * app.js — 应用主逻辑：课程树渲染、路由、进度持久化、测验计分。
 *
 * 数据模型（由 js/content/*.js 填充到全局 COURSE_MODULES）：
 * COURSE_MODULES = [
 *   {
 *     id: 'm0', title: '开始之前', icon: '👋',
 *     lessons: [
 *       {
 *         id: 'm0-l1', title: '...', type: 'learn',
 *         learnHtml: '<h3>...</h3><p>...</p>',
 *         practice: {               // 可选
 *           noExec: false,          // true = 概念向练习，不走Pyodide执行（用于模块7）
 *           prompt: '...',
 *           starterCode: 'x = 1',
 *           setupCode: '...',       // 可选，静默执行
 *           checkCode: 'python code 设置 __CHECK_RESULT__',
 *           packages: ['pandas'],   // 可选
 *           choices: [...]          // noExec=true 时，走选择题式练习
 *         }
 *       },
 *       {
 *         id: 'm0-quiz', title: '模块小测', type: 'quiz',
 *         quiz: { questions: [ { q: '...', options: [...], answerIndex: 0, explain: '...' } ] }
 *       }
 *     ]
 *   },
 *   ...
 * ]
 */

const App = (() => {
  const STORAGE_KEY = "ai_trainer_course_progress_v1";
  let state = null;
  let currentModuleId = null;
  let currentLessonId = null;
  let cmEditor = null;
  let flatLessons = []; // [{moduleIdx, lessonIdx, moduleId, lessonId}]

  function defaultState() {
    return {
      completedLessons: {},   // lessonId -> true
      quizScores: {},         // lessonId -> {score, total}
      xp: 0,
      unlockedModuleIndex: 0, // 可进入的模块下标上限（含）
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {}
    return defaultState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function buildFlatList() {
    flatLessons = [];
    COURSE_MODULES.forEach((mod, mi) => {
      mod.lessons.forEach((les, li) => {
        flatLessons.push({ moduleIdx: mi, lessonIdx: li, moduleId: mod.id, lessonId: les.id });
      });
    });
  }

  function isModuleUnlocked(moduleIdx) {
    return moduleIdx <= state.unlockedModuleIndex;
  }

  function isLessonDone(lessonId) {
    return !!state.completedLessons[lessonId];
  }

  function moduleProgress(mod) {
    const total = mod.lessons.length;
    const done = mod.lessons.filter((l) => isLessonDone(l.id)).length;
    return { done, total };
  }

  function overallProgress() {
    let total = 0, done = 0;
    COURSE_MODULES.forEach((mod) => {
      mod.lessons.forEach((l) => {
        total++;
        if (isLessonDone(l.id)) done++;
      });
    });
    return total ? Math.round((done / total) * 100) : 0;
  }

  function addXp(n) {
    state.xp += n;
    saveState();
    renderTopBar();
  }

  function maybeUnlockNextModule(moduleIdx) {
    const mod = COURSE_MODULES[moduleIdx];
    const allDone = mod.lessons.every((l) => isLessonDone(l.id));
    if (allDone && state.unlockedModuleIndex < moduleIdx + 1 && moduleIdx + 1 < COURSE_MODULES.length) {
      state.unlockedModuleIndex = moduleIdx + 1;
      saveState();
    }
  }

  // ---------- 渲染：顶部栏 ----------
  function renderTopBar() {
    document.getElementById("xp-count").textContent = state.xp;
    const pct = overallProgress();
    document.getElementById("global-progress-bar").style.width = pct + "%";
    document.getElementById("global-progress-text").textContent = pct + "%";
  }

  // ---------- 渲染：侧边栏课程树 ----------
  function renderSidebar() {
    const tree = document.getElementById("course-tree");
    tree.innerHTML = "";
    COURSE_MODULES.forEach((mod, mi) => {
      const unlocked = isModuleUnlocked(mi);
      const { done, total } = moduleProgress(mod);
      const group = document.createElement("div");
      group.className = "module-group" + (unlocked ? "" : " locked");
      const isCurrentModule = mod.id === currentModuleId;
      if (isCurrentModule) group.classList.add("open");

      const header = document.createElement("div");
      header.className = "module-header";
      header.innerHTML = `
        <span class="mod-icon">${mod.icon}</span>
        <span class="mod-title">${mod.title}</span>
        <span class="mod-progress-mini">${done}/${total}</span>
        <span class="mod-caret">▶</span>
      `;
      header.addEventListener("click", () => {
        if (!unlocked) return;
        group.classList.toggle("open");
      });
      group.appendChild(header);

      const list = document.createElement("div");
      list.className = "lesson-list";
      mod.lessons.forEach((les) => {
        const item = document.createElement("div");
        item.className = "lesson-item" + (isLessonDone(les.id) ? " done" : "");
        if (les.id === currentLessonId) item.classList.add("active");
        const icon = les.type === "quiz" ? "📝" : "📖";
        item.innerHTML = `<span class="lesson-check">${isLessonDone(les.id) ? "✓" : ""}</span>${icon} ${les.title}`;
        if (unlocked) {
          item.addEventListener("click", () => selectLesson(mod.id, les.id));
        } else {
          item.style.cursor = "not-allowed";
        }
        list.appendChild(item);
      });
      group.appendChild(list);
      tree.appendChild(group);
    });
  }

  // ---------- 路由 ----------
  function findLesson(moduleId, lessonId) {
    const mod = COURSE_MODULES.find((m) => m.id === moduleId);
    if (!mod) return null;
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    return { mod, lesson };
  }

  function selectLesson(moduleId, lessonId) {
    currentModuleId = moduleId;
    currentLessonId = lessonId;
    renderSidebar();
    renderLessonBody();
    document.getElementById("content-panel").scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderLessonBody() {
    const { mod, lesson } = findLesson(currentModuleId, currentLessonId);
    document.getElementById("lesson-title").textContent = `${mod.icon} ${mod.title} · ${lesson.title}`;

    const tabsEl = document.getElementById("lesson-tabs");
    const learnTab = document.getElementById("tab-learn");
    const practiceTab = document.getElementById("tab-practice");
    const quizTab = document.getElementById("tab-quiz");

    if (lesson.type === "quiz") {
      tabsEl.classList.add("hidden");
      learnTab.classList.add("hidden");
      practiceTab.classList.add("hidden");
      quizTab.classList.remove("hidden");
      renderQuiz(lesson);
    } else {
      tabsEl.classList.remove("hidden");
      const hasPractice = !!lesson.practice;
      // 重置为“讲解”tab
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelector('.tab-btn[data-tab="learn"]').classList.add("active");
      learnTab.classList.remove("hidden");
      practiceTab.classList.add("hidden");
      quizTab.classList.add("hidden");

      document.querySelector('.tab-btn[data-tab="practice"]').style.display = hasPractice ? "" : "none";
      learnTab.innerHTML = `<div class="lesson-prose">${lesson.learnHtml}</div>`;
      if (hasPractice) renderPractice(lesson.practice);
    }

    renderLessonNav();
  }

  function switchTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tabName));
    ["learn", "practice", "quiz"].forEach((t) => {
      document.getElementById(`tab-${t}`).classList.toggle("hidden", t !== tabName);
    });
    if (tabName === "practice" && cmEditor) {
      setTimeout(() => cmEditor.refresh(), 10);
    }
  }

  // ---------- 练习渲染（可执行 or 概念向） ----------
  function renderPractice(practice) {
    const container = document.getElementById("practice-container");
    container.innerHTML = "";
    cmEditor = null;

    if (practice.noExec) {
      renderConceptPractice(practice, container);
      return;
    }

    const card = document.createElement("div");
    card.className = "practice-card";
    card.innerHTML = `
      <div class="practice-prompt">${practice.prompt}</div>
      <textarea id="code-editor"></textarea>
      <div class="practice-actions">
        <button class="btn btn-run" id="run-btn">▶ 运行代码</button>
        <button class="btn btn-ghost" id="reset-code-btn">重置代码</button>
      </div>
      <div class="run-result" id="run-result"></div>
      <details class="reveal-answer"><summary>查看参考答案</summary><pre>${escapeHtml(practice.referenceCode || practice.starterCode)}</pre></details>
    `;
    container.appendChild(card);

    cmEditor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
      mode: "python",
      theme: "dracula",
      lineNumbers: true,
      indentUnit: 4,
      viewportMargin: Infinity,
    });
    cmEditor.setValue(practice.starterCode);

    document.getElementById("reset-code-btn").addEventListener("click", () => {
      cmEditor.setValue(practice.starterCode);
      document.getElementById("run-result").innerHTML = "";
    });

    document.getElementById("run-btn").addEventListener("click", async () => {
      const runBtn = document.getElementById("run-btn");
      const resultEl = document.getElementById("run-result");
      if (!PyRunner.isReady()) {
        resultEl.innerHTML = `<div class="result-error">Python 运行环境还没准备好，请稍候片刻再试。</div>`;
        return;
      }
      runBtn.disabled = true;
      runBtn.textContent = "⏳ 运行中...";
      resultEl.innerHTML = "";

      const userCode = cmEditor.getValue();
      try {
        const res = await PyRunner.runExercise({
          setupCode: practice.setupCode,
          userCode,
          checkCode: practice.checkCode,
          packages: practice.packages,
        });
        renderRunResult(res, resultEl, practice);
      } catch (e) {
        resultEl.innerHTML = `<div class="result-error">运行出现意外错误：${escapeHtml(String(e))}</div>`;
      }
      runBtn.disabled = false;
      runBtn.textContent = "▶ 运行代码";
    });
  }

  function renderRunResult(res, resultEl, practice) {
    let html = "";
    if (res.stage === "user" && res.error) {
      html += `<div class="result-error">代码运行出错：\n${escapeHtml(res.error)}</div>`;
    } else {
      if (res.stdout && res.stdout.trim()) {
        html += `<div class="output-block">${escapeHtml(res.stdout.trim())}</div>`;
      }
      if (res.figures && res.figures.length) {
        res.figures.forEach((b64) => {
          html += `<img src="data:image/png;base64,${b64}" style="max-width:100%;border-radius:10px;margin-top:10px;" />`;
        });
      }
      if (res.passed) {
        html += `<div class="result-pass">✅ ${escapeHtml(res.message || "通过！做得好。")}</div>`;
        markLessonPassedPractice();
      } else {
        html += `<div class="result-fail">❌ ${escapeHtml(res.message || "还不太对，再检查一下。")}</div>`;
      }
    }
    resultEl.innerHTML = html;
  }

  function markLessonPassedPractice() {
    // 练习通过本身不强制标记完成课程，由学生点击“完成本课”确认，
    // 但给与少量XP奖励一次（避免重复刷分，用 sessionStorage 记录）
    const key = "xp_awarded_" + currentLessonId;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      addXp(5);
    }
  }

  function renderConceptPractice(practice, container) {
    container.innerHTML = `<div class="practice-no-exec">💡 这是概念向练习：ONNX 模型推理等真题涉及的库在浏览器环境里无法真实运行，这里改为"代码阅读 + 判断"的方式帮你理解流程。</div>`;
    const card = document.createElement("div");
    card.className = "practice-card";
    card.innerHTML = `<div class="practice-prompt">${practice.prompt}</div><div class="code-block">${escapeHtml(practice.codeToRead || "")}</div>`;
    container.appendChild(card);

    if (practice.choices) {
      const qCard = document.createElement("div");
      qCard.className = "practice-card";
      let selected = -1;
      qCard.innerHTML = `
        <div class="practice-prompt">${practice.choiceQuestion}</div>
        <div class="quiz-options" id="concept-options"></div>
        <div class="practice-actions"><button class="btn btn-run" id="concept-submit">提交答案</button></div>
        <div class="run-result" id="concept-result"></div>
      `;
      container.appendChild(qCard);
      const optWrap = qCard.querySelector("#concept-options");
      practice.choices.forEach((opt, idx) => {
        const o = document.createElement("div");
        o.className = "quiz-option";
        o.textContent = opt;
        o.addEventListener("click", () => {
          selected = idx;
          optWrap.querySelectorAll(".quiz-option").forEach((el, i) => el.classList.toggle("selected", i === idx));
        });
        optWrap.appendChild(o);
      });
      qCard.querySelector("#concept-submit").addEventListener("click", () => {
        const resEl = qCard.querySelector("#concept-result");
        if (selected === -1) {
          resEl.innerHTML = `<div class="result-fail">请先选择一个选项。</div>`;
          return;
        }
        if (selected === practice.answerIndex) {
          resEl.innerHTML = `<div class="result-pass">✅ 回答正确！${escapeHtml(practice.explain || "")}</div>`;
          markLessonPassedPractice();
        } else {
          resEl.innerHTML = `<div class="result-fail">❌ 还不太对。${escapeHtml(practice.explain || "")}</div>`;
        }
      });
    }
  }

  // ---------- 测验渲染 ----------
  function renderQuiz(lesson) {
    const container = document.getElementById("quiz-container");
    const prevScore = state.quizScores[lesson.id];
    const answers = new Array(lesson.quiz.questions.length).fill(-1);
    let submitted = false;
    const isTimed = !!lesson.quiz.timeLimitMinutes;
    let secondsLeft = isTimed ? lesson.quiz.timeLimitMinutes * 60 : 0;
    let timerHandle = null;

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec < 10 ? "0" : ""}${sec}`;
    }

    function stopTimer() {
      if (timerHandle) {
        clearInterval(timerHandle);
        timerHandle = null;
      }
    }

    function startTimer() {
      if (!isTimed || submitted) return;
      stopTimer();
      timerHandle = setInterval(() => {
        secondsLeft--;
        const timerEl = document.getElementById("quiz-timer");
        if (timerEl) timerEl.textContent = `⏱ 剩余时间 ${formatTime(Math.max(secondsLeft, 0))}`;
        if (secondsLeft <= 0) {
          stopTimer();
          doSubmit();
        }
      }, 1000);
    }

    function doSubmit() {
      if (submitted) return;
      const score = answers.reduce((acc, a, i) => acc + (a === lesson.quiz.questions[i].answerIndex ? 1 : 0), 0);
      const total = lesson.quiz.questions.length;
      submitted = true;
      stopTimer();
      state.quizScores[lesson.id] = { score, total };
      const passThreshold = Math.ceil(total * 0.6);
      if (score >= passThreshold && !isLessonDone(lesson.id)) {
        state.completedLessons[lesson.id] = true;
        addXp(isTimed ? 50 : 20);
        const modIdx = COURSE_MODULES.findIndex((m) => m.id === currentModuleId);
        maybeUnlockNextModule(modIdx);
      }
      saveState();
      renderSidebar();
      renderTopBar();
      renderLessonNav();
      draw();
    }

    function draw() {
      let html = "";
      if (isTimed && !submitted) {
        html += `<div class="quiz-timer-banner" id="quiz-timer">⏱ 剩余时间 ${formatTime(secondsLeft)}</div>`;
      }
      if (submitted) {
        const score = answers.reduce((acc, a, i) => acc + (a === lesson.quiz.questions[i].answerIndex ? 1 : 0), 0);
        const total = lesson.quiz.questions.length;
        const pct = Math.round((score / total) * 100);
        html += `
          <div class="quiz-result-banner">
            <div class="score-num">${score} / ${total}</div>
            <div>正确率 ${pct}%</div>
          </div>`;
      } else if (prevScore) {
        html += `<div class="quiz-progress">上次成绩：${prevScore.score} / ${prevScore.total}，可以重新测验以巩固记忆。</div>`;
      }

      lesson.quiz.questions.forEach((q, qi) => {
        html += `<div class="quiz-card" data-qi="${qi}">
          <div class="quiz-q-text">${qi + 1}. ${q.q}</div>
          <div class="quiz-options">
            ${q.options.map((opt, oi) => {
              let cls = "quiz-option";
              if (submitted) {
                if (oi === q.answerIndex) cls += " correct";
                else if (oi === answers[qi]) cls += " incorrect";
              } else if (answers[qi] === oi) {
                cls += " selected";
              }
              return `<div class="${cls}" data-qi="${qi}" data-oi="${oi}">${opt}</div>`;
            }).join("")}
          </div>
          ${submitted ? `<div class="quiz-explain"><strong>解析：</strong>${q.explain || ""}</div>` : ""}
        </div>`;
      });

      html += `<div class="quiz-submit-area">
        <span style="font-size:13px;color:#999;">${submitted ? "已提交，可重新测验" : `已回答 ${answers.filter((a) => a >= 0).length} / ${lesson.quiz.questions.length}`}</span>
        <button class="btn btn-run" id="quiz-submit-btn">${submitted ? "重新测验" : "提交测验"}</button>
      </div>`;

      container.innerHTML = html;

      if (!submitted) {
        container.querySelectorAll(".quiz-option").forEach((el) => {
          el.addEventListener("click", () => {
            const qi = +el.dataset.qi, oi = +el.dataset.oi;
            answers[qi] = oi;
            draw();
          });
        });
      }

      document.getElementById("quiz-submit-btn").addEventListener("click", () => {
        if (!submitted) {
          doSubmit();
        } else {
          answers.fill(-1);
          submitted = false;
          secondsLeft = isTimed ? lesson.quiz.timeLimitMinutes * 60 : 0;
          draw();
          startTimer();
        }
      });
    }
    draw();
    startTimer();
  }

  // ---------- 底部导航 / 完成本课 ----------
  function renderLessonNav() {
    const { lesson } = findLesson(currentModuleId, currentLessonId);
    const idx = flatLessons.findIndex((f) => f.lessonId === currentLessonId);
    document.getElementById("prev-lesson-btn").disabled = idx <= 0;
    document.getElementById("next-lesson-btn").disabled = idx >= flatLessons.length - 1 || !isModuleUnlocked(flatLessons[idx + 1]?.moduleIdx ?? 999);

    const doneBtn = document.getElementById("mark-done-btn");
    if (lesson.type === "quiz") {
      doneBtn.style.display = "none";
    } else {
      doneBtn.style.display = "";
      const done = isLessonDone(lesson.id);
      doneBtn.textContent = done ? "✓ 已完成" : "✓ 完成本课";
      doneBtn.disabled = done;
    }
  }

  function markCurrentLessonDone() {
    if (isLessonDone(currentLessonId)) return;
    state.completedLessons[currentLessonId] = true;
    addXp(10);
    const modIdx = COURSE_MODULES.findIndex((m) => m.id === currentModuleId);
    maybeUnlockNextModule(modIdx);
    saveState();
    renderSidebar();
    renderLessonNav();
  }

  function goRelative(delta) {
    const idx = flatLessons.findIndex((f) => f.lessonId === currentLessonId);
    const target = flatLessons[idx + delta];
    if (!target) return;
    if (!isModuleUnlocked(target.moduleIdx)) return;
    selectLesson(target.moduleId, target.lessonId);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------- 启动流程 ----------
  async function boot() {
    state = loadState();
    buildFlatList();

    const bootStatus = document.getElementById("boot-status");
    const bootBar = document.getElementById("boot-progress-bar");
    try {
      await PyRunner.init((msg, pct) => {
        bootStatus.textContent = msg;
        bootBar.style.width = pct + "%";
      });
    } catch (e) {
      bootStatus.textContent = "Pyodide 加载失败，请检查网络后刷新页面。部分讲解内容仍可查看。";
      console.error(e);
    }

    document.getElementById("boot-screen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    renderTopBar();
    renderSidebar();

    const first = flatLessons[0];
    selectLesson(first.moduleId, first.lessonId);

    bindGlobalUI();
  }

  function bindGlobalUI() {
    document.getElementById("sidebar-toggle").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("collapsed");
      document.getElementById("sidebar").classList.toggle("open");
    });
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
    document.getElementById("mark-done-btn").addEventListener("click", markCurrentLessonDone);
    document.getElementById("prev-lesson-btn").addEventListener("click", () => goRelative(-1));
    document.getElementById("next-lesson-btn").addEventListener("click", () => goRelative(1));
    document.getElementById("reset-progress-btn").addEventListener("click", () => {
      if (confirm("确定要重置全部学习进度吗？此操作不可恢复。")) {
        state = defaultState();
        saveState();
        sessionStorage.clear();
        renderTopBar();
        renderSidebar();
        renderLessonNav();
        selectLesson(flatLessons[0].moduleId, flatLessons[0].lessonId);
      }
    });
  }

  return { boot };
})();

window.addEventListener("DOMContentLoaded", () => App.boot());
