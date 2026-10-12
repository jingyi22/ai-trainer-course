COURSE_MODULES.push({
  id: "m9",
  title: "综合模拟考试",
  icon: "🏆",
  lessons: [
    {
      id: "m9-l1",
      title: "考前说明",
      type: "learn",
      learnHtml: `
        <h3>模拟考试说明</h3>
        <p>这是一场覆盖全部模块的综合测验，共 <strong>20题</strong>，限时 <strong>30分钟</strong>，模拟真实考试的时间压力。</p>
        <ul>
          <li>题目涵盖 Python基础、NumPy/Pandas、数据清洗、机器学习建模、神经网络、AI推理流程、职业技能方法论等全部内容</li>
          <li>答对 <strong>60%（12题）</strong>以上视为通过，可获得丰厚的XP奖励</li>
          <li>计时结束会自动提交，请注意时间</li>
          <li>可以在"模拟考试"课程里随时重新测验，巩固薄弱环节</li>
        </ul>
        <div class="callout callout-tip">
          <span class="callout-title">💡 建议</span>
          如果某几道题反复出错，建议回到对应的模块重新复习一下讲解和练习，再来挑战模拟考试，这样记忆会更牢固。
        </div>
        <p>准备好了吗？点击左侧课程树里的"模拟考试"进入测验！</p>
      `,
    },

    {
      id: "m9-exam",
      title: "模拟考试（20题 / 30分钟）",
      type: "quiz",
      quiz: {
        timeLimitMinutes: 30,
        questions: [
          {
            q: "10 // 3 的结果是多少？",
            options: ["3.33", "3", "1", "0"],
            answerIndex: 1,
            explain: "// 是整除运算符，只保留商的整数部分，10 // 3 = 3。",
          },
          {
            q: "Python 用什么方式表示代码块层级？",
            options: ["花括号 {}", "缩进", "分号", "括号 ()"],
            answerIndex: 1,
            explain: "Python 用缩进（通常4个空格）表示代码块层级，这是和多数语言最大的语法差异。",
          },
          {
            q: "下面哪段代码能生成 [0, 2, 4, 6, 8]？",
            options: [
              "[n for n in range(10) if n % 2 == 0]",
              "[n for n in range(10) if n % 2 == 1]",
              "[n * 2 for n in range(10)]",
              "{n for n in range(10)}",
            ],
            answerIndex: 0,
            explain: "range(10)产生0~9，筛选n%2==0的偶数，结果正是[0,2,4,6,8]。",
          },
          {
            q: "闭包延迟绑定的经典坑：funcs=[lambda: i for i in range(3)]，执行[f() for f in funcs]的结果是？",
            options: ["[0, 1, 2]", "[2, 2, 2]", "[0, 0, 0]", "报错"],
            answerIndex: 1,
            explain: "所有lambda共享同一个变量i，循环结束后i的值固定为2，所以结果是[2, 2, 2]。",
          },
          {
            q: "想在代码出错时不让程序崩溃，而是走一段替代逻辑，应该用什么语句？",
            options: ["if/else", "try/except", "for/else", "while/break"],
            answerIndex: 1,
            explain: "try/except用于捕获并处理异常，防止程序直接崩溃。",
          },
          {
            q: "NumPy数组做布尔条件组合筛选（比如同时满足两个范围条件）时，应该用哪种运算符？",
            options: ["and / or", "& / |", "&& / ||", "+ / -"],
            answerIndex: 1,
            explain: "NumPy数组的逐元素布尔运算必须用 & 和 |，and/or不支持数组逐元素比较。",
          },
          {
            q: "pd.read_csv(io.StringIO(csv_text)) 的作用是什么？",
            options: ["从网络下载文件", "把字符串形式的csv内容解析成DataFrame", "把DataFrame转成字符串", "删除csv文件"],
            answerIndex: 1,
            explain: "io.StringIO把字符串包装成类似文件的对象，pd.read_csv据此解析成DataFrame。",
          },
          {
            q: "df.groupby('Department')['Salary'].mean() 的作用是？",
            options: ["计算全体平均工资", "按Department分组后分别计算每组Salary的平均值", "按工资排序", "删除重复部门"],
            answerIndex: 1,
            explain: "groupby先按取值分组，再对每组的目标列做聚合计算，这里是分别求各部门的平均工资。",
          },
          {
            q: "pd.cut(ages, bins=[0,30,50,100], labels=['青年','中年','老年']) 的作用是？",
            options: ["删除超范围的数据", "把连续数值划分成离散的区间标签", "对数据排序", "计算平均值"],
            answerIndex: 1,
            explain: "pd.cut用于数据分箱，把连续数值按边界划分成离散分类标签，常用于真题1.1.1医疗场景的年龄分组分析。",
          },
          {
            q: "按Location分组后再做ffill，与不分组直接对整列ffill相比，主要区别是什么？",
            options: ["完全一样", "分组ffill只用同组内的前一个有效值填充，避免跨组互相污染数据", "分组更慢", "不分组会报错"],
            answerIndex: 1,
            explain: "分组填充确保每组缺失值只被本组内的有效值填充，这是真题1.1.2农业传感器场景的关键细节。",
          },
          {
            q: "一个15岁的客户却有6万元贷款申请记录，这属于哪种异常值类型？",
            options: ["统计学异常（IQR能自动发现）", "业务规则异常（需结合业务常识判断）", "数据类型错误", "正常数据"],
            answerIndex: 1,
            explain: "这类异常需要结合\"未成年不应有大额贷款\"的业务常识判断，属于业务规则异常，是真题1.1.3信用评估的核心考点。",
          },
          {
            q: "train_test_split(X, y, test_size=0.2, random_state=42) 中 test_size=0.2 表示什么？",
            options: ["训练集占20%", "测试集占20%", "模型准确率要达到20%", "只用20%数据"],
            answerIndex: 1,
            explain: "test_size=0.2表示20%数据划为测试集，剩余80%作训练集。",
          },
          {
            q: "预测\"客户是否会违约\"（结果只有0或1）应该用哪种模型？",
            options: ["LinearRegression", "LogisticRegression", "两者都可以", "都不行"],
            answerIndex: 1,
            explain: "违约与否是二分类问题，应该用LogisticRegression；LinearRegression适合预测连续数值。",
          },
          {
            q: "在\"漏判代价很高\"的场景（如违约检测、疾病筛查），应该更关注哪个评估指标？",
            options: ["accuracy", "recall", "训练耗时", "特征数量"],
            answerIndex: 1,
            explain: "recall衡量真实为正的样本里有多少被正确找出，漏判代价高的场景应优先关注recall。",
          },
          {
            q: "ReLU激活函数 relu(x) = max(0, x)，对输入 x = -3 的输出是？",
            options: ["-3", "0", "3", "报错"],
            answerIndex: 1,
            explain: "ReLU把所有负数变成0，正数保持不变，relu(-3) = 0。",
          },
          {
            q: "梯度下降算法里，为什么参数更新公式是 w = w - lr * grad（减去梯度）？",
            options: ["随意约定，加减都一样", "梯度指向损失增大最快的方向，减去才能让损失变小", "为了让w变负数", "计算更快"],
            answerIndex: 1,
            explain: "梯度指向函数值增大最快的方向，要减小损失就要沿梯度反方向调整参数。",
          },
          {
            q: "模型训练集准确率95%，测试集只有60%，应该优先怀疑什么问题？",
            options: ["欠拟合", "过拟合", "没有训练", "数据集太大"],
            answerIndex: 1,
            explain: "训练集远好于测试集是过拟合的典型信号，说明模型记住了训练数据细节而没学到可泛化规律。",
          },
          {
            q: "图像识别推理流程中，模型输出的logits和经过Softmax后的probs，在\"找出概率最大的类别\"这个目的上结果是否一致？",
            options: ["不一致，必须先做Softmax", "一致，因为Softmax是单调变换不改变相对大小顺序", "完全无关", "只有二分类才一致"],
            answerIndex: 1,
            explain: "Softmax是单调递增变换，不改变各类别分数的相对顺序，所以argmax(logits)和argmax(probs)结果一致；但要展示具体概率百分比则必须做Softmax。",
          },
          {
            q: "在高风险场景（如门禁、医疗辅助诊断），当模型识别置信度较低时，最合理的做法是？",
            options: ["直接采用识别结果", "拒绝/提示重试，并提供人工复核通道", "提高识别速度", "降低置信度阈值让更多结果通过"],
            answerIndex: 1,
            explain: "低置信度意味着模型本身也不确定，高风险场景应优先保证安全性，通过人工复核兜底而非让AI单独做最终决定。",
          },
          {
            q: "数据采集处理指导文档中，\"数据质量要求\"写成\"必须保证数据质量，不能有问题\"，主要问题是什么？",
            options: ["字数太少", "没有给出具体、可执行、可检验的标准，无法真正指导操作", "位置放错", "没有问题"],
            answerIndex: 1,
            explain: "指导文档的核心价值在于可执行性，应该写出具体的缺失率上限、数值合理范围等量化标准，而不是空泛套话。",
          },
        ],
      },
    },
  ],
});
