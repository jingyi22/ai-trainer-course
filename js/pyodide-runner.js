/*
 * pyodide-runner.js
 * 封装 Pyodide 的加载、按需安装依赖包、执行代码并捕获输出/图像、练习自动判题。
 *
 * 判题约定：每个练习的 checkCode（Python代码字符串）必须在执行后，
 * 在全局命名空间里设置一个变量 __CHECK_RESULT__ = {"passed": bool, "message": str}
 * 推荐写法：
 *   try:
 *       assert <条件>, "提示信息"
 *       __CHECK_RESULT__ = {"passed": True, "message": "回答正确！..."}
 *   except AssertionError as e:
 *       __CHECK_RESULT__ = {"passed": False, "message": str(e)}
 */

const PyRunner = (() => {
  let pyodide = null;
  let ready = false;
  const loadedPackages = new Set();
  let _stdoutBuf = "";
  let _stderrBuf = "";

  async function init(onProgress) {
    onProgress && onProgress("正在下载 Pyodide 核心引擎...", 15);
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
    onProgress && onProgress("初始化运行环境...", 55);
    pyodide.setStdout({ batched: (s) => { _stdoutBuf += s + "\n"; } });
    pyodide.setStderr({ batched: (s) => { _stderrBuf += s + "\n"; } });
    ready = true;
    onProgress && onProgress("准备就绪", 100);
  }

  function isReady() { return ready; }

  async function ensurePackages(pkgs, onProgress) {
    if (!pkgs || !pkgs.length) return;
    const need = pkgs.filter((p) => !loadedPackages.has(p));
    if (!need.length) return;
    onProgress && onProgress(`正在加载依赖包：${need.join(", ")}（第一次使用该模块时需要，之后会更快）`);
    await pyodide.loadPackage(need);
    need.forEach((p) => loadedPackages.add(p));
  }

  function newNamespace() {
    // 为每次运行创建独立命名空间，避免不同练习之间互相污染变量
    return pyodide.pyimport("builtins").dict();
  }

  function formatPyError(e) {
    const raw = e && e.message ? e.message : String(e);
    const lines = raw.split("\n").filter((l) => l.trim().length > 0);
    // Pyodide 抛出的是完整 Python traceback，只保留最后几行给用户看
    return lines.slice(-4).join("\n");
  }

  async function runRaw(code, namespace) {
    _stdoutBuf = "";
    _stderrBuf = "";
    let errorMsg = null;
    try {
      await pyodide.runPythonAsync(code, { globals: namespace });
    } catch (e) {
      errorMsg = formatPyError(e);
    }
    return { stdout: _stdoutBuf, stderr: _stderrBuf, error: errorMsg };
  }

  async function captureFigures(namespace) {
    const probe = `
import sys as __sys
__FIGURES__ = []
if 'matplotlib' in __sys.modules:
    import matplotlib.pyplot as __plt, io as __io, base64 as __b64
    for __num in __plt.get_fignums():
        __fig = __plt.figure(__num)
        __buf = __io.BytesIO()
        __fig.savefig(__buf, format='png', bbox_inches='tight', dpi=110)
        __buf.seek(0)
        __FIGURES__.append(__b64.b64encode(__buf.read()).decode('ascii'))
    __plt.close('all')
`;
    try {
      await pyodide.runPythonAsync(probe, { globals: namespace });
      const figProxy = namespace.get("__FIGURES__");
      if (!figProxy) return [];
      const arr = figProxy.toJs ? figProxy.toJs() : [];
      figProxy.destroy && figProxy.destroy();
      return arr;
    } catch (e) {
      return [];
    }
  }

  /**
   * 自由运行一段代码（用于“讲解”里的只读演示运行，或没有判题的练习）
   */
  async function runFree(code, packages) {
    await ensurePackages(packages);
    const ns = newNamespace();
    const res = await runRaw(code, ns);
    const figures = res.error ? [] : await captureFigures(ns);
    ns.destroy && ns.destroy();
    return { ...res, figures };
  }

  /**
   * 运行带判题的练习：
   * setupCode  - 练习开始前静默执行的代码（如预先定义好的数据集变量），不展示给学生
   * userCode   - 学生编辑器里的代码
   * checkCode  - 判题代码，需要设置 __CHECK_RESULT__
   */
  async function runExercise({ setupCode, userCode, checkCode, packages }) {
    await ensurePackages(packages);
    const ns = newNamespace();

    if (setupCode) {
      const setupRes = await runRaw(setupCode, ns);
      if (setupRes.error) {
        ns.destroy && ns.destroy();
        return { passed: false, stage: "setup", stdout: "", error: "练习初始化失败，请刷新页面重试。" };
      }
    }

    const userRes = await runRaw(userCode, ns);
    if (userRes.error) {
      ns.destroy && ns.destroy();
      return { passed: false, stage: "user", stdout: userRes.stdout, error: userRes.error };
    }

    const figures = await captureFigures(ns);

    let passed = false;
    let message = "";
    try {
      await pyodide.runPythonAsync(checkCode, { globals: ns });
      const resultProxy = ns.get("__CHECK_RESULT__");
      if (resultProxy) {
        const obj = resultProxy.toJs ? resultProxy.toJs({ dict_converter: Object.fromEntries }) : resultProxy;
        passed = !!obj.passed;
        message = obj.message || "";
        resultProxy.destroy && resultProxy.destroy();
      } else {
        message = "判题脚本未返回结果，请联系课程作者检查该题。";
      }
    } catch (e) {
      message = "判题过程出错：" + formatPyError(e);
      passed = false;
    }

    ns.destroy && ns.destroy();
    return { passed, stage: "check", stdout: userRes.stdout, message, figures };
  }

  return { init, isReady, ensurePackages, runFree, runExercise };
})();
