COURSE_MODULES.push({
  id: "m7",
  title: "AI模型推理与交互流程设计",
  icon: "🔍",
  lessons: [
    {
      id: "m7-l1",
      title: "图像识别标准推理流程",
      type: "learn",
      learnHtml: `
        <div class="callout callout-warn">
          <span class="callout-title">⚠️ 本模块为概念向模块</span>
          本模块涉及的 <code>onnxruntime</code> 库目前没办法在浏览器里运行，所以这里换成"流程讲解 + 代码精读 + 判断题"的方式学习，不要求你真实跑代码。这是整门课唯一的例外（在模块0里已经提前说明过）。
        </div>
        <h3>一个图像识别模型的推理（Inference）要经过哪几步</h3>
        <p>无论识别手写数字、人脸还是表情，几乎所有基于深度学习的图像识别任务，推理阶段都遵循同一套标准流程：</p>
        <ol>
          <li><strong>图像预处理（Preprocessing）</strong>：把原始图片转成模型能接受的格式——通常包括缩放到固定尺寸（如28×28或224×224）、转灰度或保留RGB通道、像素值归一化（比如从0~255缩放到0~1）、调整维度顺序（HWC转CHW）等。</li>
          <li><strong>模型推理（Inference）</strong>：把预处理好的数据丢进加载好的模型（比如ONNX格式的模型文件），模型输出一组"原始分数"（logits），还不是最终概率。</li>
          <li><strong>Softmax归一化</strong>：把模型输出的原始分数转换成0~1之间、总和为1的概率分布，这样才能解读成"属于每个类别的概率"。</li>
          <li><strong>Top-K选取</strong>：从概率分布里取出概率最高的K个类别作为最终识别结果（比如Top-1就是只取概率最高的那一个，Top-5是取前5个）。</li>
        </ol>
        <div class="code-block"># 典型的ONNX推理代码结构（概念示意，非浏览器可执行）
import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("model.onnx")        # 1. 加载模型

img = preprocess(raw_image)                            # 2. 预处理：缩放+归一化+转换维度
img = img.astype(np.float32).reshape(1, 1, 28, 28)      # 匹配模型期望的输入形状

outputs = session.run(None, {"input": img})             # 3. 推理，得到原始分数(logits)
logits = outputs[0][0]

probs = np.exp(logits) / np.sum(np.exp(logits))          # 4. Softmax归一化成概率
top_k_idx = np.argsort(probs)[::-1][:5]                   # 5. Top-5：概率最高的5个类别下标
print(top_k_idx, probs[top_k_idx])</div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          手写数字识别、人脸识别、表情识别这几类真题，推理阶段的代码结构几乎完全一样——区别只在于预处理细节（图片尺寸、是否灰度化）和最终类别标签的含义（数字0-9 / 人物身份 / 表情类别），核心的"预处理→推理→softmax→topK"四步骨架是通用的。
        </div>
      `,
      practice: {
        prompt: "判断题：下面这段推理代码里，变量 <code>probs</code> 和 <code>logits</code> 的主要区别是什么？",
        noExec: true,
        codeToRead: `outputs = session.run(None, {"input": img})
logits = outputs[0][0]
probs = np.exp(logits) / np.sum(np.exp(logits))`,
        choiceQuestion: "logits 和 probs 的主要区别是？",
        choices: [
          "两者完全一样，只是变量名不同",
          "logits是模型直接输出的原始分数（可能是负数、总和不为1），probs是经过Softmax后0~1之间、总和为1的概率分布",
          "logits是最终识别结果，probs是中间过程",
          "probs是图片预处理后的像素值",
        ],
        answerIndex: 1,
        explain: "模型输出的logits只是未经处理的原始分数，没有明确的概率含义；经过Softmax变换后才能得到可以直接解读为\"属于某类别的概率\"的probs，这也是为什么推理流程里Softmax是必不可少的一步。",
      },
    },

    {
      id: "m7-l2",
      title: "ONNX推理真题代码精读",
      type: "learn",
      learnHtml: `
        <h3>为什么用 ONNX 格式</h3>
        <p>训练模型时可能用PyTorch、TensorFlow等不同框架，但部署到实际产品里时，往往希望用一套统一、轻量、跨平台的格式来运行模型推理——<strong>ONNX（Open Neural Network Exchange）</strong>就是为此设计的通用模型交换格式，<code>onnxruntime</code> 是专门用来运行ONNX模型的高性能推理引擎。</p>
        <h3>手写数字识别场景代码精读</h3>
        <div class="code-block">import onnxruntime as ort
import numpy as np
from PIL import Image

# 1. 加载模型（只需要加载一次，不要在每次识别时都重新加载）
session = ort.InferenceSession("mnist_model.onnx")
input_name = session.get_inputs()[0].name   # 获取模型输入节点的名字

# 2. 读取并预处理图片
img = Image.open("digit.png").convert("L")   # 转为灰度图（手写数字识别通常不需要颜色信息）
img = img.resize((28, 28))                     # MNIST模型标准输入尺寸是28x28
img_array = np.array(img).astype(np.float32) / 255.0   # 归一化到0~1
img_array = img_array.reshape(1, 1, 28, 28)              # (批次, 通道, 高, 宽)

# 3. 推理
outputs = session.run(None, {input_name: img_array})
logits = outputs[0][0]

# 4. 后处理：找出概率最高的数字
predicted_digit = int(np.argmax(logits))
print(f"识别结果: {predicted_digit}")</div>
        <div class="callout callout-tip">
          <span class="callout-title">💡 几个容易出错的细节</span>
          <ul style="margin:4px 0 0 0;padding-left:18px;">
            <li>忘记归一化（除以255）会导致模型输入分布和训练时不一致，预测结果完全错乱</li>
            <li>图片尺寸不匹配模型要求的输入形状，会直接报错</li>
            <li><code>np.argmax(logits)</code> 和先做Softmax再取最大值，结果是一样的（Softmax是单调变换，不改变相对大小关系），所以只要是找"最大的那一个"，可以省略Softmax这一步；但如果要展示具体的置信度百分比，就必须做Softmax。</li>
          </ul>
        </div>
      `,
      practice: {
        prompt: "判断题：下面是人脸表情识别真题中的一段代码，请判断其中的bug。",
        noExec: true,
        codeToRead: `img = Image.open("face.jpg").convert("L")
img = img.resize((48, 48))
img_array = np.array(img).astype(np.float32)   # 忘记写归一化这一步！
img_array = img_array.reshape(1, 1, 48, 48)

outputs = session.run(None, {input_name: img_array})
emotion = int(np.argmax(outputs[0][0]))`,
        choiceQuestion: "这段代码最可能导致什么问题？",
        choices: [
          "代码会直接报错，无法运行",
          "没有把像素值归一化（除以255），导致输入数据分布和模型训练时不一致，识别结果很可能是错的",
          "resize的尺寸写错了",
          "没有问题，可以正常使用",
        ],
        answerIndex: 1,
        explain: "训练模型时输入数据通常被归一化到0~1或-1~1之间，推理时如果忘记做同样的归一化，输入到模型的数值范围会和训练时差很多，模型会给出不可靠甚至完全错误的预测结果。这是ONNX推理真题里最常考察的「找bug」类型。",
      },
    },

    {
      id: "m7-l3",
      title: "人机交互流程设计原则",
      type: "learn",
      learnHtml: `
        <h3>AI训练师为什么要懂交互设计</h3>
        <p>AI模型本身只是"算法黑盒"，真正要让用户用起来，还需要设计一套完整的人机交互流程——比如"用户上传图片→系统提示正在识别→展示结果→允许用户反馈纠错"。AI训练师经常需要参与设计这类流程，并评估流程是否合理。</p>
        <h3>核心设计原则</h3>
        <ul>
          <li><strong>及时反馈</strong>：模型推理需要时间，应该给用户明确的"处理中"状态提示，避免用户以为系统卡死了。</li>
          <li><strong>容错与引导</strong>：如果用户上传的图片不符合要求（比如太模糊、角度不对），系统应该给出清晰的引导提示，而不是直接报错或者返回错误的识别结果。</li>
          <li><strong>置信度透明</strong>：当模型识别的置信度（概率）较低时，应该告知用户"识别结果不确定"，而不是把低置信度的结果当成确定答案直接呈现，避免误导。</li>
          <li><strong>人工复核通道</strong>：对于高风险场景（比如身份核验、医疗辅助诊断），应该设计人工复核/申诉的流程，不能让AI模型单独做最终决定。</li>
          <li><strong>反馈闭环</strong>：收集用户对识别结果的纠错反馈，这些数据可以用来后续改进模型（也是数据标注工作的来源之一）。</li>
        </ul>
        <div class="callout callout-exam">
          <span class="callout-title">📝 真题关联</span>
          职业技能真题里"设计一个人脸识别门禁系统的交互流程"这类题目，考察的就是能否覆盖"识别中反馈→识别失败重试引导→低置信度二次确认→异常情况人工介入"这几个关键环节，而不是只会说"调用模型识别"。
        </div>
      `,
      practice: {
        prompt: "判断题：某人脸识别门禁系统，当识别置信度低于60%时，系统的处理方式如下，请判断是否合理。",
        noExec: true,
        codeToRead: `# 系统逻辑伪代码
if confidence >= 0.6:
    开门()
else:
    开门()  # 置信度不够也直接开门，不做任何提示`,
        choiceQuestion: "这个设计是否合理？",
        choices: [
          "合理，只要能开门就说明系统工作正常",
          "不合理，低置信度时应该拒绝直接放行，并引导用户重新尝试或走人工核验通道，而不是照常开门",
          "合理，置信度不重要，只要有识别结果就应该采用",
          "不合理，但原因是识别速度太慢",
        ],
        answerIndex: 1,
        explain: "门禁系统属于高风险/安全敏感场景，低置信度意味着模型本身对这次识别也不确定，直接按识别结果放行会带来安全隐患。合理的设计应该是：低置信度时拒绝/提示重试，必要时转人工核验，这正是\"置信度透明\"和\"人工复核通道\"两个设计原则的体现。",
      },
    },

    {
      id: "m7-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "图像识别推理流程中，\"预处理\"这一步通常不包括下面哪一项？",
            options: ["图像缩放到固定尺寸", "像素值归一化", "计算模型的训练损失(loss)", "调整通道/维度顺序"],
            answerIndex: 2,
            explain: "计算训练损失是模型训练阶段的工作，推理（inference）阶段模型参数已经固定，不需要也不会计算训练损失。",
          },
          {
            q: "模型输出的 logits 和经过 Softmax 后的 probs，在\"找出概率最大的类别\"这个目的上，两者结果是否一致？",
            options: ["不一致，必须先做Softmax才能找到正确的最大值", "一致，因为Softmax是单调变换，不改变各类别分数之间的相对大小顺序", "完全无关，无法比较", "只有二分类才一致"],
            answerIndex: 1,
            explain: "Softmax是单调递增变换，不会改变原始分数之间的大小顺序，所以np.argmax(logits)和np.argmax(probs)结果是一样的；但如果要展示具体的概率/置信度百分比，就必须做Softmax变换。",
          },
          {
            q: "ONNX格式存在的主要目的是什么？",
            options: [
              "替代Python语言",
              "作为不同深度学习框架之间的通用模型交换格式，方便用统一的推理引擎(onnxruntime)部署运行",
              "专门用来存储训练数据",
              "只能在浏览器里使用",
            ],
            answerIndex: 1,
            explain: "ONNX是为了解决不同训练框架（PyTorch/TensorFlow等）导出的模型格式不统一、部署困难的问题而设计的通用格式。",
          },
          {
            q: "在高风险场景（如门禁、医疗辅助诊断）里，当模型识别置信度较低时，最合理的做法是？",
            options: ["直接采用识别结果，不做任何处理", "拒绝/提示重试，并提供人工复核通道", "提高识别速度", "降低置信度阈值，让更多结果通过"],
            answerIndex: 1,
            explain: "低置信度意味着模型本身也不确定，高风险场景应优先保证安全性，通过拒绝/重试引导和人工复核来兜底，而不是让AI单独做最终决定。",
          },
        ],
      },
    },
  ],
});
