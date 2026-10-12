COURSE_MODULES.push({
  id: "m0",
  title: "开始之前",
  icon: "👋",
  lessons: [
    {
      id: "m0-l1",
      title: "欢迎 & 怎么用这个课堂",
      type: "learn",
      learnHtml: `
        <h3>欢迎来到 AI训练师 · Python互动课堂</h3>
        <p>这门课从 <strong>零基础</strong> 开始教你 Python，并且专门往"人工智能训练师"这个职业技能方向靠拢——也就是说，你学的每一个技能点，最终都会用在真实的 AI 数据处理、模型训练、模型评估等任务上。</p>
        <ul>
          <li>📖 <strong>讲解</strong> Tab：看文字讲解和示例代码，像读书一样。</li>
          <li>⌨️ <strong>练习</strong> Tab：真实编写并运行 Python 代码（这个网页里跑的是<strong>真的 Python</strong>，不是假装），系统会自动判断你写得对不对。</li>
          <li>📝 <strong>小测</strong> Tab：每个模块结束后的选择题测验，巩固记忆，答对60%以上即可解锁下一模块。</li>
        </ul>
        <div class="callout callout-tip">
          <span class="callout-title">💡 这个网页怎么做到"真实运行Python"的？</span>
          我们用了一个叫 <code>Pyodide</code> 的技术，把一整个 Python 解释器编译后放进了你的浏览器里运行。所以你写的代码是在你自己的电脑上真实执行的，结果也是真实计算出来的，不是提前写好的答案。
        </div>
        <div class="callout callout-warn">
          <span class="callout-title">⚠️ 关于模块7的特别说明</span>
          本课程里有一个模块（模块7 · AI模型推理）涉及的 <code>onnxruntime</code> 这个库，目前没办法在浏览器里运行。所以那个模块会换成"代码精读 + 流程图 + 判断题"的方式来学，而不是真实跑代码。这是整门课唯一的例外，这里提前跟你说清楚。
        </div>
        <h3>学习建议</h3>
        <p>每节课按顺序学，不要跳着学——因为后面的内容经常会用到前面学过的语法。遇到练习不会做，先想一想，卡住了就点"查看参考答案"，看懂之后记得自己重新敲一遍，而不是直接复制。</p>
        <p>准备好了吗？点击下方"下一课"，我们开始吧！</p>
      `,
    },
  ],
});
