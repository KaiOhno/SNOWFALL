document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  const snowIntensitySlider = document.getElementById('snow-intensity');
  const textSizeSlider = document.getElementById('text-size');
  const textInput = document.getElementById('custom-text');
  const restartButton = document.getElementById('restart-button');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let snowflakes = [];
  let maxSnowflakes = snowIntensitySlider.value;
  let groundSnow = new Array(Math.ceil(width)).fill(0);

  textInput.addEventListener('input', adjustTextInputWidth);
  snowIntensitySlider.addEventListener('input', updateSnowIntensity);
  textSizeSlider.addEventListener('input', function () {
    updateTextSize();
    adjustTextInputWidth.call(textInput);
  });
  restartButton.addEventListener('click', restartSnowfall);

  function adjustTextInputWidth() {
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'pre';
    tempSpan.style.font = getComputedStyle(this).font;
    tempSpan.textContent = this.value || this.placeholder;

    document.body.appendChild(tempSpan);
    this.style.width = `${tempSpan.offsetWidth + 10}px`;
    document.body.removeChild(tempSpan);
  }

  function restartSnowfall() {
    snowflakes = [];
    groundSnow.fill(0);
    maxSnowflakes = snowIntensitySlider.value;
  }

  function updateSnowIntensity() {
    maxSnowflakes = this.value;
    while (snowflakes.length < maxSnowflakes) {
      snowflakes.push(new Snowflake());
    }
  }

  function updateTextSize() {
    textInput.style.fontSize = textSizeSlider.value + 'px';
  }

  function Snowflake() {
    this.x = Math.random() * width;
    this.y = -Math.random() * height;
    this.size = Math.random() * 5 + 1;
    this.speed = Math.random() * 1 + 0.5;
    this.velocityX = Math.random() * 0.5 - 0.25;
    this.stuck = false;
  }

  Snowflake.prototype.update = function () {
    if (!this.stuck) {
      this.y += this.speed;
      this.x += this.velocityX;
      this.checkCollision();
    }
  };

  Snowflake.prototype.checkCollision = function () {
    if (this.y >= height - groundSnow[Math.floor(this.x)] - this.size) {
      this.y = height - groundSnow[Math.floor(this.x)] - this.size;
      this.stuck = true;
      groundSnow[Math.floor(this.x)] += this.size;
    }

    const textRect = textInput.getBoundingClientRect();
    if (
      this.x >= textRect.left &&
      this.x <= textRect.right &&
      this.y >= textRect.top &&
      this.y <= textRect.bottom
    ) {
      this.stuck = true;
    }
  };

  Snowflake.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  };

  function createSnowflakes() {
    while (snowflakes.length < maxSnowflakes) {
      snowflakes.push(new Snowflake());
    }
  }

  function updateSnowflakes() {
    for (let flake of snowflakes) {
      flake.update();
    }
  }

  function drawSnowflakes() {
    ctx.clearRect(0, 0, width, height);
    for (let flake of snowflakes) {
      flake.draw();
    }
  }

  function drawGroundSnow() {
    ctx.fillStyle = 'white';
    for (let i = 0; i < groundSnow.length; i++) {
      ctx.fillRect(i, height - groundSnow[i], 1, groundSnow[i]);
    }
  }

  function loop() {
    createSnowflakes();
    updateSnowflakes();
    drawSnowflakes();
    drawGroundSnow();
    requestAnimationFrame(loop);
  }

  loop();

  window.addEventListener('resize', function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    groundSnow = new Array(Math.ceil(width)).fill(0);
    adjustTextInputWidth.call(textInput); // Adjust text input width on resize
  });

  // Initial call to set the correct width of the text input
  adjustTextInputWidth.call(textInput);
});
