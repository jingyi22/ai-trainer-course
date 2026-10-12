COURSE_MODULES.push({
  id: "m6",
  title: "神经网络入门",
  icon: "🧠",
  lessons: [
    {
      id: "m6-l1",
      title: "感知机与激活函数",
      type: "learn",
      learnHtml: `
        <h3>神经网络最基本的单元：神经元</h3>
        <p>一个神经元做的事情很简单：把输入乘上权重、加起来、加上偏置（bias），再丢进一个"激活函数"做非线性变换。</p>
        <div class="code-block">import numpy as np

inputs = np.array([0.5, 0.8, 0.2])
weights = np.array([0.4, -0.3, 0.6])
bias = 0.1

z = np.dot(inputs, weights) + bias   # 加权求和
print(z)</div>
        <h3>激活函数：引入非线性</h3>
        <p>如果没有激活函数，再多层神经网络叠加起来也只是一个线性函数，表达能力很有限。常用的激活函数：</p>
        <div class="code-block">def sigmoid(x):
    return 1 / (1 + np.exp(-x))      # 输出压缩到(0,1)之间，常用于二分类输出层

def relu(x):
    return np.maximum(0, x)           # 负数变0，正数不变，是目前最常用的激活函数

print(sigmoid(z))
print(relu(z))</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 为什么ReLU更常用</span>
          Sigmoid在输入很大或很小时，梯度会趋近于0（"梯度消失"），导致深层网络训练很慢。ReLU计算简单且不容易出现这个问题，是现代神经网络隐藏层的默认选择。
        </div>
      `,
      practice: {
        prompt: "请实现 <code>sigmoid(x)</code> 和 <code>relu(x)</code> 两个函数（<code>x</code>是numpy数组），然后对 <code>z = np.array([-2.0, -0.5, 0.0, 0.5, 2.0])</code> 分别计算，结果存入 <code>sig_result</code> 和 <code>relu_result</code>。",
        setupCode: `import numpy as np
z = np.array([-2.0, -0.5, 0.0, 0.5, 2.0])`,
        starterCode: `def sigmoid(x):
    pass  # TODO: 返回 1 / (1 + np.exp(-x))

def relu(x):
    pass  # TODO: 返回 np.maximum(0, x)

sig_result = None  # TODO: sigmoid(z)
relu_result = None  # TODO: relu(z)
print(sig_result)
print(relu_result)`,
        referenceCode: `def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def relu(x):
    return np.maximum(0, x)

sig_result = sigmoid(z)
relu_result = relu(z)
print(sig_result)
print(relu_result)`,
        packages: ["numpy"],
        checkCode: `
try:
    import numpy as np
    assert sig_result is not None, "sig_result 还是 None"
    expected_sig = 1 / (1 + np.exp(-z))
    assert np.allclose(sig_result, expected_sig), "sigmoid计算结果不对"
    assert relu_result is not None, "relu_result 还是 None"
    expected_relu = np.array([0.0, 0.0, 0.0, 0.5, 2.0])
    assert np.allclose(relu_result, expected_relu), f"relu计算结果不对，期望{expected_relu}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！sigmoid和relu都实现对了。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m6-l2",
      title: "前馈神经网络结构（Layer类）",
      type: "learn",
      learnHtml: `
        <h3>把神经元组织成"层"</h3>
        <p>一层神经网络（Layer）包含多个神经元，可以用矩阵运算一次性计算一整层所有神经元的输出，而不用一个个写循环。</p>
        <div class="code-block">import numpy as np

class Layer:
    def __init__(self, n_inputs, n_neurons):
        self.weights = np.random.randn(n_inputs, n_neurons) * 0.1
        self.biases = np.zeros(n_neurons)

    def forward(self, inputs):
        self.output = np.dot(inputs, self.weights) + self.biases
        return self.output

layer1 = Layer(n_inputs=3, n_neurons=4)   # 3个输入特征 -> 4个神经元
x = np.array([[0.5, 0.8, 0.2]])             # 1条样本，3个特征
print(layer1.forward(x))                    # 输出形状 (1, 4)</div>
        <h3>多层堆叠 = "前馈神经网络"</h3>
        <div class="code-block">def relu(x):
    return np.maximum(0, x)

layer1 = Layer(3, 4)
layer2 = Layer(4, 1)     # 第二层输入要跟第一层输出维度(4)对齐

h = relu(layer1.forward(x))   # 第一层输出 -> 激活函数
out = layer2.forward(h)        # 第二层：输出最终结果
print(out)</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 "前馈"的意思</span>
          数据从输入层一路向前流动，经过一层层的加权求和+激活函数，最终到输出层，没有"回头"的连接，所以叫前馈（feedforward）神经网络，这是最基础的网络结构。
        </div>
      `,
      practice: {
        prompt: "请完成 <code>Layer</code> 类的 <code>forward</code> 方法（计算 <code>np.dot(inputs, self.weights) + self.biases</code>），然后创建一个 <code>Layer(n_inputs=2, n_neurons=3)</code> 存入变量 <code>layer</code>，用输入 <code>x = np.array([[1.0, 2.0]])</code> 计算输出存入变量 <code>out</code>。",
        setupCode: `import numpy as np
np.random.seed(0)`,
        starterCode: `class Layer:
    def __init__(self, n_inputs, n_neurons):
        self.weights = np.random.randn(n_inputs, n_neurons) * 0.1
        self.biases = np.zeros(n_neurons)

    def forward(self, inputs):
        pass  # TODO: 返回 np.dot(inputs, self.weights) + self.biases

layer = None  # TODO: Layer(n_inputs=2, n_neurons=3)
x = np.array([[1.0, 2.0]])
out = None  # TODO: layer.forward(x)
print(out.shape)`,
        referenceCode: `class Layer:
    def __init__(self, n_inputs, n_neurons):
        self.weights = np.random.randn(n_inputs, n_neurons) * 0.1
        self.biases = np.zeros(n_neurons)

    def forward(self, inputs):
        return np.dot(inputs, self.weights) + self.biases

layer = Layer(n_inputs=2, n_neurons=3)
x = np.array([[1.0, 2.0]])
out = layer.forward(x)
print(out.shape)`,
        packages: ["numpy"],
        checkCode: `
try:
    assert layer is not None, "layer 还是 None"
    assert out is not None, "out 还是 None"
    assert out.shape == (1, 3), f"out的形状应该是(1,3)，你得到{out.shape}"
    __CHECK_RESULT__ = {"passed": True, "message": "正确！Layer类的forward方法实现成功，输出形状符合预期。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m6-l3",
      title: "梯度下降直觉",
      type: "learn",
      learnHtml: `
        <h3>模型是怎么"学习"的</h3>
        <p>神经网络一开始的权重是随机的，预测结果自然很差。<strong>梯度下降</strong>是让模型"变好"的核心算法：不断微调权重，让预测误差（损失/loss）越来越小。</p>
        <h3>一个最简单的例子：拟合 y = 2x</h3>
        <p>假设我们知道真实关系是 <code>y = 2x</code>，但模型不知道，只能从数据里"猜"出权重 <code>w</code>。用均方误差（MSE）衡量猜测的好坏：</p>
        <div class="code-block">import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0])
y_true = 2 * x   # 真实值：[2, 4, 6, 8]

w = 0.0            # 初始猜测（很差）
lr = 0.01          # 学习率：每次调整的步长

for step in range(100):
    y_pred = w * x
    error = y_pred - y_true
    loss = np.mean(error ** 2)              # MSE损失
    grad = np.mean(2 * error * x)            # 损失函数对w的梯度（导数）
    w = w - lr * grad                         # 梯度下降：沿梯度反方向调整w
    if step % 20 == 0:
        print(f"step={step}, w={w:.3f}, loss={loss:.4f}")</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 直觉理解</span>
          梯度告诉我们"往哪个方向调整w，损失会变大"，所以要往<strong>反方向</strong>调整（梯度下降里的"下降"）。学习率(lr)太大容易震荡发散，太小则学习太慢，这是调参时最常遇到的权衡。
        </div>
      `,
      practice: {
        prompt: "参照上面的例子，对 <code>x = np.array([1.0, 2.0, 3.0, 4.0])</code>、<code>y_true = 3 * x</code>（真实关系是y=3x），从 <code>w = 0.0</code> 开始，用学习率 <code>lr = 0.01</code> 跑 <code>200</code> 轮梯度下降，把最终的 <code>w</code> 存入变量 <code>w</code>（应该非常接近3.0）。",
        setupCode: `import numpy as np
x = np.array([1.0, 2.0, 3.0, 4.0])
y_true = 3 * x`,
        starterCode: `w = 0.0
lr = 0.01
for step in range(200):
    y_pred = w * x
    error = y_pred - y_true
    grad = None  # TODO: np.mean(2 * error * x)
    w = w  # TODO: w = w - lr * grad
print(w)`,
        referenceCode: `w = 0.0
lr = 0.01
for step in range(200):
    y_pred = w * x
    error = y_pred - y_true
    grad = np.mean(2 * error * x)
    w = w - lr * grad
print(w)`,
        packages: ["numpy"],
        checkCode: `
try:
    assert abs(w - 3.0) < 0.1, f"w应该非常接近3.0，你得到{w}"
    __CHECK_RESULT__ = {"passed": True, "message": f"正确！经过200轮梯度下降，w收敛到了{w:.4f}，非常接近真实值3.0。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m6-l4",
      title: "实战：手写小型网络拟合数据",
      type: "learn",
      learnHtml: `
        <h3>把前面的知识组合起来</h3>
        <p>现在用一个只有1个隐藏层的小型神经网络，拟合一个非线性关系：<code>y = x1 * x2</code>（简单的"异或式"非线性问题，单层线性模型拟合不好，需要隐藏层+激活函数）。</p>
        <div class="code-block">import numpy as np
np.random.seed(42)

X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[0],[0],[1]], dtype=float)   # 逻辑AND：只有都为1时结果才是1

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_deriv(x):
    return x * (1 - x)

W1 = np.random.randn(2, 4) * 0.5
b1 = np.zeros(4)
W2 = np.random.randn(4, 1) * 0.5
b2 = np.zeros(1)
lr = 0.5

for epoch in range(2000):
    # 前向传播
    h = sigmoid(np.dot(X, W1) + b1)
    out = sigmoid(np.dot(h, W2) + b2)

    # 计算损失
    loss = np.mean((out - y) ** 2)

    # 反向传播（链式法则求梯度）
    d_out = (out - y) * sigmoid_deriv(out)
    d_W2 = np.dot(h.T, d_out)
    d_b2 = np.sum(d_out, axis=0)
    d_h = np.dot(d_out, W2.T) * sigmoid_deriv(h)
    d_W1 = np.dot(X.T, d_h)
    d_b1 = np.sum(d_h, axis=0)

    # 梯度下降更新参数
    W1 -= lr * d_W1; b1 -= lr * d_b1
    W2 -= lr * d_W2; b2 -= lr * d_b2

    if epoch % 500 == 0:
        print(f"epoch={epoch}, loss={loss:.4f}")

print(out)   # 训练后应该接近 [[0],[0],[0],[1]]</div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 对应教材</span>
          这个实现对应PDF1教材第8章"纯NumPy手写神经网络"的核心思路：前向传播算输出 → 计算损失 → 反向传播算梯度 → 梯度下降更新参数，循环往复直到loss收敛。
        </div>
      `,
      practice: {
        prompt: "环境里已经写好了完整的训练代码（逻辑AND问题），请运行它，并把训练<strong>最后一轮</strong>的 <code>loss</code> 存入变量 <code>final_loss</code>（应该是一个很小的数，小于0.05），把最终的预测 <code>out</code> 存入 <code>final_out</code>。",
        setupCode: `import numpy as np
np.random.seed(42)
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[0],[0],[1]], dtype=float)

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_deriv(x):
    return x * (1 - x)`,
        starterCode: `W1 = np.random.randn(2, 4) * 0.5
b1 = np.zeros(4)
W2 = np.random.randn(4, 1) * 0.5
b2 = np.zeros(1)
lr = 0.5

final_loss = None
final_out = None

for epoch in range(2000):
    h = sigmoid(np.dot(X, W1) + b1)
    out = sigmoid(np.dot(h, W2) + b2)
    loss = np.mean((out - y) ** 2)

    d_out = (out - y) * sigmoid_deriv(out)
    d_W2 = np.dot(h.T, d_out)
    d_b2 = np.sum(d_out, axis=0)
    d_h = np.dot(d_out, W2.T) * sigmoid_deriv(h)
    d_W1 = np.dot(X.T, d_h)
    d_b1 = np.sum(d_h, axis=0)

    W1 -= lr * d_W1; b1 -= lr * d_b1
    W2 -= lr * d_W2; b2 -= lr * d_b2

    # TODO: 在循环最后一轮，把 loss 存入 final_loss，把 out 存入 final_out

print(final_loss)
print(final_out)`,
        referenceCode: `W1 = np.random.randn(2, 4) * 0.5
b1 = np.zeros(4)
W2 = np.random.randn(4, 1) * 0.5
b2 = np.zeros(1)
lr = 0.5

final_loss = None
final_out = None

for epoch in range(2000):
    h = sigmoid(np.dot(X, W1) + b1)
    out = sigmoid(np.dot(h, W2) + b2)
    loss = np.mean((out - y) ** 2)

    d_out = (out - y) * sigmoid_deriv(out)
    d_W2 = np.dot(h.T, d_out)
    d_b2 = np.sum(d_out, axis=0)
    d_h = np.dot(d_out, W2.T) * sigmoid_deriv(h)
    d_W1 = np.dot(X.T, d_h)
    d_b1 = np.sum(d_h, axis=0)

    W1 -= lr * d_W1; b1 -= lr * d_b1
    W2 -= lr * d_W2; b2 -= lr * d_b2

    if epoch == 1999:
        final_loss = loss
        final_out = out

print(final_loss)
print(final_out)`,
        packages: ["numpy"],
        checkCode: `
try:
    assert final_loss is not None, "final_loss 还是 None，记得在循环最后一轮赋值"
    assert final_loss < 0.05, f"final_loss应该小于0.05（训练收敛），你得到{final_loss}"
    assert final_out is not None, "final_out 还是 None"
    __CHECK_RESULT__ = {"passed": True, "message": f"正确！网络成功收敛，最终loss为{final_loss:.5f}，预测结果已经接近真实的逻辑AND规律。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m6-l5",
      title: "过拟合与正则化概念",
      type: "learn",
      learnHtml: `
        <h3>什么是过拟合</h3>
        <p>模型在训练集上表现很好（loss很低），但在没见过的测试集上表现很差——这说明模型"记住"了训练数据的细节/噪声，而不是学到了真正的规律。这叫<strong>过拟合（overfitting）</strong>。</p>
        <div class="code-block"># 典型表现：训练集准确率95%，测试集准确率只有60%
print(f"训练集准确率: {train_acc:.2%}")
print(f"测试集准确率: {test_acc:.2%}")
# 如果两者差距很大，很可能是过拟合</div>
        <h3>常见的应对方法</h3>
        <ul>
          <li><strong>增加训练数据</strong>：数据越多，模型越难"死记硬背"</li>
          <li><strong>正则化（Regularization）</strong>：在损失函数里加一项惩罚权重过大的项，逼着模型学得更"简单"</li>
          <li><strong>Dropout</strong>：训练时随机"关闭"一部分神经元，防止模型过度依赖某些特定神经元</li>
          <li><strong>早停（Early Stopping）</strong>：监控测试集表现，一旦不再提升就停止训练，不让它继续"死记硬背"</li>
          <li><strong>减少模型复杂度</strong>：层数/神经元太多也容易过拟合，适当简化模型结构</li>
        </ul>
        <h3>与"欠拟合"相对</h3>
        <p>如果模型在训练集上表现就很差，说明模型太简单，根本没学到规律，这叫<strong>欠拟合（underfitting）</strong>，这时反而应该增加模型复杂度或训练更久。</p>
        <div class="callout callout-tip">
          <span class="callout-title">💡 判断口诀</span>
          训练集好、测试集差 → 过拟合，想办法让模型"简单"一点或数据"多"一点；训练集和测试集都差 → 欠拟合，想办法让模型"复杂"一点或训练更久。
        </div>
      `,
      practice: {
        prompt: "判断题：某模型在训练集上的准确率是98%，在测试集上的准确率是64%。这最可能是什么问题？",
        noExec: true,
        codeToRead: `训练集准确率: 98%
测试集准确率: 64%
（训练集和测试集的数据分布是一致的，划分方式也没问题）`,
        choiceQuestion: "根据以上场景，最可能的原因是什么？",
        choices: [
          "欠拟合，模型学习能力不足",
          "过拟合，模型记住了训练集细节但没有学到可泛化的规律",
          "数据集划分方式有问题，和模型本身无关",
          "这是正常现象，不需要处理",
        ],
        answerIndex: 1,
        explain: "训练集表现远好于测试集，是过拟合的典型信号。可以考虑加正则化、Dropout、早停，或者增加训练数据来缓解。",
      },
    },

    {
      id: "m6-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "ReLU激活函数 relu(x) = max(0, x) 对于输入 x = -3 的输出是？",
            options: ["-3", "0", "3", "报错"],
            answerIndex: 1,
            explain: "ReLU会把所有负数变成0，正数保持不变，所以relu(-3) = 0。",
          },
          {
            q: "一个Layer类的forward方法里，np.dot(inputs, self.weights) + self.biases 这行代码计算的是什么？",
            options: ["激活函数的输出", "加权求和（线性变换）的结果，还没经过激活函数", "损失函数的值", "梯度"],
            answerIndex: 1,
            explain: "这一步只是矩阵乘法+偏置的线性运算，得到的是\"净输入\"（通常记作z），还需要再经过激活函数才是这一层的最终输出。",
          },
          {
            q: "梯度下降算法中，为什么要用 w = w - lr * grad （减去梯度，而不是加上）？",
            options: ["这是随意的约定，加减都一样", "梯度指向损失增大最快的方向，减去它才能让损失变小", "为了让w变成负数", "这样计算更快"],
            answerIndex: 1,
            explain: "梯度（导数）指向函数值增大最快的方向，要让损失减小，就要沿梯度的反方向调整参数，所以是减去梯度乘以学习率。",
          },
          {
            q: "模型训练集准确率95%，测试集准确率60%，应该优先怀疑什么问题？",
            options: ["欠拟合", "过拟合", "模型根本没训练", "数据集太大"],
            answerIndex: 1,
            explain: "训练集表现远好于测试集是过拟合的典型信号，说明模型记住了训练数据细节而没有学到可泛化的规律。",
          },
          {
            q: "下面哪个不是常见的缓解过拟合的方法？",
            options: ["增加训练数据", "正则化", "Dropout", "故意减小训练集数据量"],
            answerIndex: 3,
            explain: "减小训练集数据量会让过拟合更严重，不是缓解方法；增加数据、正则化、Dropout都是常见有效手段。",
          },
        ],
      },
    },
  ],
});
