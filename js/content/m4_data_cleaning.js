COURSE_MODULES.push({
  id: "m4",
  title: "数据清洗与标注",
  icon: "🧹",
  lessons: [
    {
      id: "m4-l1",
      title: "缺失值与重复值处理",
      type: "learn",
      learnHtml: `
        <h3>发现缺失值</h3>
        <div class="code-block">import pandas as pd

print(df.isnull().sum())     # 每列缺失值数量
print(df.isnull().any())      # 每列是否存在缺失值</div>
        <h3>处理缺失值的几种方式</h3>
        <div class="code-block"># 方式1：直接删除含缺失值的行
df_dropped = df.dropna()

# 方式2：用固定值填充
df_filled = df.fillna(0)

# 方式3：用该列的均值/中位数填充（更常用，不会引入极端值）
df["Humidity"] = df["Humidity"].fillna(df["Humidity"].mean())</div>
        <h3>重复值处理</h3>
        <div class="code-block">print(df.duplicated().sum())   # 查看重复行数量
df_unique = df.drop_duplicates()  # 删除重复行</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 怎么选填充策略</span>
          直接删除会丢失数据，适合缺失比例很小的情况；均值/中位数填充适合数值型字段且分布比较均匀；如果数据有时间顺序（比如传感器按时间记录），更推荐用前后向填充（下一课讲）。
        </div>
      `,
      practice: {
        prompt: "环境里有传感器数据 <code>df</code>（字段：SensorID, Timestamp, SensorType, Value, Location），其中 <code>Value</code> 列有缺失值（NaN）。请用该列的<strong>均值</strong>填充缺失值，覆盖写回 <code>df['Value']</code>，并把填充后缺失值的数量存入变量 <code>missing_after</code>（应为0）。",
        setupCode: `import pandas as pd
import io
df = pd.read_csv(io.StringIO('''${PY_DATASETS.sensor}'''))`,
        starterCode: `# df 已经为你准备好了，Value列有缺失值
mean_value = df['Value'].mean()
df['Value'] = df['Value']  # TODO: 用 fillna(mean_value) 填充缺失值
missing_after = None  # TODO: 填充后再统计缺失值数量
print(missing_after)`,
        referenceCode: `mean_value = df['Value'].mean()
df['Value'] = df['Value'].fillna(mean_value)
missing_after = df['Value'].isnull().sum()
print(missing_after)`,
        packages: ["pandas"],
        checkCode: `
try:
    assert missing_after is not None, "missing_after 还是 None"
    assert missing_after == 0, f"填充后应该没有缺失值了，但你得到的缺失值数量是{missing_after}"
    assert df['Value'].isnull().sum() == 0, "df['Value']里仍然存在缺失值，fillna没有正确覆盖写回"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！用均值成功填充了缺失值。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m4-l2",
      title: "异常值标记与过滤（真题1.1.3场景）",
      type: "learn",
      learnHtml: `
        <h3>什么是异常值</h3>
        <p>异常值指明显不符合业务常理的数据，比如年龄15岁却有60000元的贷款记录，或者收入远超正常范围。处理异常值前，<strong>先要靠业务常识定义"什么算异常"</strong>，再写代码标记/过滤。</p>
        <div class="code-block">import pandas as pd

# 假设业务规则：年龄必须在18~80之间才合理
df["AgeValid"] = (df["Age"] >= 18) & (df["Age"] <= 80)
print(df[~df["AgeValid"]])   # 查看不合理的记录（~表示取反）</div>
        <h3>用 IQR（四分位距）方法自动检测数值异常</h3>
        <div class="code-block">Q1 = df["Income"].quantile(0.25)
Q3 = df["Income"].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
outliers = df[(df["Income"] < lower) | (df["Income"] > upper)]
print(outliers)</div>
        <h3>标记 vs 删除</h3>
        <p>很多时候不直接删除异常值，而是先打上标记列（比如<code>is_outlier</code>），保留原始数据，方便后续人工复核或做不同的处理策略对比。</p>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          真题1.1.3金融信用评估场景中的"15岁申请6万元贷款"就是典型的业务规则异常——结合年龄规则（如 Age < 18）直接可以标记出来，这类"业务规则"异常往往比统计方法更直接有效。
        </div>
      `,
      practice: {
        prompt: "环境里有信用数据 <code>df</code>（字段：CustomerID, Name, Age, Income, LoanAmount, CreditScore, Default）。请根据业务规则——年龄必须在18到75之间——标记出不合理的记录，存入变量 <code>invalid_age_customers</code>（一个DataFrame，只包含Age&lt;18或Age&gt;75的行）。",
        setupCode: `import pandas as pd
import io
df = pd.read_csv(io.StringIO('''${PY_DATASETS.credit}'''))`,
        starterCode: `# df 已经为你准备好了
invalid_age_customers = None  # TODO: 筛选 Age < 18 或 Age > 75 的记录
print(invalid_age_customers)`,
        referenceCode: `invalid_age_customers = df[(df["Age"] < 18) | (df["Age"] > 75)]
print(invalid_age_customers)`,
        packages: ["pandas"],
        checkCode: `
try:
    assert invalid_age_customers is not None, "invalid_age_customers 还是 None"
    assert len(invalid_age_customers) == 1, f"期望找到1条异常记录（15岁的客户），你找到了{len(invalid_age_customers)}条"
    assert invalid_age_customers.iloc[0]["Age"] == 15, "没有正确找到那条年龄15岁的异常记录"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！成功识别出年龄15岁这条明显不合理的业务异常记录。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m4-l3",
      title: "前后向填充 ffill/bfill（真题1.1.2场景）",
      type: "learn",
      learnHtml: `
        <h3>有时间顺序的数据，用均值填充不合适</h3>
        <p>传感器数据按时间先后记录，缺失值用"前一个有效值"或"后一个有效值"填充，往往比用全局均值更合理，因为相邻时间点的数据通常比较接近。</p>
        <div class="code-block">import pandas as pd

# ffill：用前一个有效值填充（forward fill）
df["Value"] = df["Value"].ffill()

# bfill：用后一个有效值填充（backward fill）
df["Value"] = df["Value"].bfill()</div>
        <h3>组合使用</h3>
        <div class="code-block"># 先用前向填充，剩下开头的缺失值（没有"前一个"）再用后向填充补上
df["Value"] = df["Value"].ffill().bfill()</div>
        <h3>按分组分别填充</h3>
        <p>如果数据有多个传感器/多个地块，应该<strong>分组后再填充</strong>，避免用A传感器的值填充B传感器的缺失，这是真实业务里非常容易被忽略的细节。</p>
        <div class="code-block">df["Value"] = df.groupby("Location")["Value"].ffill()</div>
        <div class="callout callout-warn">
          <span class="callout-title">⚠️ 常见错误</span>
          不分组直接对整列做 ffill，会导致"用FieldA最后一条记录去填FieldB第一条缺失记录"，这是真题1.1.2里容易丢分的细节点，一定要留意数据里是否存在"分组"维度。
        </div>
      `,
      practice: {
        prompt: "环境里有传感器数据 <code>df</code>（字段：SensorID, Timestamp, SensorType, Value, Location），Value列有缺失值。请<strong>按 Location 分组</strong>，对每组内的 <code>Value</code> 做前向填充（ffill），再用后向填充（bfill）补齐开头可能剩余的缺失值，结果覆盖写回 <code>df['Value']</code>，并统计填充后的缺失值数量存入 <code>missing_after</code>。",
        setupCode: `import pandas as pd
import io
df = pd.read_csv(io.StringIO('''${PY_DATASETS.sensor}'''))`,
        starterCode: `# df 已经为你准备好了
df['Value'] = df['Value']  # TODO: 按Location分组，ffill再bfill
missing_after = None  # TODO: 统计填充后的缺失值数量
print(missing_after)`,
        referenceCode: `df['Value'] = df.groupby('Location')['Value'].ffill().bfill()
missing_after = df['Value'].isnull().sum()
print(missing_after)`,
        packages: ["pandas"],
        checkCode: `
try:
    assert missing_after is not None, "missing_after 还是 None"
    assert missing_after == 0, f"填充后应该没有缺失值了，你得到的是{missing_after}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！按Location分组进行前后向填充，是处理分组时间序列数据缺失值的标准做法。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m4-l4",
      title: "数据标注规范与工具概念",
      type: "learn",
      learnHtml: `
        <h3>为什么需要数据标注</h3>
        <p>监督学习模型需要"有标准答案"的数据才能训练——比如一张图片需要标注"这是猫还是狗"，一段文本需要标注"这是正面评价还是负面评价"。这个打标准答案的过程就是<strong>数据标注</strong>，是AI训练师的核心工作之一。</p>
        <h3>常见标注类型</h3>
        <ul>
          <li><strong>分类标注</strong>：给整条数据打一个类别标签（如情感分析：正面/负面/中性）</li>
          <li><strong>边界框标注（Bounding Box）</strong>：在图片上框出目标物体的位置，用于目标检测</li>
          <li><strong>关键点标注</strong>：标出人脸特征点、人体骨骼关键点等</li>
          <li><strong>文本序列标注</strong>：标出命名实体（人名/地名/机构名）在句子中的位置</li>
        </ul>
        <h3>标注质量控制</h3>
        <p>真实项目中常用<strong>多人标注+一致性检验</strong>的方式保证标注质量：同一批数据让2~3个人分别标注，计算标注结果的一致率（比如 Cohen's Kappa 系数），一致率过低说明标注标准不清晰，需要重新制定标注规范文档。</p>
        <div class="callout callout-tip">
          <span class="callout-title">💡 常见标注工具</span>
          业界常用的标注工具包括 Label Studio（开源、支持多种标注类型）、LabelImg（图片目标检测标注）、Doccano（文本标注）等。这些工具的共同作用是提供友好的界面，让标注人员不需要写代码就能完成打标签工作，最终导出结构化的标注文件（通常是JSON/CSV格式）供模型训练使用。
        </div>
        <h3>标注规范文档应包含什么</h3>
        <ul>
          <li>标注任务目标与背景说明</li>
          <li>每个标签类别的清晰定义 + 典型示例 + 边界case说明（容易混淆的情况怎么处理）</li>
          <li>标注工具的操作步骤</li>
          <li>质量检验标准（抽检比例、一致率要求）</li>
        </ul>
      `,
      practice: {
        prompt: "判断题：下面哪种情况最可能说明「标注规范文档写得不够清晰」？",
        noExec: true,
        codeToRead: `# 场景：某文本情感分类标注项目，统计结果如下
标注员A: 中性标签占比 45%
标注员B: 中性标签占比 8%
（其余正面/负面标签占比两人接近）`,
        choiceQuestion: "根据以上场景，最可能的原因是什么？",
        choices: [
          "标注员A比标注员B更勤奋",
          "「中性」这个标签的判定边界在规范文档里定义不清晰，两人理解差异很大",
          "数据集本身存在错误",
          "标注工具存在bug",
        ],
        answerIndex: 1,
        explain: "两人在明确的标签（正面/负面）上判断接近，但在模糊地带（中性）差异巨大，这是典型的「标签边界定义不清」问题，应该在规范文档里补充中性标签的典型示例和边界case说明。",
      },
    },

    {
      id: "m4-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "df['Value'].fillna(df['Value'].mean()) 这行代码的作用是？",
            options: ["删除Value列所有缺失值所在的行", "用Value列的均值填充该列的缺失值", "删除Value这一列", "统计Value列的缺失值数量"],
            answerIndex: 1,
            explain: "fillna()用于填充缺失值，括号里传入的是填充用的值，这里用的是该列自身的均值。",
          },
          {
            q: "按Location分组后再做ffill，和不分组直接对整列ffill，主要区别是什么？",
            options: [
              "两者完全一样",
              "分组ffill只会用同一组内的前一个值填充，避免跨组互相「污染」数据",
              "分组ffill速度更快，但结果一样",
              "不分组的ffill会报错",
            ],
            answerIndex: 1,
            explain: "分组填充能确保Location=A的缺失值只会被A组内的有效值填充，不会被B组的值污染，这是处理多实体时间序列数据的重要细节。",
          },
          {
            q: "一个15岁的客户却有6万元的贷款申请记录，这属于哪种异常值类型？",
            options: ["统计学异常（可以用IQR方法自动发现）", "业务规则异常（需要结合业务常识定义）", "数据类型错误", "正常数据，不是异常"],
            answerIndex: 1,
            explain: "这种异常需要结合「未成年不应有大额贷款」这类业务常识来判断，不是单纯靠统计分布就能自动发现的，因此属于业务规则异常。",
          },
          {
            q: "数据标注工作中，“多人标注+一致性检验”的主要目的是什么？",
            options: ["让标注更快完成", "保证标注质量，发现标注标准是否清晰统一", "节省标注成本", "避免数据泄露"],
            answerIndex: 1,
            explain: "多人标注同一批数据再比对一致率，可以发现标注人员之间理解是否一致，一致率低往往说明标注规范需要完善。",
          },
        ],
      },
    },
  ],
});
