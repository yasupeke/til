(() => {
  const API_KEY = 'API_KEY';
  const API_URL = 'https://vision.googleapis.com/v1/images:annotate';
  const video = document.querySelector('#video');
  const img = document.querySelector('#snapshot');
  const result = document.querySelector('#result');
  const canvas = document.createElement('canvas');
  const canvasCtx = canvas.getContext('2d');
  const btnScan = document.querySelector('#btnScan');

  navigator.mediaDevices.getUserMedia({ video: { width: video.width, height: video.height } })
    .then((stream) => {
      video.srcObject = stream;
      video.muted = true;
      video.onloadedmetadata = () => {
        video.play();
        btnScan.addEventListener('click', execScan, false);
      };
    })
    .catch(function (err) {
      console.error(`error: ${err}`);
    });

  function execScan() {
    btnScan.disabled = true;

    canvas.width = video.width;
    canvas.height = video.height;
    canvasCtx.drawImage(video, 0, 0);

    const base64string = canvas.toDataURL('image/jpeg');

    img.src = base64string;
    sendGoogleVision(base64string)
      .then((data) => {
        output(data);
        btnScan.disabled = false;
      });
  }

  function sendGoogleVision(base64string) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}?key=${API_KEY}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      requests: [
        {
          image: {
            content: base64string.replace('data:image/jpeg;base64,', '')
          },
          features: [
            {
              type: 'TEXT_DETECTION'
            }
          ]
        }
      ]
    }));
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState != XMLHttpRequest.DONE) return;
        if (xhr.status >= 400) {
          return reject({
            message: `Failed with ${xhr.status}: ${xhr.statusText}`
          });
        };
        const parsed = JSON.parse(xhr.responseText);
        const responses = parsed.responses;
        resolve(responses ? responses[0] : null);
      };
    })
  }

  function output(response) {
    if (!response || !response.fullTextAnnotation) return;
    result.innerText = response.fullTextAnnotation.text;
  }
})();
