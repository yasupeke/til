(() => {
  const video = document.querySelector("#video");
  const snapshotCanvas1 = document.querySelector("#snapshot1");
  const snapshotCanvasCtx1 = snapshotCanvas1.getContext("2d");
  const snapshotCanvas2 = document.querySelector("#snapshot2");
  const snapshotCanvasCtx3 = snapshotCanvas1.getContext("2d");
  const result = document.querySelector("#result");
  const canvas = document.createElement("canvas");
  const canvasCtx = canvas.getContext("2d");
  const btnScan = document.querySelector("#btnScan");

  cv["onRuntimeInitialized"] = () => {
    btnScan.disabled = false;
  };

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.muted = true;
      video.onloadedmetadata = () => {
        video.play();
        btnScan.addEventListener("click", execScan, false);
      };
    })
    .catch(err => {
      console.error(err);
    });

  function execScan() {
    btnScan.disabled = true;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    snapshotCanvas1.style.width = snapshotCanvas2.style.width = `${
      video.width
    }px`;
    snapshotCanvas1.style.height = snapshotCanvas2.style.height = `${
      video.height
    }px`;
    canvasCtx.drawImage(video, 0, 0);

    const imgData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);

    scanImage1();
    scanImage2();
    btnScan.disabled = false;
  }

  /**
   * 診察券の輪郭取得(外接矩形)
   */
  function scanImage2() {
    const src = cv.imread(canvas);
    const canvasArea = canvas.width * canvas.height;
    const gray = new cv.Mat();

    //グレースケール
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    let maxArea = 0;
    let bestContour = null;
    let bestRate = 0;
    let bestWhite = 0;
    for (let white = 10; white < 255; white += 10) {
      //二値化
      const threshold = new cv.Mat();
      cv.threshold(gray, threshold, white, 255, cv.THRESH_TOZERO);

      // 輪郭取得
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(
        threshold,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE
      );

      for (let i = 0, contour; (contour = contours.get(i)); ++i) {
        const area = cv.contourArea(contour, false);
        if (area < 10000) continue;

        const tmp = new cv.Mat();
        cv.approxPolyDP(contour, tmp, 0.01 * cv.arcLength(contour, true), true);

        // ポリゴンにしたときに４つ角になるか見る
        // 4つの頂点があるかつ全体の10%上でかつ99%以下のもののみ見るようにする
        if (
          canvasArea * 0.1 <= area &&
          area <= canvasArea * 0.99 &&
          maxArea < canvasArea &&
          tmp.rows === 4
        ) {
          bestContour = contour.clone();
          maxArea = area;
        }

        tmp.delete();
        contour.delete();
      }

      if (0 != maxArea) {
        rate = (maxArea / canvasArea) * 100;

        if (bestRate < rate) {
          bestRate = rate;
          bestWhite = white;
        }
      }

      hierarchy.delete();
      contours.delete();
    }

    console.log(`BEST RATE: ${bestRate}\nBEST WHITE: ${bestWhite}`);

    if (bestContour) {
      const color = new cv.Scalar(0, 250, 0, 255);
      const rotatedRect = cv.minAreaRect(bestContour);
      const vertices = cv.RotatedRect.points(rotatedRect);

      for (let i = 0; i < 4; i++) {
        cv.line(
          src,
          vertices[i],
          vertices[(i + 1) % 4],
          color,
          2,
          cv.LINE_AA,
          0
        );
      }

      bestContour.delete();
    }

    cv.imshow(snapshotCanvas2, src);
    src.delete();
    gray.delete();
  }

  /**
   * 診察券の輪郭取得
   */
  function scanImage1() {
    const src = cv.imread(canvas);
    const canvasArea = canvas.width * canvas.height;
    const gray = new cv.Mat();

    //グレースケール
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    let maxArea = 0;
    let bestApprox = null;
    let bestRate = 0;
    let bestWhite = 0;
    for (let white = 10; white < 255; white += 10) {
      //二値化
      const threshold = new cv.Mat();
      cv.threshold(gray, threshold, white, 255, cv.THRESH_TOZERO);

      // 輪郭取得
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(
        threshold,
        contours,
        hierarchy,
        cv.RETR_TREE,
        cv.CHAIN_APPROX_SIMPLE
      );

      for (let i = 0, contour; (contour = contours.get(i)); ++i) {
        const area = cv.contourArea(contour, false);
        if (area < 10000) continue;

        const tmp = new cv.Mat();
        cv.approxPolyDP(contour, tmp, 0.01 * cv.arcLength(contour, true), true);

        // ポリゴンにしたときに４つ角になるか見る
        // 4つの頂点があるかつ全体の10%上でかつ99%以下のもののみ見るようにする
        if (
          canvasArea * 0.1 <= area &&
          area <= canvasArea * 0.99 &&
          maxArea < canvasArea &&
          tmp.rows === 4
        ) {
          const approx = new cv.Mat();
          cv.convexHull(contour, approx, false, true);
          bestApprox = approx;
          maxArea = area;
        }

        tmp.delete();
        contour.delete();
      }

      if (0 != maxArea) {
        rate = (maxArea / canvasArea) * 100;

        if (bestRate < rate) {
          bestRate = rate;
          bestWhite = white;
        }
      }

      hierarchy.delete();
      contours.delete();
    }

    console.log(`BEST RATE: ${bestRate}\nBEST WHITE: ${bestWhite}`);

    if (bestApprox) {
      const poly = new cv.MatVector();
      const color = new cv.Scalar(0, 250, 0, 255);

      poly.push_back(bestApprox);
      cv.drawContours(src, poly, 0, color, 2, 8);

      bestApprox.delete();
    }

    cv.imshow(snapshotCanvas1, src);
    src.delete();
    gray.delete();
  }
})();
