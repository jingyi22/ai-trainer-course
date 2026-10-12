COURSE_MODULES.push({
  id: "m5",
  title: "机器学习建模实战",
  icon: "🤖",
  lessons: [
    {
      id: "m5-l1",
      title: "划分训练集与测试集",
      type: "learn",
      learnHtml: `
        <h3>为什么要分训练集和测试集</h3>
        <p>如果用全部数据训练模型，又用全部数据检验模型效果，模型很可能只是"背答案"，没有真正学到规律——这叫<strong>过拟合</strong>。标准做法是把数据切成两份：一份用来训练，一份完全不参与训练、只用来最后检验。</p>
        <div class="code-block">from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
# test_size=0.2 表示20%的数据作为测试集
# random_state 固定随机种子，保证每次运行切分结果一样，方便复现</div>
        <h3>划分后数据形状</h3>
        <div class="code-block">print(X_train.shape, X_test.shape)
print(y_train.shape, y_test.shape)</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 常见比例</span>
          常用比例是 80/20 或 70/30。数据量很小时（比如只有几十条），有时会用更简单的方式验证，但原理是一样的：训练用的数据和检验用的数据必须分开。
        </div>
      `,
      practice: {
        prompt: "环境里已经准备好了特征 <code>X</code>（二维数组）和标签 <code>y</code>（一维数组，共20条样本）。请用 <code>train_test_split</code> 按 <code>test_size=0.25</code>、<code>random_state=42</code> 切分，结果存入 <code>X_train, X_test, y_train, y_test</code>。",
        setupCode: `import numpy as np
from sklearn.model_selection import train_test_split
X = np.arange(40).reshape(20, 2)
y = np.array([0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1])`,
        starterCode: `# X, y 已经为你准备好了
X_train, X_test, y_train, y_test = None, None, None, None  # TODO
print(X_train.shape, X_test.shape)`,
        referenceCode: `X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
print(X_train.shape, X_test.shape)`,
        packages: ["numpy", "scikit-learn"],
        checkCode: `
try:
    assert X_train is not None, "X_train 还是 None"
    assert X_test.shape[0] == 5, f"测试集应该有5条样本（20条的25%），你得到{X_test.shape[0]}条"
    assert X_train.shape[0] == 15, f"训练集应该有15条样本，你得到{X_train.shape[0]}条"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！成功按25%比例切分出测试集。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m5-l2",
      title: "线性回归：预测连续数值（真题2.2.2/2.2.4场景）",
      type: "learn",
      learnHtml: `
        <h3>线性回归解决什么问题</h3>
        <p>当要预测的目标是一个<strong>连续数值</strong>（比如燃油效率mpg、房价、住院天数），而不是分类标签时，线性回归是最基础也最常用的模型之一。</p>
        <div class="code-block">from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# X: 特征（如 horsepower, weight）, y: 目标值（如 mpg）
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)       # 训练

predictions = model.predict(X_test)   # 预测
print(predictions)</div>
        <h3>查看模型学到的参数</h3>
        <div class="code-block">print(model.coef_)        # 每个特征的权重（系数）
print(model.intercept_)   # 截距</div>
        <p>比如 <code>coef_</code> 里 horsepower 对应的系数是负数，说明马力越大，mpg（燃油效率）通常越低，这和常识是一致的。</p>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          真题2.2.2/2.2.4里"预测汽车燃油效率"任务的标准流程就是：读取数据 → 选特征 → train_test_split → LinearRegression().fit() → predict() → 评估。
        </div>
      `,
      practice: {
        prompt: "环境里有汽车数据 <code>df</code>（字段：mpg, horsepower, weight, cylinders）。请用 <code>horsepower</code> 和 <code>weight</code> 作为特征（<code>X</code>），<code>mpg</code> 作为目标（<code>y</code>），按 <code>test_size=0.2, random_state=42</code> 切分，训练一个 <code>LinearRegression</code> 模型存入变量 <code>model</code>，并用测试集预测存入 <code>predictions</code>。",
        setupCode: `import pandas as pd
import io
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
df = pd.read_csv(io.StringIO('''${PY_DATASETS.autompg}'''))`,
        starterCode: `# df 已经为你准备好了
X = df[['horsepower', 'weight']]
y = df['mpg']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = None  # TODO: 创建并训练 LinearRegression
predictions = None  # TODO: 用 model.predict(X_test)
print(predictions)`,
        referenceCode: `X = df[['horsepower', 'weight']]
y = df['mpg']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
print(predictions)`,
        packages: ["pandas", "scikit-learn"],
        checkCode: `
try:
    assert model is not None, "model 还是 None"
    assert hasattr(model, 'coef_'), "model看起来还没有训练(fit)过"
    assert predictions is not None, "predictions 还是 None"
    assert len(predictions) == len(X_test), "预测结果数量应该和测试集样本数一致"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！线性回归模型训练并预测成功。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m5-l3",
      title: "逻辑回归：二分类问题（真题2.2.1信用评分场景）",
      type: "learn",
      learnHtml: `
        <h3>逻辑回归解决什么问题</h3>
        <p>当目标是<strong>分类</strong>（比如"是否违约"、"是否购买"，只有0/1两种结果）时，不能直接用线性回归——需要用<strong>逻辑回归（Logistic Regression）</strong>，它会输出一个0到1之间的概率，再据此判断类别。</p>
        <div class="code-block">from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# X: 特征（如 Income, DebtRatio）, y: 标签（0=未违约, 1=违约）
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)

predictions = model.predict(X_test)              # 直接给出类别 0/1
probabilities = model.predict_proba(X_test)       # 给出每个类别的概率
print(predictions)
print(probabilities)</div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          真题2.2.1"智能信用评分系统"的核心任务就是：根据 Income、DebtRatio、CreditScore 等特征，训练一个 LogisticRegression 模型预测客户是否会违约（Default）。
        </div>
      `,
      practice: {
        prompt: "环境里有信用评分数据 <code>df</code>（字段：Income, DebtRatio, CreditScore, Default）。请用 <code>Income</code>、<code>DebtRatio</code>、<code>CreditScore</code> 作为特征 <code>X</code>，<code>Default</code> 作为标签 <code>y</code>，按 <code>test_size=0.3, random_state=42</code> 切分，训练一个 <code>LogisticRegression</code> 模型存入 <code>model</code>，并计算测试集上的准确率存入 <code>accuracy</code>（用 <code>model.score(X_test, y_test)</code>）。",
        setupCode: `import pandas as pd
import io
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
df = pd.read_csv(io.StringIO('''${PY_DATASETS.creditscore}'''))`,
        starterCode: `# df 已经为你准备好了
X = df[['Income', 'DebtRatio', 'CreditScore']]
y = df['Default']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = None  # TODO: 创建并训练 LogisticRegression
accuracy = None  # TODO: model.score(X_test, y_test)
print(accuracy)`,
        referenceCode: `X = df[['Income', 'DebtRatio', 'CreditScore']]
y = df['Default']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)
print(accuracy)`,
        packages: ["pandas", "scikit-learn"],
        checkCode: `
try:
    assert model is not None, "model 还是 None"
    assert hasattr(model, 'coef_'), "model看起来还没有训练(fit)过"
    assert accuracy is not None, "accuracy 还是 None"
    assert 0 <= accuracy <= 1, "accuracy 应该是0到1之间的小数"
    __CHECK_RESULT__ = {"passed": True, "message": f"正确！逻辑回归模型训练成功，测试集准确率为{accuracy:.2f}。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m5-l4",
      title: "随机森林：更强的分类/回归模型（真题2.2.2/2.2.3场景）",
      type: "learn",
      learnHtml: `
        <h3>什么是随机森林</h3>
        <p>随机森林（Random Forest）由很多棵<strong>决策树</strong>组成，每棵树看一部分数据和特征，最后把所有树的结果"投票"或"平均"得出最终预测。相比单一模型，它通常更不容易过拟合，效果更稳定。</p>
        <div class="code-block">from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
predictions = model.predict(X_test)</div>
        <p>如果是预测连续数值，用 <code>RandomForestRegressor</code>，用法完全类似。</p>
        <h3>查看特征重要性</h3>
        <div class="code-block">importances = model.feature_importances_
for name, score in zip(X.columns, importances):
    print(name, score)</div>
        <p>特征重要性能帮助判断"哪个因素对预测结果影响最大"，这是模型可解释性分析里常用的一步。</p>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          真题2.2.2/2.2.3里"用随机森林替代/对比逻辑回归"的任务，考察的就是能否套用同一套 fit/predict 流程，并能解读 feature_importances_ 结果。
        </div>
      `,
      practice: {
        prompt: "环境里有信用评分数据 <code>df</code>（字段：Income, DebtRatio, CreditScore, Default）。请用同样的 <code>X</code>/<code>y</code>/切分方式（<code>test_size=0.3, random_state=42</code>），训练一个 <code>RandomForestClassifier(n_estimators=50, random_state=42)</code> 存入 <code>model</code>，并把特征重要性数组存入变量 <code>importances</code>。",
        setupCode: `import pandas as pd
import io
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
df = pd.read_csv(io.StringIO('''${PY_DATASETS.creditscore}'''))`,
        starterCode: `X = df[['Income', 'DebtRatio', 'CreditScore']]
y = df['Default']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = None  # TODO: 创建并训练 RandomForestClassifier(n_estimators=50, random_state=42)
importances = None  # TODO: model.feature_importances_
print(importances)`,
        referenceCode: `X = df[['Income', 'DebtRatio', 'CreditScore']]
y = df['Default']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X_train, y_train)
importances = model.feature_importances_
print(importances)`,
        packages: ["pandas", "scikit-learn"],
        checkCode: `
try:
    assert model is not None, "model 还是 None"
    assert hasattr(model, 'feature_importances_'), "model看起来还没有训练(fit)过"
    assert importances is not None, "importances 还是 None"
    assert len(importances) == 3, f"应该有3个特征的重要性分数，你得到了{len(importances)}个"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！随机森林训练成功，并取出了特征重要性。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m5-l5",
      title: "模型评估指标",
      type: "learn",
      learnHtml: `
        <h3>分类模型常用指标</h3>
        <div class="code-block">from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

accuracy = accuracy_score(y_test, predictions)     # 整体预测对的比例
precision = precision_score(y_test, predictions)   # 预测为"违约"里，真的违约了的比例
recall = recall_score(y_test, predictions)          # 真实违约的客户里，被正确找出来的比例
f1 = f1_score(y_test, predictions)                  # precision和recall的调和平均</div>
        <ul>
          <li><strong>准确率(accuracy)</strong>：最直观，但数据不平衡时会误导（比如违约只占5%，全部预测"不违约"也能有95%准确率）</li>
          <li><strong>召回率(recall)</strong>：对"宁可错判也不要漏判"的场景更重要，比如违约风险检测中漏掉真正会违约的客户代价很高</li>
          <li><strong>F1分数</strong>：precision和recall都要兼顾时的综合指标</li>
        </ul>
        <h3>回归模型常用指标</h3>
        <div class="code-block">from sklearn.metrics import mean_squared_error, r2_score

mse = mean_squared_error(y_test, predictions)   # 均方误差，越小越好
r2 = r2_score(y_test, predictions)                # R²，越接近1说明模型解释力越强</div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          真题里的"错误分析"类问题，往往要求你根据accuracy/recall/F1的具体数值，判断模型在哪类场景下表现不足（比如recall偏低说明漏判多），并给出改进建议，而不是只会调用函数。
        </div>
      `,
      practice: {
        prompt: "环境里已经有真实标签 <code>y_test</code> 和模型预测结果 <code>predictions</code>（都是0/1数组）。请计算准确率存入 <code>accuracy</code>，召回率存入 <code>recall</code>，F1分数存入 <code>f1</code>。",
        setupCode: `import numpy as np
y_test = np.array([0,1,1,0,1,0,0,1,1,0])
predictions = np.array([0,1,0,0,1,0,0,1,1,1])`,
        starterCode: `from sklearn.metrics import accuracy_score, recall_score, f1_score
accuracy = None  # TODO
recall = None  # TODO
f1 = None  # TODO
print(accuracy, recall, f1)`,
        referenceCode: `from sklearn.metrics import accuracy_score, recall_score, f1_score
accuracy = accuracy_score(y_test, predictions)
recall = recall_score(y_test, predictions)
f1 = f1_score(y_test, predictions)
print(accuracy, recall, f1)`,
        packages: ["numpy", "scikit-learn"],
        checkCode: `
try:
    assert accuracy is not None, "accuracy 还是 None"
    assert abs(accuracy - 0.8) < 1e-6, f"accuracy应该是0.8，你得到{accuracy}"
    assert recall is not None, "recall 还是 None"
    assert abs(recall - 0.8) < 1e-6, f"recall应该是0.8，你得到{recall}"
    assert f1 is not None, "f1 还是 None"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！三个评估指标都算对了。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m5-l6",
      title: "保存与加载模型",
      type: "learn",
      learnHtml: `
        <h3>为什么要保存模型</h3>
        <p>训练模型（尤其是数据量大时）可能耗时很久，训练好之后应该把模型<strong>保存到磁盘</strong>，下次直接加载使用，而不是每次都重新训练。<code>pickle</code> 是 Python 标准的对象序列化方式，sklearn模型可以直接用它保存。</p>
        <div class="code-block">import pickle

# 保存模型
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

# 加载模型
with open("model.pkl", "rb") as f:
    loaded_model = pickle.load(f)

loaded_model.predict(X_test)   # 加载后可以直接使用，效果和原模型一样</div>
        <h3>在浏览器环境里的替代写法</h3>
        <p>本练习环境没有真实磁盘文件系统，所以我们用 <code>pickle.dumps()</code> / <code>pickle.loads()</code>（直接操作内存中的bytes，不写文件）来模拟同样的"序列化→反序列化"过程，原理完全一样。</p>
        <div class="code-block">import pickle
model_bytes = pickle.dumps(model)        # 序列化成bytes
loaded_model = pickle.loads(model_bytes)  # 反序列化还原模型</div>
      `,
      practice: {
        prompt: "环境里已经有一个训练好的模型 <code>model</code>。请用 <code>pickle.dumps()</code> 把它序列化存入变量 <code>model_bytes</code>，再用 <code>pickle.loads()</code> 还原存入变量 <code>loaded_model</code>，最后用 <code>loaded_model.predict(X_test)</code> 得到预测结果存入 <code>loaded_predictions</code>。",
        setupCode: `import pandas as pd
import io
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
df = pd.read_csv(io.StringIO('''${PY_DATASETS.creditscore}'''))
X = df[['Income', 'DebtRatio', 'CreditScore']]
y = df['Default']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)`,
        starterCode: `import pickle
model_bytes = None  # TODO: pickle.dumps(model)
loaded_model = None  # TODO: pickle.loads(model_bytes)
loaded_predictions = None  # TODO: loaded_model.predict(X_test)
print(loaded_predictions)`,
        referenceCode: `import pickle
model_bytes = pickle.dumps(model)
loaded_model = pickle.loads(model_bytes)
loaded_predictions = loaded_model.predict(X_test)
print(loaded_predictions)`,
        packages: ["pandas", "scikit-learn"],
        checkCode: `
try:
    assert model_bytes is not None, "model_bytes 还是 None"
    assert isinstance(model_bytes, bytes), "model_bytes 应该是 bytes 类型（pickle.dumps的结果）"
    assert loaded_model is not None, "loaded_model 还是 None"
    assert loaded_predictions is not None, "loaded_predictions 还是 None"
    import numpy as np
    assert np.array_equal(loaded_predictions, model.predict(X_test)), "还原后的模型预测结果应该和原模型完全一致"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！模型序列化与反序列化成功，还原后预测结果一致。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m5-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "train_test_split 中 test_size=0.2 表示什么？",
            options: ["训练集占20%", "测试集占20%", "模型准确率要达到20%以上", "只用20%的数据"],
            answerIndex: 1,
            explain: "test_size=0.2 表示把20%的数据划分为测试集，剩下80%作为训练集。",
          },
          {
            q: "预测\"客户是否会违约\"（结果只有0或1）应该用哪种模型？",
            options: ["LinearRegression（线性回归）", "LogisticRegression（逻辑回归）", "两者都不行", "两者都一样，随便用"],
            answerIndex: 1,
            explain: "违约与否是分类问题（只有两个离散结果），应该用LogisticRegression；LinearRegression适合预测连续数值。",
          },
          {
            q: "随机森林（Random Forest）相比单一决策树，主要优势是什么？",
            options: ["训练速度一定更快", "由多棵树组合投票/平均，通常更不容易过拟合、效果更稳定", "占用内存更小", "不需要划分训练集和测试集"],
            answerIndex: 1,
            explain: "随机森林通过集成多棵决策树的结果来降低单棵树的方差，提升模型的稳定性和泛化能力。",
          },
          {
            q: "在违约风险检测这类\"漏判代价很高\"的场景，应该更关注哪个评估指标？",
            options: ["accuracy（准确率）", "recall（召回率）", "训练耗时", "特征数量"],
            answerIndex: 1,
            explain: "recall衡量的是\"真实为正的样本里，有多少被正确找出来\"，漏判代价高的场景（如违约、疾病检测）应优先关注recall。",
          },
          {
            q: "pickle.dumps(model) 和 pickle.loads(data) 的作用分别是什么？",
            options: [
              "dumps删除模型，loads创建新模型",
              "dumps把模型序列化成bytes，loads把bytes还原成模型对象",
              "两者功能完全相同",
              "只能用于sklearn模型，其他对象不能用",
            ],
            answerIndex: 1,
            explain: "pickle.dumps将Python对象（如训练好的模型）序列化为bytes，pickle.loads则进行反向操作，还原出原始对象。",
          },
        ],
      },
    },
  ],
});
