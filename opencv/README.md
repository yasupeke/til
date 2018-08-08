# OpenCVをJavaScript用にビルド

[公式のビルド説明](https://docs.opencv.org/3.4.1/d4/da1/tutorial_js_setup.html)

## [Emscriptenインストール](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html)
※上記リンクに各OSでやらなくてならないことが書いてあるのでやる

```
# emsdkリポジトリのクローン
git clone https://github.com/juj/emsdk.git

# 取得したリポジトリのディレクトリへ
cd emsdk

# 利用可能な最新のツールを取得
./emsdk update

# 最新のSDKツールをダウンロードしてインストール
./emsdk install latest

# 最新のSDKを現在のユーザでアクティブにする（~/.emscriptenに書き込む）
./emsdk activate latest

# 現在の端末でPATHやその他の環境変数を有効にする
source ./emsdk_env.sh
```

## OpenCV.js作成

```
# OpenCVリポジトリのクローン
git clone https://github.com/opencv/opencv.git

# 取得したリポジトリのディレクトリへ
cd opencv

# pythonスクリプトでopencv.jsをビルド
# オプション
# * --build_doc   ドキュメントのビルド
# * --build_wasm  デフォルトasm.jsなのでWebAssemblyに変更
# * --build_test  テストビルド
python ./platforms/js/build_js.py build_js
```

## トラブルシューティング

### Execution failed: 13 / Permission denied
1. CMakeのPATHが通っているか確認
1. 通っていない場合はCMakeの起動
1. メニュー > Tools > How to Install for Command Line Useを選択<br>
   どの方法で追加するかが説明されているので用途によって追加

# MEMO
よく理解できなかったのはGoogle翻訳のまま

# メソッド
## threshold

ピクセル値が閾値より大きい場合、1つの値に割り当てられ、そうでない場合には別の値が割り当てられる


```
cv.threshold (src, dst, thresh, maxval, type)
```

### パラメータ

| パラメータ名 | 説明 |
| -- | -- |
| src | 対象Matオブジェクト |
| dst | 出力先Matオブジェクト |
| thresh | 閾値 |
| maxval | typeがTHRESH_BINARYまたはTHRESH_BINARY_INVで使用する最大値 |
| type | ThresholdTypes |


### ThresholdTypes

| ThresholdTypes | 説明 |
| -- | -- |
| THRESH_BINARY | 閾値を超えるピクセルはmaxValに，それ以外のピクセルは0 |
| THRESH_BINARY_INV | 閾値を超えるピクセルは0に，それ以外のピクセルは maxVal |
| THRESH_TRUNC | 閾値を超えるピクセルはthresholdに，それ以外のピクセルは変更されない |
| THRESH_TOZERO | 閾値を超えるピクセルは変更されず，それ以外のピクセルは0 |
| THRESH_TOZERO_INV | 閾値を超えるピクセルは0に，それ以外のピクセルは変更されない |


## findContours

輪郭を探索する

```
cv.findContours (image, contours, hierarchy, mode, method, offset = new cv.Point(0, 0))
```

### パラメータ

| パラメータ名 | 説明 |
| -- | -- |
| image | 8ビットシングルチャンネル画像（0ではないピクセルは1として扱われる） |
| contours | 検出された輪郭 |
| hierarchy | 画像Topologyに関する情報（検出された輪郭と同数の要素がある） |
| mode | RetrievalModes |
| method | ContourApproximationModes |
| offset | 任意の輪郭点がシフトされるオプションのオフセット。これは、輪郭が画像ROIから抽出され、次にそれらが画像全体の状況において分析されるべき場合に有用である。 |

### [RetrievalModes](https://docs.opencv.org/3.4.1/d3/dc0/group__imgproc__shape.html#ga819779b9857cc2f8601e6526a3a5bc71)

| 定数名 | 説明 |
| -- | -- |
| RETR_EXTERNAL | 最も外側の輪郭のみを抽出 |
| RETR_LIST | 白の輪郭、黒の輪郭、内側、外側関係なく、同じ階層で輪郭を取得 |
| RETR_CCOMP | 黒ブロブの輪郭を全て抽出した後に白ブロブの輪郭を抽出 |
| RETR_TREE | 入れ子構造になった輪郭を完全に表現 |

### [ContourApproximationModes](https://docs.opencv.org/3.4.1/d3/dc0/group__imgproc__shape.html#ga4303f45752694956374734a03c54d5ff)

| 定数名 | 説明 |
| -- | -- |
| CHAIN_APPROX_NONE |  |
| CHAIN_APPROX_SIMPLE |  |
| CHAIN_APPROX_TC89_L1 |  |
| CHAIN_APPROX_TC89_KCOS |  |
