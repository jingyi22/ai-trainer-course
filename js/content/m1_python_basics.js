COURSE_MODULES.push({
  id: "m1",
  title: "Python零基础",
  icon: "🐍",
  lessons: [
    {
      id: "m1-l1",
      title: "变量、数据类型与运算符",
      type: "learn",
      learnHtml: `
        <h3>变量：给数据起个名字</h3>
        <p>Python 里创建一个变量非常简单，不需要像其它语言那样提前声明类型：</p>
        <div class="code-block">age = 25
name = "小明"
is_student = True
height = 1.75</div>
        <p>这里 <code>age</code> 是整数（<code>int</code>），<code>name</code> 是字符串（<code>str</code>），<code>is_student</code> 是布尔值（<code>bool</code>），<code>height</code> 是浮点数（<code>float</code>）。想知道一个变量的类型，用内置函数 <code>type()</code>：</p>
        <div class="code-block">print(type(age))     # &lt;class 'int'&gt;
print(type(name))    # &lt;class 'str'&gt;</div>
        <h3>常用运算符</h3>
        <ul>
          <li>算术：<code>+ - * / // % **</code>（<code>//</code>是整除，<code>%</code>是取余，<code>**</code>是幂）</li>
          <li>比较：<code>== != &gt; &lt; &gt;= &lt;=</code>，结果是 <code>True</code> / <code>False</code></li>
          <li>逻辑：<code>and or not</code></li>
        </ul>
        <div class="code-block">print(10 // 3)   # 3   （整除）
print(10 % 3)    # 1   （余数）
print(2 ** 10)   # 1024
print(5 &gt; 3 and 2 &gt; 1)  # True</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 为什么AI训练师要在意这些基础？</span>
          后面做数据清洗时，经常要写"年龄大于60 或者 血压超过140"这类筛选条件——这些就是比较运算符和逻辑运算符的组合。基础打牢，后面写筛选条件才不会出错。
        </div>
      `,
      practice: {
        prompt: "请创建一个变量 <code>bmi</code>，赋值为浮点数 <code>23.5</code>，再创建一个变量 <code>is_healthy</code>，判断 <code>bmi</code> 是否在 18.5（含）到 24.9（含）之间（健康范围），结果应为布尔值。最后用 print() 把两个变量都打印出来。",
        starterCode: `bmi = 23.5
is_healthy = None  # TODO: 把 None 换成正确的判断表达式
print(bmi)
print(is_healthy)`,
        referenceCode: `bmi = 23.5
is_healthy = 18.5 <= bmi <= 24.9
print(bmi)
print(is_healthy)`,
        checkCode: `
try:
    assert 'bmi' in globals(), "没有找到变量 bmi"
    assert bmi == 23.5, "bmi 的值不对，应该是 23.5"
    assert 'is_healthy' in globals(), "没有找到变量 is_healthy"
    assert isinstance(is_healthy, bool), "is_healthy 应该是一个布尔值（True/False）"
    assert is_healthy == True, "is_healthy 的判断结果不对，23.5 应该在健康范围内，结果应为 True"
    __CHECK_RESULT__ = {"passed": True, "message": "完全正确！bmi=23.5 确实在18.5~24.9的健康区间内。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
`,
      },
    },

    {
      id: "m1-l2",
      title: "条件判断与循环",
      type: "learn",
      learnHtml: `
        <h3>条件判断 if / elif / else</h3>
        <div class="code-block">score = 78
if score >= 90:
    level = "优秀"
elif score >= 60:
    level = "及格"
else:
    level = "不及格"
print(level)  # 及格</div>
        <p>注意 Python 用<strong>缩进</strong>（通常4个空格）表示代码块，而不是花括号 <code>{}</code>。缩进错了会直接报错或者逻辑错误，这是新手最容易踩的坑之一。</p>
        <h3>for 循环：遍历数据</h3>
        <div class="code-block">scores = [78, 92, 55, 88]
total = 0
for s in scores:
    total += s   # 等价于 total = total + s
print(total)   # 313</div>
        <h3>while 循环：满足条件就继续</h3>
        <div class="code-block">count = 0
while count < 5:
    print(count)
    count += 1</div>
        <h3>range() 生成数字序列</h3>
        <div class="code-block">for i in range(3):      # 0, 1, 2
    print(i)
for i in range(2, 10, 2):  # 2, 4, 6, 8
    print(i)</div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          职业技能真题里常见"遍历每一条患者记录，判断是否满足某个风险条件"的任务，本质上就是一个 for 循环 + if 判断的组合，跟数据量多大无关，道理完全一样。
        </div>
      `,
      practice: {
        prompt: "有一组患者住院天数 <code>days = [3, 9, 2, 11, 1, 14, 5]</code>。请用 for 循环统计其中<strong>住院天数超过7天</strong>的人数，存入变量 <code>long_stay_count</code>。",
        starterCode: `days = [3, 9, 2, 11, 1, 14, 5]
long_stay_count = 0
# TODO: 用 for 循环遍历 days，统计超过7天的人数
`,
        referenceCode: `days = [3, 9, 2, 11, 1, 14, 5]
long_stay_count = 0
for d in days:
    if d > 7:
        long_stay_count += 1
print(long_stay_count)`,
        checkCode: `
try:
    assert 'long_stay_count' in globals(), "没有找到变量 long_stay_count"
    assert long_stay_count == 3, f"结果不对，应该是3人（9天、11天、14天），你算出来是 {long_stay_count}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！3位患者住院超过7天。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
`,
      },
    },

    {
      id: "m1-l3",
      title: "列表、字典、集合与推导式",
      type: "learn",
      learnHtml: `
        <h3>列表 list：有序、可重复</h3>
        <div class="code-block">fruits = ["apple", "banana", "cherry"]
fruits.append("date")       # 增加
print(fruits[0])             # 取第一个："apple"
print(fruits[-1])            # 取最后一个："date"
print(fruits[1:3])           # 切片：["banana", "cherry"]
print(len(fruits))            # 长度：4</div>
        <h3>字典 dict：键值对</h3>
        <div class="code-block">patient = {"name": "张三", "age": 34, "bmi": 22.1}
print(patient["age"])           # 34
patient["risk"] = "low"         # 新增键
for key, value in patient.items():
    print(key, "->", value)</div>
        <h3>集合 set：去重</h3>
        <div class="code-block">tags = ["A", "B", "A", "C", "B"]
unique_tags = set(tags)
print(unique_tags)   # {'A', 'B', 'C'}（顺序不固定）</div>
        <h3>推导式：一行代替一个循环</h3>
        <div class="code-block">nums = [1, 2, 3, 4, 5, 6]
squares = [n ** 2 for n in nums]              # [1, 4, 9, 16, 25, 36]
evens = [n for n in nums if n % 2 == 0]       # [2, 4, 6]
age_map = {p: p * 365 for p in [20, 30, 40]}  # {20: 7300, 30: 10950, 40: 14600}</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 为什么重要</span>
          列表推导式在数据处理里极其常用——比如"把所有超过阈值的传感器读数挑出来"，一行代码就能完成，比写一个完整 for 循环更简洁，后面学 pandas 筛选时思路是通的。
        </div>
      `,
      practice: {
        prompt: "有一组传感器读数 <code>readings = [22.5, 58.0, 21.8, 60.0, 23.1, -5.0, 24.0, 57.0]</code>。请用<strong>列表推导式</strong>筛选出所有在合理范围 <code>0 到 50</code>（含）之间的读数，存入变量 <code>valid_readings</code>。",
        starterCode: `readings = [22.5, 58.0, 21.8, 60.0, 23.1, -5.0, 24.0, 57.0]
valid_readings = []  # TODO: 用列表推导式重写这一行
`,
        referenceCode: `readings = [22.5, 58.0, 21.8, 60.0, 23.1, -5.0, 24.0, 57.0]
valid_readings = [r for r in readings if 0 <= r <= 50]`,
        checkCode: `
try:
    assert 'valid_readings' in globals(), "没有找到变量 valid_readings"
    expected = [22.5, 21.8, 23.1, 24.0]
    assert list(valid_readings) == expected, f"结果不对，期望 {expected}，你得到的是 {list(valid_readings)}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！成功筛选出4个合理范围内的读数。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
`,
      },
    },

    {
      id: "m1-l4",
      title: "函数与作用域（含经典坑点）",
      type: "learn",
      learnHtml: `
        <h3>定义函数</h3>
        <div class="code-block">def bmi_category(bmi):
    if bmi < 18.5:
        return "偏瘦"
    elif bmi < 24.9:
        return "正常"
    else:
        return "超重"

print(bmi_category(22.1))  # 正常</div>
        <p>函数可以有<strong>默认参数</strong>，调用时可以不传：</p>
        <div class="code-block">def greet(name, greeting="你好"):
    return f"{greeting}, {name}!"

print(greet("小明"))             # 你好, 小明!
print(greet("小红", "早上好"))    # 早上好, 小红!</div>
        <h3>作用域：变量的"可见范围"</h3>
        <p>函数内部定义的变量，出了函数就不存在了（局部变量）；函数外部定义的变量，函数内部可以读但不能直接改（除非用 <code>global</code>）。</p>
        <div class="code-block">x = 10
def show():
    print(x)   # 可以读到外部的 x -> 10
show()</div>
        <h3>⚠️ 经典坑点：闭包里的"延迟绑定"（late binding）</h3>
        <p>这是 Python 新手（甚至有经验的人）都会踩的坑。看下面这段代码，你猜猜输出是什么：</p>
        <div class="code-block">funcs = []
for i in range(3):
    funcs.append(lambda: i)

print([f() for f in funcs])</div>
        <div class="callout callout-warn">
          <span class="callout-title">⚠️ 答案是 [2, 2, 2]，不是你以为的 [0, 1, 2]！</span>
          原因：Python 的闭包（lambda/函数）只记住变量 <code>i</code> 这个"名字"，不是记住当时的值。等真正调用 <code>f()</code> 的时候，循环早就结束了，<code>i</code> 的值已经变成了最后的 2，所有函数看到的都是同一个 <code>i</code>。
          <br><br>
          <strong>解决办法</strong>：用默认参数把当时的值"锁"进函数里：
          <div class="code-block" style="margin-top:8px;">funcs = []
for i in range(3):
    funcs.append(lambda i=i: i)   # 默认参数在定义时就固定了i的值
print([f() for f in funcs])        # [0, 1, 2] 正确了</div>
        </div>
      `,
      practice: {
        prompt: "请修复下面这段有闭包延迟绑定问题的代码，让 <code>results</code> 的最终输出是 <code>[0, 10, 20]</code>（原本会错误地输出 <code>[20, 20, 20]</code>）。只需要修改 <code>lambda</code> 那一行。",
        starterCode: `multipliers = []
for i in range(3):
    multipliers.append(lambda: i * 10)

results = [f() for f in multipliers]
print(results)`,
        referenceCode: `multipliers = []
for i in range(3):
    multipliers.append(lambda i=i: i * 10)

results = [f() for f in multipliers]
print(results)`,
        checkCode: `
try:
    assert 'results' in globals(), "没有找到变量 results"
    assert list(results) == [0, 10, 20], f"结果不对，期望 [0, 10, 20]，你得到的是 {list(results)}。提示：给lambda加一个默认参数 i=i"
    __CHECK_RESULT__ = {"passed": True, "message": "完全正确！你已经掌握了闭包延迟绑定这个经典坑点的修复方法。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
`,
      },
    },

    {
      id: "m1-l5",
      title: "异常处理",
      type: "learn",
      learnHtml: `
        <h3>为什么需要异常处理</h3>
        <p>实际业务数据里经常混有脏数据——比如应该是数字的字段里混进了文本，直接运算会导致程序崩溃。用 <code>try/except</code> 可以"接住"这个错误，让程序继续跑，而不是直接中断。</p>
        <div class="code-block">values = ["10", "20", "abc", "30"]
total = 0
for v in values:
    try:
        total += int(v)
    except ValueError:
        print(f"跳过无法转换的值: {v}")
print(total)   # 60</div>
        <h3>常见异常类型</h3>
        <ul>
          <li><code>ValueError</code>：值不对，比如 <code>int("abc")</code></li>
          <li><code>ZeroDivisionError</code>：除以0</li>
          <li><code>KeyError</code>：字典里没有这个键</li>
          <li><code>IndexError</code>：列表索引超出范围</li>
          <li><code>TypeError</code>：类型不匹配的操作</li>
        </ul>
        <h3>finally：无论如何都会执行</h3>
        <div class="code-block">try:
    result = 10 / 0
except ZeroDivisionError:
    result = None
    print("除数不能为0")
finally:
    print("处理完毕")  # 这行无论是否出错都会执行</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 AI训练师的实际用法</span>
          批量处理成千上万条业务数据时，不可能保证每一条都干净。用 try/except 包住容易出错的转换/计算步骤，是数据清洗阶段非常常见的写法。
        </div>
      `,
      practice: {
        prompt: "有一组字符串形式的信用额度数据 <code>raw = ['20000', '45000', 'N/A', '15000', 'error', '60000']</code>。请用 try/except 把能转换成整数的值转换后放入列表 <code>clean_amounts</code>，无法转换的直接跳过（不要让程序崩溃）。",
        starterCode: `raw = ['20000', '45000', 'N/A', '15000', 'error', '60000']
clean_amounts = []
# TODO: 遍历 raw，用 try/except 尝试 int() 转换，成功就加入 clean_amounts
`,
        referenceCode: `raw = ['20000', '45000', 'N/A', '15000', 'error', '60000']
clean_amounts = []
for v in raw:
    try:
        clean_amounts.append(int(v))
    except ValueError:
        pass
print(clean_amounts)`,
        checkCode: `
try:
    assert 'clean_amounts' in globals(), "没有找到变量 clean_amounts"
    expected = [20000, 45000, 15000, 60000]
    assert list(clean_amounts) == expected, f"结果不对，期望 {expected}，你得到的是 {list(clean_amounts)}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！成功过滤掉了'N/A'和'error'这两个脏数据。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
`,
      },
    },

    {
      id: "m1-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "下面哪段代码能正确计算 10 除以 3 的余数？",
            options: ["10 / 3", "10 // 3", "10 % 3", "10 ** 3"],
            answerIndex: 2,
            explain: "% 是取余运算符，10 % 3 = 1。// 是整除（商），/ 是普通除法，** 是幂运算。",
          },
          {
            q: "Python 用什么方式表示代码块（比如 if 里面的内容）？",
            options: ["花括号 {}", "缩进（空格/Tab）", "分号 ;", "begin/end 关键字"],
            answerIndex: 1,
            explain: "Python 用缩进来表示代码块层级，这是它和大多数语言最大的语法差异之一。",
          },
          {
            q: "列表推导式 [n for n in [1,2,3,4] if n % 2 == 0] 的结果是什么？",
            options: ["[1, 2, 3, 4]", "[2, 4]", "[1, 3]", "[True, False, True, False]"],
            answerIndex: 1,
            explain: "这个推导式遍历[1,2,3,4]，只保留n能被2整除（即偶数）的元素，结果是[2, 4]。",
          },
          {
            q: "下面代码的输出是什么？\nfuncs = []\nfor i in range(3):\n    funcs.append(lambda: i)\nprint([f() for f in funcs])",
            options: ["[0, 1, 2]", "[2, 2, 2]", "[0, 0, 0]", "报错"],
            answerIndex: 1,
            explain: "这是闭包的延迟绑定坑：所有lambda共享同一个变量i，调用时循环已结束，i的值固定为最后的2，所以输出是[2, 2, 2]。",
          },
          {
            q: "想要在'可能出错的代码'执行出错时不让程序崩溃，而是执行一段替代逻辑，应该用什么语句？",
            options: ["if / else", "for / else", "try / except", "def / return"],
            answerIndex: 2,
            explain: "try/except 用于捕获并处理异常，让程序在出错时不崩溃，而是走except里的替代逻辑。",
          },
        ],
      },
    },
  ],
});
