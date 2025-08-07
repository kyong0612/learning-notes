---
title: "gpt-oss の使い方｜npaka"
source: "https://note.com/npaka/n/nf39f327c3bde"
author:
  - "[[npaka]]"
published: 2025-08-06
created: 2025-08-07
description: |
  OpenAIが発表したオープンウェイトモデルファミリー「gpt-oss」について解説した記事の要約。gpt-oss-120b（117Bパラメータ）とgpt-oss-20b（21Bパラメータ）の2モデルから成り、MoEアーキテクチャとMXFP4量子化により高効率な推論を実現。機能、アーキテクチャ、HuggingFace Inference Providersやローカル環境（Transformers, Llama.cpp, vLLM）での推論方法、ファインチューニング、Azure/Dellへのデプロイ方法まで幅広くカバーしている。
tags:
  - "AI"
  - "ChatGPT"
  - "生成AI"
  - "OpenAI"
  - "ローカルLLM"
  - "gpt-oss"
---
![見出し画像](https://assets.st-note.com/production/uploads/images/206683024/rectangle_large_type_2_911f0753614825322e5cdf141d86fff9.png?width=1200)

# gpt-oss の使い方

以下の記事が面白かったので、簡単にまとめました。

> **・**[**Welcome GPT OSS, the new open-source model family from OpenAI!**](https://huggingface.co/blog/welcome-openai-gpt-oss)

## 1. gpt-oss

「**gpt-oss**」は、OpenAIによる待望のオープンウェイトリリースであり、強力なReasoning、エージェントタスク、そして多様な開発者ユースケース向けに設計されています。117Bのパラメータを持つ大規模モデル「**gpt-oss-120b**」と、21Bのパラメータを持つ小規模モデル「**gpt-oss-20b**」の2つのモデルで構成されています。どちらも「MoE」(Mixture-of-Experts) であり、MXFP4を使用することで、リソース使用量を抑えながら高速推論を実現します。大規模モデルは単一のH100 GPUに収まり、小規模モデルは16GBのメモリ内で動作し、コンシューマーハードウェアやデバイス内アプリケーションに最適です。コミュニティにとってより優れた、より影響力のあるものにするために、モデルはApache 2.0ライセンスと最小限の使用ポリシーに基づいてライセンスされています。

## 2. gpt-ossの機能とアーキテクチャ

### 2-1. 機能

> ・合計パラメータ数は21Bと117Bで、アクティブパラメータはそれぞれ36Bと51B。
> ・mxfp4形式を用いた4ビット量子化方式。MoEの重みにのみ適用。前述の通り、120Bは80GB GPU 1台に、20Bは16GB GPU 1台に収まる。
> ・Reasoningはテキストのみのモデルで、思考連鎖と調整可能なReasoningエフォートレベルを備えている。
> ・指示追跡とツール使用のサポート。
> ・Transformer、vLLM、llama.cpp、ollamaを使用した推論実装。
> ・推論には[Responses API](https://responses%20api/)を推奨。
> ・ライセンス：Apache 2.0 (小規模な補完的利用ポリシー付き)。

### 1-2. アーキテクチャ

> ・SwiGLU活性化を用いたトークン選択MoE。
> ・MoEの重みを計算する際、選択されたエキスパートに対してソフトマックス法 (softmax-after-topk) を適用。
> ・各アテンション層は、128KコンテキストのRoPEを使用。
> ・代替アテンション層：フルコンテキスト、および128トークンのスライディングウィンドウ。
> ・アテンション層は、ヘッドごとに学習済みのアテンションシンクを使用。ソフトマックスの分母には、追加の加法値がある。
> ・GPT-4oや他のOpenAI APIモデルと同じトークナイザーを使用。
> 　・Responses APIとの互換性を確保するために、いくつかの新しいトークンが組み込まれている。

## 3. Inference Profviders による推論

「gpt-oss」は、HuggingFaceの「[**Inference Providers**](https://huggingface.co/docs/inference-providers/en/index)」で推論できます。これにより、サポートされている任意のプロバイダーに、同じJavaScriptまたはPythonコードを使用してリクエストを送信できます。これは、gpt-oss.comにあるOpenAIの公式デモと同じインフラストラクチャであり、独自のプロジェクトにも使用できます。

以下は、Pythonと超高速なCerebrasプロバイダーを使用した例です。詳細情報と追加のコードについては、モデルカードの[推論プロバイダーセクション](https://huggingface.co/openai/gpt-oss-120b?inference_api=true&inference_provider=auto&language=python&client=openai)と、これらのモデル用に作成された[専用ガイド](https://huggingface.co/docs/inference-providers/guides/gpt-oss)を参照してください。

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ["HF_TOKEN"],
)

completion = client.chat.completions.create(
    model="openai/gpt-oss-120b:cerebras",
    messages=[
        {
            "role": "user",
            "content": "How many rs are in the word 'strawberry'?",
        }
    ],
)

print(completion.choices[0].message)
```

「Inference Profviders」は、OpenAI互換の「Responses API」も実装しています。これは、チャットモデル向けの最も高度なOpenAIインターフェースであり、より柔軟で直感的なインタラクションを実現するために設計されています。

以下は、Fireworks AIプロバイダーで「Responses API」を使用する例です。詳細については、オープンソースの[responses.js](https://github.com/huggingface/responses.js)プロジェクトを参照してください。

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.getenv("HF_TOKEN"),
)

response = client.responses.create(
    model="openai/gpt-oss-20b:fireworks-ai",
    input="How many rs are in the word 'strawberry'?",
)

print(response)
```

## 4. ローカル推論

### 4-1. Transformers の使用

最新の Transformers (v4.55 以降) と、アクセラレータおよびカーネルをインストールする必要があります。

```bash
pip install --upgrade accelerate transformers kernels
```

モデルの重みは、Hopper または Blackwell ファミリーの GPU と互換性のある mxfp4 形式で量子化されます。これには、H100、H200、GB200 などのデータセンター向けカードや、50xx ファミリーの最新のコンシューマー向け GPU が含まれます。これらのカードをお持ちの場合、mxfp4 は速度とメモリ消費の点で最良の結果をもたらします。mxfp4 を使用するには、triton 3.4 と triton\_kernels が必要です。これらのライブラリがインストールされていない場合（または互換性のある GPU をお持ちでない場合）、モデルのロードは量子化された重みから展開された bfloat16 にフォールバックします。

HuggingFaceのテストでは、Triton 3.4 は最新の PyTorch バージョン (2.7.x) で正常に動作しました。代わりにPyTorch 2.8をインストールすることもできます。現時点ではプレリリース版ですが (近日リリース予定)、Triton 3.4と並行して準備されているため、安定して動作します。PyTorch 2.8 (Triton 3.4に付属) とTritonカーネルのインストール方法は次のとおりです。

```bash
# Optional step if you want PyTorch 2.8, otherwise just `pip install torch`
pip install torch==2.8.0 --index-url https://download.pytorch.org/whl/test/cu128

# Install triton kernels for mxfp4 support
pip install git+https://github.com/triton-lang/triton.git@main#subdirectory=python/triton_kernels
```

以下のコードは、20Bモデルを用いた単純な推論を示しています。mxfp4を使用する場合は16GBのGPUで、bfloat16を使用する場合は約48GBのGPUで実行されます。

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "openai/gpt-oss-20b"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="auto",
)

messages = [
    {"role": "user", "content": "How many rs are in the word 'strawberry'?"},
]

inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    return_tensors="pt",
    return_dict=True,
).to(model.device)

generated = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(generated[0][inputs["input_ids"].shape[-1]:]))
```

**・Flash Attention 3**
これらのモデルは、vLLMチームがFlash Attention 3に対応させたアテンションシンク技術を使用しています。最適化されたカーネルはkernels-community/vllm-flash-attn3にパッケージ化され、統合されています。現時点では、この超高速カーネルはPyTorch 2.7および2.8を搭載したHopperカードでテスト済みです。今後、カバレッジが拡大される予定です。Hopperカード (H100やH200など) でモデルを実行する場合は、`pip install --upgrade kernels`を実行し、コードに次の行を追加する必要があります。

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "openai/gpt-oss-20b"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="auto",
    # Flash Attention with Sinks
    attn_implementation="kernels-community/vllm-flash-attn3",
)

messages = [
    {"role": "user", "content": "How many rs are in the word 'strawberry'?"},
]

inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    return_tensors="pt",
    return_dict=True,
).to(model.device)

generated = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(generated[0][inputs["input_ids"].shape[-1]:]))
```

このコードは、以前のブログ記事で説明したように、kernels-communityから最適化されたコンパイル済みカーネルコードをダウンロードします。Transformersチームがコードをビルド、パッケージ化、テストしているので、完全に安全に利用できます。

**・その他の最適化**
Hopper GPU以上のGPUをお持ちの場合は、上記の理由からmxfp4の使用をお勧めします。さらに「Flash Attention 3」を使用できる場合は、ぜひ有効にしてください。

> GPUがmxfp4と互換性がない場合は、MegaBlocks MoEカーネルを使用することで大幅な速度向上が期待できます。そのためには、推論コードを以下のように調整するだけです。

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "openai/gpt-oss-20b"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="auto",
    # Optimize MoE layers with downloadable` MegaBlocksMoeMLP
    use_kernels=True,
)

messages = [
    {"role": "user", "content": "How many rs are in the word 'strawberry'?"},
]

inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    tokenize=True,
    return_tensors="pt",
    return_dict=True,
).to(model.device)

generated = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(generated[0][inputs["input_ids"].shape[-1]:]))

```

> MegaBlocks向けに最適化されたMoEカーネルでは、モデルをbfloat16で実行する必要があるため、mxfp4で実行する場合よりもメモリ消費量が高くなります。可能であればmxfp4の使用を推奨します。そうでない場合は、use\_kernels=TrueでMegaBlocksを有効にしてください。

**・AMD ROCmのサポート**
「gpt-oss」はAMD Instinctハードウェアで検証済みです。この度、カーネルライブラリでAMD ROCmプラットフォームの初期サポートを開始いたします。これにより、Transformers向けに最適化されたROCmカーネルの基盤が整います。MegaBlocks MoEカーネルアクセラレーションは、AMD Instinct (MI300シリーズなど) 上の「gpt-oss」で既に利用可能であり、トレーニングと推論の性能向上に貢献しています。上記と同じ推論コードでテストできます。

AMDは、ユーザーがAMDハードウェアでモデルを試用できるよう、HuggingFace Spaceも用意しました。

**・利用可能な最適化の概要**
この表は、執筆時点でのGPU互換性とテストに基づいた推奨事項をまとめたものです。Flash Attention 3（シンクアテンション付き）は、今後さらに多くのGPUに対応していく予定です。

![](https://assets.st-note.com/img/1754430503-mKS1rOEjzuX7BxflPp2VQiRN.png?width=1200)

120Bモデルは単一のH100 GPU (mxfp4を使用) に収まりますが、acceleratedまたはtorchrunを使用すれば複数のGPUで簡単に実行できます。Transformersはデフォルトの並列化プランを提供しており、最適化されたアテンションカーネルも利用できます。以下のコードは、4つのGPUを搭載したシステムで`torchrun --nproc_per_node=4 generate.py`を使用して実行できます。

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from transformers.distributed import DistributedConfig
import torch

model_path = "openai/gpt-oss-120b"
tokenizer = AutoTokenizer.from_pretrained(model_path, padding_side="left")

device_map = {
    "tp_plan": "auto",    # Enable Tensor Parallelism
}

model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype="auto",
    attn_implementation="kernels-community/vllm-flash-attn3",
    **device_map,
)

messages = [
     {"role": "user", "content": "Explain how expert parallelism works in large language models."}
]

inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    return_tensors="pt",
    return_dict=True,
).to(model.device)

outputs = model.generate(**inputs, max_new_tokens=1000)

# Decode and print
response = tokenizer.decode(outputs[0])
print("Model response:", response.split("<|channel|>final<|message|>")[-1].strip())

```

「gpt-oss」は、推論の一環としてツールの使用を活用するよう、広範囲に学習されています。

### 4-2. Llama.cpp

「Llama.cpp」は、「Flash Attention」によるネイティブ MXFP4 サポートを提供し、リリース直後から Metal、CUDA、Vulkan などの様々なバックエンドで最適な性能を実現します。

インストールするには、「llama.cpp」の Github リポジトリにあるガイドに従ってください。

```bash
# MacOS
brew install llama.cpp

# Windows
winget install llama.cpp
```

推奨される方法は、llama-server 経由で使用することです。

```bash
llama-server -hf ggml-org/gpt-oss-120b-GGUF -c 0 -fa --jinja --reasoning-format none

# Then, access http://localhost:8080
```

120Bと20Bの両方のモデルをサポートしています。詳細については、[こちらのPR](https://github.com/ggml-org/llama.cpp/pull/15091)または[GGUFモデルコレクション](https://huggingface.co/collections/ggml-org/gpt-oss-68923b60bee37414546c70bf)を参照してください。

### 4-3. vLLM

前述の通り、「vLLM」はシンクアテンションをサポートする最適化された「Flash Attention 3」カーネルを開発しました。そのため、Hopperカードで最高の結果が得られます。チャット補完APIとレスポンスAPIの両方がサポートされています。以下のコードでサーバをインストールして起動できます (H100 GPU 2基の使用を前提としています)。

```bash
vllm serve openai/gpt-oss-120b --tensor-parallel-size 2
```

または、次のように Python で直接使用します。

```python
from vllm import LLM
llm = LLM("openai/gpt-oss-120b", tensor_parallel_size=2)
output = llm.generate("San Francisco is a")
```

### 4-4. transformers serve

「Transformers Server」を使えば、他の依存関係なしに、モデルをローカルで試すことができます。サーバは以下のコマンドで起動できます。

```bash
transformers serve
```

[**Responses API**](https://platform.openai.com/docs/api-reference/responses) を使用してリクエストを送信できます。

```bash
# responses API
curl -X POST http://localhost:8000/v1/responses \
-H "Content-Type: application/json" \
-d '{"input": [{"role": "system", "content": "hello"}], "temperature": 1.0, "stream": true, "model": "openai/gpt-oss-120b"}'
```

標準の「Completions API」を使用してリクエストを送信することもできます。

```bash
# completions API
curl -X POST http://localhost:8000/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{"messages": [{"role": "system", "content": "hello"}], "temperature": 1.0, "max_tokens": 1000, "stream": true, "model": "openai/gpt-oss-120b"}'
```

## 5. ファインチューニング

**「gpt-oss」は「trl」に完全に統合**されています。「SFTTrainer」を使用したファインチューニング微調整の例をいくつか用意しました。

> **・**[**OpenAI cookbookに掲載されているLoRAの例**](https://cookbook.openai.com/articles/gpt-oss/fine-tune-transfomers)
> **・**[**基本的なファインチューニングスクリプト**](https://github.com/huggingface/gpt-oss-recipes/blob/main/sft.py)

## 6. HuggingFace パートナーへのデプロイ

### 6-1. Azure

HuggingFace は、Azure AI モデル カタログで Azure と連携し、テキスト、ビジョン、音声、マルチモーダルタスクなど、最も人気のあるオープンソース モデルをユーザーの環境に直接提供することで、Azure のエンタープライズ グレードのインフラストラクチャ、自動スケーリング、監視機能を活用し、マネージド オンライン エンドポイントへの安全なデプロイを実現します。

「gpt-oss」は、Azure AI モデル カタログ (gpt-oss-20b、gpt-oss-120b) で利用可能になり、オンライン エンドポイントにデプロイしてリアルタイム推論を実行できるようになりました。

![](https://assets.st-note.com/img/1754430777-vm9c54RPouJWxGUAebIzlENh.png?width=1200)

### 6-2. Dell

「Dell Enterprise Hub」は、Dellプラットフォームを使用してオンプレミスで最新のオープンAIモデルの学習と導入を簡素化する安全なオンラインポータルです。Dellとの共同開発により、最適化されたコンテナ、Dellハードウェアのネイティブサポート、そしてエンタープライズグレードのセキュリティ機能を提供します。

「gpt-oss」は現在「Dell Enterprise Hub」で利用可能で、Dellプラットフォームを使用してオンプレミスで導入できます。

![](https://assets.st-note.com/img/1754430807-NS0I3xJ7Wk6LQ1Aibaucfqdo.png?width=1200)

## 7. モデルの評価

「gpt-oss」はReasoningモデルであるため、評価には非常に大きな世代サイズ (新しいトークンの最大数) が必要です。これは、生成にはまずReasoningが含まれ、その後に実際の回答が含まれるためです。世代サイズが小さすぎると、Reasoningの途中で予測が中断され、偽陰性が発生するリスクがあります。そのため、特に数式や命令による評価において、解析エラーを回避するため、メトリクスを計算する前に、モデルの回答からReasoningのトレースを削除する必要があります。

lighteval (ソースからインストールする必要があります) を使用してモデルを評価する方法の例を以下に示します。

```bash
git clone https://github.com/huggingface/lighteval
pip install -e .[dev] # make sure you have the correct transformers version installed!
lighteval accelerate \
    "model_name=openai/gpt-oss-20b,max_length=16384,skip_special_tokens=False,generation_parameters={temperature:1,top_p:1,top_k:40,min_p:0,max_new_tokens:16384}" \
    "extended|ifeval|0|0,lighteval|aime25|0|0" \
    --save-details --output-dir "openai_scores" \
    --remove-reasoning-tags --reasoning-tags="[('<|channel|>analysis<|message|>','<|end|><|start|>assistant<|channel|>final<|message|>')]"
```

20Bモデルの場合、IFEval (厳格なプロンプト) で69.5 (+/-1.9)、AIME25(pass@1) で63.3(+/-8.9) というスコアが得られるはずです。これは、この規模の推論モデルとしては予想範囲内です。

カスタム評価スクリプトを実行する場合、推論タグを適切にフィルタリングするには、トークナイザーで `skip_special_tokens=False` を使用する必要があります。これにより、モデル出力で完全なトレースを取得できます (上記の例と同じ文字列ペアを使用して推論をフィルタリングするため)。理由は以下で説明します。

## 8. チャットとチャットテンプレート

### 8-1. チャットとチャットテンプレート

「gpt-oss」は、出力において「**channels**」という概念を使用します。多くの場合、「**analysis**」チャネルには思考の連鎖など、エンドユーザーへの送信を意図していない情報が含まれており、「**final**」チャネルには実際にユーザーに表示されるメッセージが含まれています。

ツールが使用されていない場合、モデル出力の構造は次のようになります。

```
<|start|>assistant<|channel|>analysis<|message|>CHAIN_OF_THOUGHT<|end|><|start|>assistant<|channel|>final<|message|>ACTUAL_MESSAGE
```

ほとんどの場合、`<|channel|>final<|message|>` の後のテキスト以外はすべて無視してください。このテキストのみをアシスタントメッセージとしてチャットに追加するか、ユーザーに表示されるようにしてください。ただし、このルールには2つの例外があります。学習中、またはモデルが外部ツールを呼び出す場合、分析メッセージを履歴に含める必要がある場合があります。

**・学習時**
学習用に例をフォーマットする場合、通常は最終メッセージに思考の連鎖を含める必要があります。これを行うのに適した場所は、**thinking**キーです。

```python
chat = [
    {"role": "user", "content": "Hi there!"},
    {"role": "assistant", "content": "Hello!"},
    {"role": "user", "content": "Can you think about this one?"},
    {"role": "assistant", "thinking": "Thinking real hard...", "content": "Okay!"}
]

# add_generation_prompt=False is generally only used in training, not inference
inputs = tokenizer.apply_chat_template(chat, add_generation_prompt=False)
```

以前のターンや、学習ではなくReasoningを行っているときに**thinking**キーを自由に含めることは可能ですが、通常は無視されます。チャットテンプレートには、最新の思考チェーンのみが含まれ、学習時(add\_generation\_prompt=False かつ最終ターンがアシスタントターンの場合) にのみ含まれます。

このようにする理由は微妙です。「gpt-oss」は、最終の思考チェーン以外はすべて削除されたマルチターンデータで学習されています。つまり、「gpt-oss」をファインチューニングする場合も、同様に行う必要があります。

> ・チャットテンプレートは、最後の思考の連鎖を除くすべての思考の連鎖を破棄します。
> ・最後のアシスタントターンを除くすべてのターンのラベルをマスクします。そうしないと、思考の連鎖のない前のターンで学習することになり、思考の連鎖のない応答を生成してしまうことになります。つまり、複数ターンの会話全体を単一のサンプルとして学習することはできません。代わりに、アシスタントターンごとに1つのサンプルに分割し、毎回最後のアシスタントターンのみをマスク解除する必要があります。そうすることで、モデルは各ターンから学習しながら、毎回最終メッセージで思考の連鎖のみを正しく認識できるようになります。

### 8-2. systemメッセージとdeveloperメッセージ

「gpt-oss」は、チャット開始時に「system」メッセージと「developer」メッセージを区別するという点で独特ですが、他のほとんどのモデルでは「system」メッセージのみを使用します。「gpt-oss」では、systemメッセージは厳格な形式に従い、現在の日付、モデルのID、使用する推論努力レベルなどの情報が含まれます。一方、「developer」メッセージはより自由な形式であるため、他のほとんどのモデルの「system」メッセージと（非常に紛らわしいことに）類似しています。

「gpt-oss」を標準APIで使いやすくするために、チャットテンプレートは「system」または「developer」ロールを持つメッセージをdeveloperメッセージとして扱います。実際のsystemメッセージを変更する場合は、チャットテンプレートに特定の引数 `model_identity` または `reasoning_effort` を渡すことができます。

```python
chat = [
    {"role": "system", "content": "This will actually become a developer message!"}
]

tokenizer.apply_chat_template(
    chat,
    model_identity="You are OpenAI GPT OSS.",
    reasoning_effort="high"  # Defaults to "medium", but also accepts "high" and "low"
)
```

### 8-3. transformersによるツールの使用

「gpt-oss」は、2種類のツールをサポートしています。「組み込み」ツール (ブラウザとPython) と、ユーザーが用意するカスタムツールです。組み込みツールを有効にするには、以下に示すように、チャットテンプレートの`builtin_tools`引数にツール名のリストを渡します。カスタムツールを渡すには、JSONスキーマとして渡すか、`tools`引数を使用して型ヒントとdocstringを含むPython関数として渡すことができます。

詳細については、チャットテンプレートツールの[ドキュメント](https://huggingface.co/docs/transformers/en/chat_extras)を参照してください。または、以下の例を変更することもできます。

```python
def get_current_weather(location: str):
    """
    Returns the current weather status at a given location as a string.

    Args:
        location: The location to get the weather for.
    """
    return "Terrestrial."  # We never said this was a good weather tool

chat = [
    {"role": "user", "content": "What's the weather in Paris right now?"}
]

inputs = tokenizer.apply_chat_template(
    chat,
    tools=[get_current_weather],
    builtin_tools=["browser", "python"],
    add_generation_prompt=True,
    return_tensors="pt"
)
```

モデルがツールを呼び出すことを選択した場合 (`<|call|>` で終わるメッセージで示されます)、ツール呼び出しをチャットに追加し、ツールを呼び出し、ツールの結果をチャットに追加して再度生成する必要があります。

```python
tool_call_message = {
    "role": "assistant",
    "tool_calls": [
        {
            "type": "function",
            "function": {
                "name": "get_current_temperature",
                "arguments": {"location": "Paris, France"}
            }
        }
    ]
}
chat.append(tool_call_message)

tool_output = get_current_weather("Paris, France")

tool_result_message = {
    # Because GPT OSS only calls one tool at a time, we don't
    # need any extra metadata in the tool message! The template can
    # figure out that this result is from the most recent tool call.
    "role": "tool",
    "content": tool_output
}
chat.append(tool_result_message)

# You can now apply_chat_template() and generate() again, and the model can use
# the tool result in conversation.
```

## 関連

[**基盤モデルとロボットの融合 マルチモーダルAIでロボットはどう変わるのか (KS理工学専門書)** *www.amazon.co.jp*](https://www.amazon.co.jp/dp/4065395852?tag=npaka-22&linkCode=ogi&th=1&psc=1)
[*3,630円* (2025年08月06日 06:14時点](https://www.amazon.co.jp/dp/4065395852?tag=npaka-22&linkCode=ogi&th=1&psc=1)
[Amazon.co.jpで購入する](https://www.amazon.co.jp/dp/4065395852?tag=npaka-22&linkCode=ogi&th=1&psc=1)
