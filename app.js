new Vue({
  el: '.container',
  data: {
    key: 0,
    text: 'Hello.',
    mode: 'picture',
    color: '#ffeb3b',
    gradient: '#fdc78d,#f98ffd',
    keywords: '',
    unsplashImageSrc: '',
    triangleBackground: null,
    isModePickerShown: false,
    isColorPickerShown: false,
    isGradientPickerShown: false,
  },
  template: `
		<div class="container">
			<div class="cover" ref="cover">
				<canvas ref="canvas" style="display:none"></canvas>
				<img ref="img" :src="imgSrc" />
			</div>
			<div class="message">
				<input v-model="text" placeholder="Text..." />
			</div>

      <transition name="fade">
        <ul v-if="isModePickerShown" class="picker picker-mode">
          <li v-on:click="selectMode('color')"><img src="circle.svg"> Color</li>
          <li v-on:click="selectMode('gradient')"><img src="square.svg"> Gradient</li>
          <li v-on:click="selectMode('trianglify')"><img src="triangle.svg"> Trianglify</li>
          <li v-on:click="selectMode('picture')"><img src="image.svg"> Picture</li>
        </ul>
      </transition>

			<div v-on:click="isModePickerShown = !isModePickerShown" class="btn btn-mode">
				<img v-if="!isModePickerShown && mode == 'color'" src="circle.svg" />
				<img v-if="!isModePickerShown && mode == 'gradient'" src="square.svg" />
				<img v-if="!isModePickerShown && mode == 'trianglify'" src="triangle.svg" />
				<img v-if="!isModePickerShown && mode == 'picture'" src="image.svg" />
				<img v-if="isModePickerShown" src="x.svg" />
			</div>

      <transition name="fade">
        <div v-if="isColorPickerShown" class="picker picker-mode picker-grid">
          <div class="swatch" v-on:click="setColor('#e51c23')" style="background-color: #e51c23" />
          <div class="swatch" v-on:click="setColor('#e91e63')" style="background-color: #e91e63" />
          <div class="swatch" v-on:click="setColor('#9c27b0')" style="background-color: #9c27b0" />
          <div class="swatch" v-on:click="setColor('#5677fc')" style="background-color: #5677fc" />
          <div class="swatch" v-on:click="setColor('#ffeb3b')" style="background-color: #ffeb3b" />
          <div class="swatch" v-on:click="setColor('#00bcd4')" style="background-color: #00bcd4" />
          <div class="swatch" v-on:click="setColor('#4cd964')" style="background-color: #4cd964" />
          <div class="swatch" v-on:click="setColor('#34495e')" style="background-color: #34495e" />
          <div class="swatch" v-on:click="setColor('#607D8B')" style="background-color: #607D8B" />
        </div>
      </transition>
			<div v-if="mode =='color'" class="picker-details">
				<img v-if="!isColorPickerShown" v-on:click="isColorPickerShown=true"
					class="chevron" src="chevron-down.svg" />
				<img v-if="isColorPickerShown" v-on:click="isColorPickerShown=false"
					class="chevron" src="chevron-up.svg" />
				<input v-model="color" />
			</div>

      <transition name="fade">
        <div v-if="isGradientPickerShown" class="picker picker-mode picker-grid">
          <div class="swatch" v-on:click="setGradient('#5558da,#5fd1f9')" :style="gradientCSS('#5558da,#5fd1f9')" />
          <div class="swatch" v-on:click="setGradient('#f2709c,#ff9472')" :style="gradientCSS('#f2709c,#ff9472')" />
          <div class="swatch" v-on:click="setGradient('#b6f492,#338b93')" :style="gradientCSS('#b6f492,#338b93')" />
          <div class="swatch" v-on:click="setGradient('#a18cd1,#fbc2eb')" :style="gradientCSS('#a18cd1,#fbc2eb')" />
          <div class="swatch" v-on:click="setGradient('#fdc78d,#f98ffd')" :style="gradientCSS('#fdc78d,#f98ffd')" />
          <div class="swatch" v-on:click="setGradient('#fdc168,#fb8080')" :style="gradientCSS('#fdc168,#fb8080')" />
          <div class="swatch" v-on:click="setGradient('#80f8ae,#dff494')" :style="gradientCSS('#80f8ae,#dff494')" />
          <div class="swatch" v-on:click="setGradient('#ad5389,#3c1053')" :style="gradientCSS('#ad5389,#3c1053')" />
          <div class="swatch" v-on:click="setGradient('#5a5c6a,#202d3a')" :style="gradientCSS('#5a5c6a,#202d3a')" />
        </div>
      </transition>
			<div v-if="mode =='gradient'" class="picker-details">
				<img v-if="!isGradientPickerShown" v-on:click="isGradientPickerShown=true"
					class="chevron" src="chevron-down.svg" />
				<img v-if="isGradientPickerShown" v-on:click="isGradientPickerShown=false"
					class="chevron" src="chevron-up.svg" />
				<input v-model="gradient" />
			</div>

			<div v-if="mode =='trianglify'" class="picker-details">
				<div class="btn-wide" v-on:click="trianglify">Randomize</div>
			</div>

			<div v-if="mode == 'picture'" class="picker-details">
				<img ref="unsplashImage" style="display: none" v-on:load="key=key+1" :src="unsplashImageSrc" />
        <input v-bind:value="keywords" v-on:input="debounceSearch($event.target.value)"
          placeholder="e.g: inspire,red" />
			</div>

			<div v-on:click="copy" class="btn btn-copy"><img src="copy.svg" /></div>
			<div v-on:click="download" class="btn btn-download"><img src="download.svg" /></div>
		</div>
	`,
  mounted: function() {
    this.canvas = this.$refs.canvas;
    this.canvas.width = this.$refs.cover.clientWidth;
    this.canvas.height = this.$refs.cover.clientHeight;
    this.context = this.canvas.getContext('2d');
    this.img = this.$refs.img;
    this.key = this.key + 1;
  },
  methods: {
    gradientCSS: function(gradient) {
      return `background-image:radial-gradient(circle farthest-corner at 12.3% 19.3%, ${gradient})`;
    },
    debounceSearch: function(keywords) {
      clearTimeout(this.debounceTimeout);
      this.keywords = keywords;
      this.debounceTimeout = setTimeout(() => {
        const url = `https://source.unsplash.com/336x128/?${this.keywords}`;
        if (this.abortUnsplash) {
          this.abortUnsplash.abort();
        }
        this.abortUnsplash = new AbortController();
        fetch(new Request(url), {signal: this.abortUnsplash.signal}).then(
          res => {
            res.arrayBuffer().then(buf => {
              let binary = '';
              const bytes = [].slice.call(new Uint8Array(buf));
              bytes.forEach(b => (binary += String.fromCharCode(b)));
              this.unsplashImageSrc = `data:image/jpeg;base64,${window.btoa(
                binary,
              )}`;
              this.key = this.key + 1;
            });
          },
        );
      }, 500);
    },
    trianglify: function() {
      this.triangleBackground = Trianglify({
        width: this.canvas.width,
        height: this.canvas.height,
      });
    },
    setColor: function(color) {
      this.color = color;
      this.isColorPickerShown = false;
    },
    setGradient: function(gradient) {
      this.gradient = gradient;
      this.isGradientPickerShown = false;
    },
    selectMode: function(mode) {
      this.mode = mode;
      this.isModePickerShown = false;
    },
    copy: function() {
      var img = document.createElement('img');
      img.src = this.canvas.toDataURL();
      var div = document.createElement('div');
      div.contentEditable = true;
      div.appendChild(img);
      document.body.appendChild(div);
      var doc = document;
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(div);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('Copy');
      document.body.removeChild(div);
    },
    download: function() {
      // TODO
    },
  },
  computed: {
    unsplashURL: function() {
      return ``;
      //return `https://source.unsplash.com/336x128/?${this.picture}`;
    },
    imgSrc: function() {
      let _ = this.key;
      if (!this.context) {
        return;
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.mode === 'color') {
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else if (this.mode === 'gradient') {
        const gradient = this.context.createRadialGradient(
          this.canvas.width * 0.123,
          this.canvas.height * 0.193,
          0,
          this.canvas.width * 0.123,
          this.canvas.height * 0.193,
          Math.max(this.canvas.width, this.canvas.height),
        );
        const colors = this.gradient.split(',');
        colors.forEach((g, i) => {
          let step = 0;
          if (colors.length > 1) {
            step = i / (colors.length - 1);
          }
          try {
            gradient.addColorStop(step, g);
          } catch (ignored) {}
        });
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else if (this.mode === 'trianglify') {
        if (!this.triangleBackground) {
          this.trianglify();
        }
        this.triangleBackground.canvas(this.canvas);
      } else if (this.mode === 'picture') {
        if (this.$refs.unsplashImage && this.$refs.unsplashImage.complete) {
          this.context.drawImage(this.$refs.unsplashImage, 0, 0);
        }
      }

      if (this.text !== '') {
        let r = 0,
          g = 0,
          b = 0,
          n = 0;
        let data;
        data = this.context.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height,
        ).data;
        for (let i = 0; i < data.length; i = i + 20) {
          n++;
          r = r + data[i];
          g = g + data[i + 1];
          b = b + data[i + 2];
        }
        let y = (0.299 * r) / n + (0.587 * g) / n + (0.114 * b) / n;
        if (y > 150) {
          this.context.fillStyle = '#000000';
        } else {
          this.context.fillStyle = '#ffffff';
        }

        let offsetX = 0;
        let offsetY = 0;
        for (let sz = 100; sz > 10; sz = sz * 0.8) {
          let font = `bold ${Math.floor(
            sz,
          )}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, Ubuntu, Droid Sans, Helvetica Neue, sans-serif`;
          this.context.font = font;
          let w = this.context.measureText(this.text).width;
          h = sz / 1.333;
          if (w < 270) {
            offsetX = (this.canvas.width - w) / 2;
            offsetY = (this.canvas.height - h) / 2 + h;
            break;
          }
        }
        this.context.fillText(this.text, offsetX, offsetY);
      }
      return this.canvas.toDataURL();
    },
  },
});
