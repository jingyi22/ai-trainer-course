COURSE_MODULES.push({
  id: "m2",
  title: "AI方向Python进阶技巧",
  icon: "⚡",
  lessons: [
    {
      id: "m2-l1",
      title: "f-string 与字符串处理",
      type: "learn",
      learnHtml: `
        <h3>f-string：最方便的字符串拼接方式</h3>
        <div class="code-block">name = "张三"
score = 92.567
msg = f"{name} 的得分是 {score:.2f} 分"
print(msg)   # 张三 的得分是 92.57 分</div>
        <p><code>{score:.2f}</code> 表示保留两位小数，这在打印模型评估指标（比如准确率、F1分数）时非常常用。</p>
        <h3>常用字符串方法</h3>
        <div class="code-block">s = "  Hello, AI Trainer!  "
print(s.strip())          # 去掉首尾空格："Hello, AI Trainer!"
print(s.lower())           # 转小写
print(s.upper())           # 转大写
print(s.replace(",", ""))  # 替换
print(s.strip().split(","))  # 按逗号切分成列表
print("AI" in s)            # 判断是否包含子串 -> True</div>
        <h3>格式化数字的常见用法</h3>
        <div class="code-block">accuracy = 0.8734
print(f"准确率: {accuracy:.2%}")   # 准确率: 87.34%
print(f"耗时: {12.3456:.1f} 秒")    # 耗时: 12.3 秒</div>
      `,
      practice: {
        prompt: "有变量 <code>model_name = 'LogisticRegression'</code> 和 <code>accuracy = 0.9123</code>。请用 f-string 创建一个字符串变量 <code>report</code>，内容格式为：<code>模型 LogisticRegression 的准确率是 91.23%</code>（百分比保留2位小数）。",
        starterCode: `model_name = 'LogisticRegression'
accuracy = 0.9123
report = ""  # TODO: 用f-string生成正确格式的字符串
print(report)`,
        referenceCode: `model_name = 'LogisticRegression'
accuracy = 0.9123
report = f"模型 {model_name} 的准确率是 {accuracy:.2%}"
print(report)`,
        checkCode: `
try:
    assert 'report' in globals(), "没有找到变量 report"
    expected = "模型 LogisticRegression 的准确率是 91.23%"
    assert report == expected, f"格式不对，期望：'{expected}'，你得到的是：'{report}'"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！f-string的百分比格式化用对了。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
`,
      },
    },

    {
      id: "m2-l2",
      title: "生成器与 yield",
      type: "learn",
      learnHtml: `
        <h3>为什么需要生成器</h3>
        <p>假设要处理一个超大的数据文件，一次性把所有数据读进列表会占用大量内存。<strong>生成器</strong>可以做到"用一个就生成一个"，不用的时候不占内存。</p>
        <div class="code-block">def count_up_to(n):
    i = 1
    while i <= n:
        yield i      # yield 让函数变成生成器，每次返回一个值并"暂停"
        i += 1

gen = count_up_to(5)
for num in gen:
    print(num)   # 依次打印 1 2 3 4 5</div>
        <p>和 <code>return</code> 不同，<code>yield</code> 不会结束函数——它会把函数"冻住"，下次要值的时候再从冻住的地方继续执行。</p>
        <h3>生成器表达式</h3>
        <div class="code-block">squares_gen = (n ** 2 for n in range(5))  # 注意用圆括号，不是方括号
print(list(squares_gen))   # [0, 1, 4, 9, 16]</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 实际场景</span>
          批量读取大型数据集（比如几十万条训练样本）时，常用生成器"一批一批"地产出数据喂给模型，而不是一次性全部加载进内存——这是深度学习里"数据加载器"的核心思路。
        </div>
      `,
      practice: {
        prompt: "请写一个生成器函数 <code>even_numbers(n)</code>，依次产出 0 到 n（不含n）之间所有的偶数。然后用 <code>list(even_numbers(10))</code> 得到结果存入变量 <code>result</code>，期望结果是 <code>[0, 2, 4, 6, 8]</code>。",
        starterCode: `def even_numbers(n):
    # TODO: 用 yield 依次产出 0 到 n（不含n）之间的偶数
    pass

result = list(even_numbers(10))
print(result)`,
        referenceCode: `def even_numbers(n):
    i = 0
    while i < n:
        if i % 2 == 0:
            yield i
        i += 1

result = list(even_numbers(10))
print(result)`,
        checkCode: `
try:
    assert 'result' in globals(), "没有找到变量 result"
    assert result == [0, 2, 4, 6, 8], f"结果不对，期望 [0, 2, 4, 6, 8]，你得到的是 {result}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！你的生成器函数成功产出了0~10之间的所有偶数。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
`,
      },
    },

    {
      id: "m2-l3",
      title: "函数式编程与高阶函数",
      type: "learn",
      learnHtml: `
        <h3>把函数当作参数传递</h3>
        <p>Python 的函数是"一等公民"，可以像普通变量一样传递。<code>map</code>、<code>filter</code>、<code>sorted</code> 都是常用的高阶函数（接收函数作为参数的函数）。</p>
        <div class="code-block">nums = [1, 2, 3, 4, 5]

# map：对每个元素做变换
doubled = list(map(lambda x: x * 2, nums))
print(doubled)   # [2, 4, 6, 8, 10]

# filter：筛选满足条件的元素
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens)   # [2, 4]

# sorted + key：按自定义规则排序
people = [("张三", 34), ("李四", 22), ("王五", 45)]
by_age = sorted(people, key=lambda p: p[1])
print(by_age)   # [('李四', 22), ('张三', 34), ('王五', 45)]</div>
        <h3>lambda：匿名函数</h3>
        <p><code>lambda 参数: 表达式</code> 是一种简写函数，常用在"只用一次、逻辑很简单"的场合，不需要专门用 <code>def</code> 定义。</p>
        <div class="callout callout-tip">
          <span class="callout-title">💡 跟 pandas/sklearn 的关系</span>
          后面学 pandas 时，<code>df['col'].apply(lambda x: ...)</code> 是最常见的写法之一——给DataFrame的某一列的每个值做自定义变换，用的就是这里学的 lambda + 高阶函数思路。
        </div>
      `,
      practice: {
        prompt: "有一组客户信息 <code>customers = [('张三', 710), ('李四', 620), ('王五', 780), ('赵六', 590)]</code>（姓名, 信用分）。请用 <code>sorted</code> + <code>key</code> + <code>lambda</code>，按信用分<strong>从高到低</strong>排序，存入变量 <code>ranked</code>。",
        starterCode: `customers = [('张三', 710), ('李四', 620), ('王五', 780), ('赵六', 590)]
ranked = []  # TODO: 用sorted(..., key=lambda ..., reverse=True)
print(ranked)`,
        referenceCode: `customers = [('张三', 710), ('李四', 620), ('王五', 780), ('赵六', 590)]
ranked = sorted(customers, key=lambda c: c[1], reverse=True)
print(ranked)`,
        checkCode: `
try:
    assert 'ranked' in globals(), "没有找到变量 ranked"
    expected = [('王五', 780), ('张三', 710), ('李四', 620), ('赵六', 590)]
    assert list(ranked) == expected, f"结果不对，期望 {expected}，你得到的是 {list(ranked)}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！成功按信用分从高到低排序。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
`,
      },
    },

    {
      id: "m2-l4",
      title: "用 matplotlib 画第一张图",
      type: "learn",
      learnHtml: `
        <h3>为什么要会画图</h3>
        <p>AI训练师的工作中，经常需要把数据分布、模型训练过程中的 loss 变化、评估指标画成图，方便直观判断模型好坏。<code>matplotlib</code> 是 Python 里最经典的画图库。</p>
        <div class="code-block">import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 8]

plt.plot(x, y, marker='o')
plt.title("示例折线图")
plt.xlabel("x轴")
plt.ylabel("y轴")
plt.show()</div>
        <p>运行后图片会直接显示在下方（这个网页会自动捕获 matplotlib 生成的图像并展示）。</p>
        <h3>常见图形类型</h3>
        <div class="code-block">import matplotlib.pyplot as plt

categories = ["正常", "超重", "偏瘦"]
counts = [12, 5, 3]
plt.bar(categories, counts)   # 柱状图
plt.title("BMI分类统计")
plt.show()</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 小贴士</span>
          每次调用 <code>plt.show()</code> 之前，可以用 <code>plt.figure()</code> 开启一张新图，避免多张图叠在一起。本课程的练习里这些细节已经帮你处理好，你只需要专注在画图逻辑本身。
        </div>
      `,
      practice: {
        prompt: "有数据 <code>categories = ['正常', '超重', '偏瘦']</code> 和 <code>counts = [12, 5, 3]</code>。请用 <code>plt.bar()</code> 画一个柱状图展示这组数据，并调用 <code>plt.show()</code>。",
        starterCode: `import matplotlib.pyplot as plt

categories = ['正常', '超重', '偏瘦']
counts = [12, 5, 3]
# TODO: 用 plt.bar() 画柱状图，然后 plt.show()
`,
        referenceCode: `import matplotlib.pyplot as plt

categories = ['正常', '超重', '偏瘦']
counts = [12, 5, 3]
plt.bar(categories, counts)
plt.title("BMI分类统计")
plt.show()`,
        packages: ["matplotlib"],
        checkCode: `
try:
    import matplotlib.pyplot as plt
    assert len(plt.get_fignums()) == 0, "占位检查"
    __CHECK_RESULT__ = {"passed": True, "message": "如果你看到上方出现了柱状图，就说明代码运行成功了！"}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "请确认用了 plt.bar() 并调用了 plt.show()"}
`,
      },
    },

    {
      id: "m2-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "f-string 中 {accuracy:.2%} 这种写法的作用是什么？",
            options: ["保留2位小数的小数", "转换成百分比并保留2位小数", "转换成整数百分比", "语法错误"],
            answerIndex: 1,
            explain: "`:.2%` 会把数值乘以100并加上%符号，同时保留2位小数，例如0.9123会显示为91.23%。",
          },
          {
            q: "yield 和 return 最主要的区别是什么？",
            options: [
              "yield 只能用在循环里",
              "yield 会暂停函数并记住状态，下次调用从暂停处继续；return直接结束函数",
              "两者完全一样",
              "return 只能返回一个值，yield能返回多个",
            ],
            answerIndex: 1,
            explain: "yield让函数变成生成器，每次产出一个值后暂停，保留内部状态，下次迭代继续执行；return会彻底结束函数执行。",
          },
          {
            q: "filter(lambda x: x > 3, [1,2,3,4,5]) 转成list后的结果是？",
            options: ["[1, 2, 3]", "[4, 5]", "[1, 2, 3, 4, 5]", "True"],
            answerIndex: 1,
            explain: "filter会保留使lambda表达式为True的元素，x>3时只有4和5满足条件。",
          },
          {
            q: "在本课程网页里，matplotlib画的图是如何展示给你看的？",
            options: ["无法展示，只能看代码", "会弹出一个新窗口", "网页会自动捕获生成的图像并以图片形式显示在输出区域", "需要手动下载图片文件才能看"],
            answerIndex: 2,
            explain: "本课程的Python运行环境会在代码执行后自动捕获matplotlib生成的图像，转换成图片直接显示在页面上。",
          },
        ],
      },
    },
  ],
});
