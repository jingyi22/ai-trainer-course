COURSE_MODULES.push({
  id: "m3",
  title: "NumPy与Pandas数据处理",
  icon: "📊",
  lessons: [
    {
      id: "m3-l1",
      title: "NumPy数组与向量化",
      type: "learn",
      learnHtml: `
        <h3>为什么要用 NumPy</h3>
        <p>Python 原生列表做数值运算很慢，而且不支持"整体运算"。<code>NumPy</code> 提供了 <code>ndarray</code>（多维数组），可以对整个数组做数学运算，速度快很多，这是几乎所有机器学习库的底层基础。</p>
        <div class="code-block">import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(arr * 2)        # [2 4 6 8 10]  —— 整体乘2，列表做不到这么简单
print(arr.mean())      # 3.0  平均值
print(arr.std())       # 标准差
print(arr.max(), arr.min())  # 5 1</div>
        <h3>向量化运算：不用写循环</h3>
        <div class="code-block">a = np.array([1, 2, 3])
b = np.array([10, 20, 30])
print(a + b)    # [11 22 33]
print(a * b)    # [10 40 90]</div>
        <p>对比一下如果用普通列表要怎么写：</p>
        <div class="code-block">a_list = [1, 2, 3]
b_list = [10, 20, 30]
result = [a_list[i] + b_list[i] for i in range(len(a_list))]  # 麻烦多了</div>
        <h3>条件筛选（布尔索引）</h3>
        <div class="code-block">temps = np.array([22.5, 60.0, 21.8, -5.0, 23.1])
valid = temps[(temps >= 0) & (temps <= 50)]
print(valid)   # [22.5 21.8 23.1]</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 注意</span>
          NumPy 的布尔组合要用 <code>&</code> 和 <code>|</code>（不是 <code>and</code>/<code>or</code>），因为要对数组里的每个元素分别判断，这是常见的新手错误点。
        </div>
      `,
      practice: {
        prompt: "有数组 <code>readings = np.array([22.5, 58.0, 21.8, 60.0, 23.1, -5.0, 24.0, 57.0])</code>（已在环境中预先定义好）。请用布尔索引筛选出 0 到 50（含）之间的值，存入变量 <code>valid_readings</code>（应该是一个numpy数组）。",
        setupCode: `import numpy as np
readings = np.array([22.5, 58.0, 21.8, 60.0, 23.1, -5.0, 24.0, 57.0])`,
        starterCode: `# readings 已经为你准备好了（是一个numpy数组）
valid_readings = None  # TODO: 用布尔索引筛选 0<=x<=50 的值
print(valid_readings)`,
        referenceCode: `valid_readings = readings[(readings >= 0) & (readings <= 50)]
print(valid_readings)`,
        packages: ["numpy"],
        checkCode: `
try:
    import numpy as np
    assert valid_readings is not None, "valid_readings 还是 None，请完成筛选"
    expected = np.array([22.5, 21.8, 23.1, 24.0])
    assert np.allclose(np.sort(valid_readings), np.sort(expected)), f"结果不对，期望值为 {expected}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！NumPy布尔索引筛选成功。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "valid_readings 的类型或值不对：" + str(e)}
`,
      },
    },

    {
      id: "m3-l2",
      title: "Pandas DataFrame 入门",
      type: "learn",
      learnHtml: `
        <h3>DataFrame：表格型数据结构</h3>
        <p><code>pandas</code> 是处理表格数据（想象成 Excel 表）的核心库，<code>DataFrame</code> 是它最重要的数据结构。</p>
        <div class="code-block">import pandas as pd
import io

csv_text = """Name,Age,Score
张三,34,88
李四,22,92
王五,45,76"""

df = pd.read_csv(io.StringIO(csv_text))
print(df)
print(df.shape)       # (3, 3) —— 3行3列
print(df.columns)     # 查看列名
print(df.dtypes)      # 查看每列数据类型</div>
        <h3>查看数据的常用方法</h3>
        <div class="code-block">print(df.head(2))      # 前2行
print(df.describe())   # 数值列的统计摘要（均值/标准差/最大最小值等）
print(df["Age"])        # 取某一列（是一个Series）
print(df[["Name", "Score"]])  # 取多列</div>
        <h3>按条件筛选行</h3>
        <div class="code-block">high_score = df[df["Score"] > 80]
print(high_score)</div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          职业技能真题里的"读取患者数据并查看基本信息"任务，用的就是 <code>pd.read_csv</code> + <code>.head()</code> / <code>.describe()</code> 这几个最基础的方法。
        </div>
      `,
      practice: {
        prompt: "环境里已经准备好了一份患者数据 <code>df</code>（字段：PatientID, Age, BMI, BloodPressure, Cholesterol, DaysInHospital）。请筛选出 <code>Age</code> 大于 60 的所有患者记录，存入变量 <code>elderly_patients</code>（是一个DataFrame）。",
        setupCode: `import pandas as pd
import io
df = pd.read_csv(io.StringIO('''${PY_DATASETS.patient}'''))`,
        starterCode: `# df 已经为你准备好了，字段：PatientID, Age, BMI, BloodPressure, Cholesterol, DaysInHospital
elderly_patients = None  # TODO: 筛选 Age > 60 的记录
print(elderly_patients)`,
        referenceCode: `elderly_patients = df[df["Age"] > 60]
print(elderly_patients)`,
        packages: ["pandas"],
        checkCode: `
try:
    assert elderly_patients is not None, "elderly_patients 还是 None"
    assert len(elderly_patients) == 7, f"筛选结果数量不对，期望7条记录，你得到了{len(elderly_patients)}条"
    assert (elderly_patients["Age"] > 60).all(), "筛选条件不对，结果中有Age<=60的记录"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！成功筛选出7位年龄超过60岁的患者。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m3-l3",
      title: "分组统计 groupby",
      type: "learn",
      learnHtml: `
        <h3>groupby：先分组，再统计</h3>
        <p>这是数据分析里最常用的操作之一：按某一列的取值分组，再对每组计算统计量。</p>
        <div class="code-block">import pandas as pd
import io

csv_text = """Department,Name,Salary
Sales,张三,8000
Sales,李四,9000
Tech,王五,12000
Tech,赵六,15000
Tech,孙七,13000"""

df = pd.read_csv(io.StringIO(csv_text))
avg_salary = df.groupby("Department")["Salary"].mean()
print(avg_salary)
# Department
# Sales     8500.0
# Tech     13333.3</div>
        <h3>多种聚合方式</h3>
        <div class="code-block">print(df.groupby("Department")["Salary"].agg(["mean", "max", "count"]))</div>
        <h3>按多列分组</h3>
        <div class="code-block">df.groupby(["Department", "Name"])["Salary"].sum()</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 用途</span>
          比如"统计不同地块(Location)传感器的平均温度"、"统计不同性别用户的平均浏览时长"，都是 groupby 的典型应用场景。
        </div>
      `,
      practice: {
        prompt: "环境里有电商用户行为数据 <code>df</code>（字段：UserID, Age, Gender, PageViews, TimeOnSite, Purchased）。请按 <code>Gender</code> 分组，计算每组的平均 <code>TimeOnSite</code>，存入变量 <code>avg_time_by_gender</code>。",
        setupCode: `import pandas as pd
import io
df = pd.read_csv(io.StringIO('''${PY_DATASETS.userbehavior}'''))`,
        starterCode: `# df 已经为你准备好了，字段：UserID, Age, Gender, PageViews, TimeOnSite, Purchased
avg_time_by_gender = None  # TODO: 按Gender分组，计算TimeOnSite的平均值
print(avg_time_by_gender)`,
        referenceCode: `avg_time_by_gender = df.groupby("Gender")["TimeOnSite"].mean()
print(avg_time_by_gender)`,
        packages: ["pandas"],
        checkCode: `
try:
    assert avg_time_by_gender is not None, "avg_time_by_gender 还是 None"
    d = dict(avg_time_by_gender)
    assert set(d.keys()) == {"F", "M"}, f"分组的key不对，期望F和M，得到{set(d.keys())}"
    assert abs(d["F"] - 231.0) < 1, f"F组的平均值不对，期望约231，得到{d['F']}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！成功按性别分组统计平均浏览时长。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m3-l4",
      title: "数据分箱 pd.cut（真题1.1.1场景）",
      type: "learn",
      learnHtml: `
        <h3>什么是数据分箱</h3>
        <p>把连续数值划分成几个区间（"箱子"），常用于把连续变量转换成分类变量，便于统计分析——比如把年龄分成"青年/中年/老年"几个档次。</p>
        <div class="code-block">import pandas as pd

ages = pd.Series([23, 34, 45, 58, 67, 72, 29])
bins = [0, 30, 50, 100]
labels = ["青年", "中年", "老年"]
age_group = pd.cut(ages, bins=bins, labels=labels)
print(age_group)
# 0     青年
# 1     中年
# 2     中年
# 3     中年
# 4     老年
# 5     老年
# 6     青年</div>
        <p><code>bins=[0, 30, 50, 100]</code> 定义了区间：(0,30]、(30,50]、(50,100]，<code>labels</code> 给每个区间起名字。</p>
        <h3>结合 groupby 统计每个分箱的情况</h3>
        <div class="code-block">df = pd.DataFrame({"Age": ages, "DaysInHospital": [3, 7, 5, 9, 12, 14, 2]})
df["AgeGroup"] = pd.cut(df["Age"], bins=bins, labels=labels)
print(df.groupby("AgeGroup")["DaysInHospital"].mean())</div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          这正是真题1.1.1智能医疗系统里的核心任务之一：把患者按年龄分组，分析不同年龄段的平均住院天数，用来发现"老年患者住院时间明显更长"这类业务洞察。
        </div>
      `,
      practice: {
        prompt: "环境里有患者数据 <code>df</code>（字段：PatientID, Age, BMI, BloodPressure, Cholesterol, DaysInHospital）。请用 <code>pd.cut</code> 把 <code>Age</code> 按区间 <code>[0, 40, 60, 100]</code> 分成 <code>['青年', '中年', '老年']</code> 三组，存入新列 <code>df['AgeGroup']</code>，然后按AgeGroup分组计算DaysInHospital的平均值，存入变量 <code>avg_days_by_age</code>。",
        setupCode: `import pandas as pd
import io
df = pd.read_csv(io.StringIO('''${PY_DATASETS.patient}'''))`,
        starterCode: `# df 已经为你准备好了
bins = [0, 40, 60, 100]
labels = ['青年', '中年', '老年']
df['AgeGroup'] = None  # TODO: 用 pd.cut 分箱
avg_days_by_age = None  # TODO: 按AgeGroup分组计算DaysInHospital均值
print(avg_days_by_age)`,
        referenceCode: `bins = [0, 40, 60, 100]
labels = ['青年', '中年', '老年']
df['AgeGroup'] = pd.cut(df['Age'], bins=bins, labels=labels)
avg_days_by_age = df.groupby('AgeGroup')['DaysInHospital'].mean()
print(avg_days_by_age)`,
        packages: ["pandas"],
        checkCode: `
try:
    assert avg_days_by_age is not None, "avg_days_by_age 还是 None"
    d = {str(k): v for k, v in dict(avg_days_by_age).items()}
    assert "老年" in d, f"分组标签不对，得到{list(d.keys())}"
    assert d["老年"] > d["青年"], "老年组的平均住院天数应该明显高于青年组，检查分箱区间是否正确"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！数据分箱和分组统计都做对了，可以看出老年患者住院天数明显更长。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m3-l5",
      title: "实战：电商用户行为统计（真题1.1.4场景）",
      type: "learn",
      learnHtml: `
        <h3>综合实战</h3>
        <p>把前面学到的 groupby、条件筛选、排序结合起来，完成一个接近真题1.1.4的任务：分析电商用户的浏览行为与购买转化之间的关系。</p>
        <div class="code-block">import pandas as pd

# df 字段：UserID, Age, Gender, PageViews, TimeOnSite, Purchased(1=购买, 0=未购买)

# 1. 购买用户与未购买用户的平均浏览次数对比
print(df.groupby("Purchased")["PageViews"].mean())

# 2. 按浏览次数降序排列，看看浏览最多的用户
print(df.sort_values("PageViews", ascending=False).head(3))

# 3. 计算总体转化率
conversion_rate = df["Purchased"].mean()  # 因为Purchased是0/1，mean()就是比例
print(f"转化率: {conversion_rate:.1%}")</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 业务解读思路</span>
          如果发现"购买用户的平均浏览次数和停留时间明显更高"，这就是一个可以写进分析报告的业务洞察——这正是AI训练师在真实工作中经常要做的"数据分析→业务结论"的转换。
        </div>
      `,
      practice: {
        prompt: "环境里有电商用户行为数据 <code>df</code>。请计算购买用户组（Purchased=1）和未购买用户组（Purchased=0）各自的平均 <code>PageViews</code>，存入变量 <code>pv_by_purchase</code>（用groupby实现）。",
        setupCode: `import pandas as pd
import io
df = pd.read_csv(io.StringIO('''${PY_DATASETS.userbehavior}'''))`,
        starterCode: `# df 已经为你准备好了
pv_by_purchase = None  # TODO: 按Purchased分组，计算PageViews的平均值
print(pv_by_purchase)`,
        referenceCode: `pv_by_purchase = df.groupby("Purchased")["PageViews"].mean()
print(pv_by_purchase)`,
        packages: ["pandas"],
        checkCode: `
try:
    assert pv_by_purchase is not None, "pv_by_purchase 还是 None"
    d = dict(pv_by_purchase)
    assert d[1] > d[0], "购买用户组(1)的平均浏览次数应该高于未购买组(0)，请检查分组逻辑"
    __CHECK_RESULT__ = {"passed": True, "message": f"正确！购买用户平均浏览{d[1]:.1f}次，未购买用户平均浏览{d[0]:.1f}次，验证了'浏览越多越容易购买'的业务直觉。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m3-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "NumPy数组做布尔条件组合筛选时，应该用什么运算符？",
            options: ["and / or", "& / |", "&& / ||", "both A and B work the same"],
            answerIndex: 1,
            explain: "NumPy数组的逐元素布尔运算要用 & 和 |，因为 and/or 是Python内置的单值布尔运算符，不支持数组逐元素比较。",
          },
          {
            q: "pd.read_csv(io.StringIO(csv_text)) 这行代码的作用是？",
            options: ["从网络下载csv文件", "把字符串形式的csv内容解析成DataFrame", "把DataFrame保存成字符串", "删除csv文件"],
            answerIndex: 1,
            explain: "io.StringIO把字符串包装成一个类似文件的对象，pd.read_csv就能像读文件一样读取这段字符串内容，解析成DataFrame。",
          },
          {
            q: "df.groupby('Department')['Salary'].mean() 的作用是什么？",
            options: ["计算所有人的平均工资", "按Department分组后，分别计算每组Salary的平均值", "按工资排序", "删除重复的Department"],
            answerIndex: 1,
            explain: "groupby先按Department的取值把数据分成多组，然后对每组的Salary列分别计算平均值。",
          },
          {
            q: "pd.cut(ages, bins=[0,30,50,100], labels=['青年','中年','老年']) 的作用是？",
            options: ["删除超出范围的年龄", "把连续的年龄值划分到离散的区间标签中", "对年龄排序", "计算年龄的平均值"],
            answerIndex: 1,
            explain: "pd.cut用于把连续数值按指定的区间边界划分成离散的分类标签，这是数据分箱的标准方法。",
          },
        ],
      },
    },
  ],
});
