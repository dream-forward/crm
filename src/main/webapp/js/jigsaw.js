(function (window) {
    const l = 42, // æ»‘å—è¾¹é•¿
        r = 10, // æ»‘å—åŠå¾„
        w = 350, // canvaså®½åº¦
        h = 50, // canvasé«˜åº¦
        PI = Math.PI
    const L = l + r * 2 // æ»‘å—å®žé™…è¾¹é•¿

    function getRandomNumberByRange(start, end) {
        return Math.round(Math.random() * (end - start) + start)
    }

    function createCanvas(width, height) {
        const canvas = createElement('canvas')
        canvas.width = width
        canvas.height = height
        return canvas
    }

    function createImg(onload) {
        const img = createElement('img')
        img.crossOrigin = "Anonymous"
        img.onload = onload
        img.onerror = () => {
            img.src = getRandomImg()
        }
        img.src = getRandomImg()
        return img
    }

    function createElement(tagName) {
        return document.createElement(tagName)
    }

    function addClass(tag, className) {
        tag.classList.add(className)
    }

    function removeClass(tag, className) {
        tag.classList.remove(className)
    }

    function getRandomImg() {
        return 'https://picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 100)
    }

    function draw(ctx, operation, x, y) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + l / 2, y)
        ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI)
        ctx.lineTo(x + l / 2, y)
        ctx.lineTo(x + l, y)
        ctx.lineTo(x + l, y + l / 2)
        ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI)
        ctx.lineTo(x + l, y + l / 2)
        ctx.lineTo(x + l, y + l)
        ctx.lineTo(x, y + l)
        ctx.lineTo(x, y)
        ctx.fillStyle = '#fff'
        ctx[operation]()
        ctx.beginPath()
        ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI)
        ctx.globalCompositeOperation = "xor"
        ctx.fill()
    }

    function sum(x, y) {
        return x + y
    }

    function square(x) {
        return x * x
    }

    class jigsaw {
        constructor(el, success, fail) {
            this.el = el
            this.success = success
            this.fail = fail
        }

        init() {
            this.initDOM()
            this.initImg()
            this.draw()
            this.bindEvents()
        }

        initDOM() {
            const canvas = createCanvas(w, h) // ç”»å¸ƒ
            const block = canvas.cloneNode(true) // æ»‘å—
            const sliderContainer = createElement('div')
            const refreshIcon = createElement('div')
            const sliderMask = createElement('div')
            const slider = createElement('div')
            const sliderIcon = createElement('span')
            const text = createElement('span')

            block.className = 'block'
            sliderContainer.className = 'sliderContainer'
            refreshIcon.className = 'refreshIcon'
            sliderMask.className = 'sliderMask'
            slider.className = 'slider'
            sliderIcon.className = 'sliderIcon'
            text.innerHTML = 'å‘å³æ»‘åŠ¨æ»‘å—å¡«å……æ‹¼å›¾'
            text.className = 'sliderText'

            const el = this.el
            el.appendChild(canvas)
            el.appendChild(refreshIcon)
            el.appendChild(block)
            slider.appendChild(sliderIcon)
            sliderMask.appendChild(slider)
            sliderContainer.appendChild(sliderMask)
            sliderContainer.appendChild(text)
            el.appendChild(sliderContainer)

            Object.assign(this, {
                canvas,
                block,
                sliderContainer,
                refreshIcon,
                slider,
                sliderMask,
                sliderIcon,
                text,
                canvasCtx: canvas.getContext('2d'),
                blockCtx: block.getContext('2d')
            })
        }

        initImg() {
            const img = createImg(() => {
                this.canvasCtx.drawImage(img, 0, 0, w, h)
                this.blockCtx.drawImage(img, 0, 0, w, h)
                const y = this.y - r * 2 + 2
                const ImageData = this.blockCtx.getImageData(this.x, y, L, L)
                this.block.width = L
                this.blockCtx.putImageData(ImageData, 0, y)
            })
            this.img = img
        }

        draw() {
            // éšæœºåˆ›å»ºæ»‘å—çš„ä½ç½®
            this.x = getRandomNumberByRange(L + 10, w - (L + 10))
            this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10))
            draw(this.canvasCtx, 'fill', this.x, this.y)
            draw(this.blockCtx, 'clip', this.x, this.y)
        }

        clean() {
            this.canvasCtx.clearRect(0, 0, w, h)
            this.blockCtx.clearRect(0, 0, w, h)
            this.block.width = w
        }

        bindEvents() {
            this.el.onselectstart = () => false
            this.refreshIcon.onclick = () => {
                this.reset()
            }

            let originX, originY, trail = [], isMouseDown = false
            this.slider.addEventListener('mousedown', function (e) {
                originX = e.x, originY = e.y
                isMouseDown = true
            })
            document.addEventListener('mousemove', (e) => {
                if (!isMouseDown) return false
            const moveX = e.x - originX
            const moveY = e.y - originY
            if (moveX < 0 || moveX + 38 >= w) return false
            this.slider.style.left = moveX + 'px'
            var blockLeft = (w - 40 - 20) / (w - 40) * moveX
            this.block.style.left = blockLeft + 'px'

            addClass(this.sliderContainer, 'sliderContainer_active')
            this.sliderMask.style.width = moveX + 'px'
            trail.push(moveY)
        })
            document.addEventListener('mouseup', (e) => {
                if (!isMouseDown) return false
            isMouseDown = false
            if (e.x == originX) return false
            removeClass(this.sliderContainer, 'sliderContainer_active')
            this.trail = trail
            const {spliced, TuringTest} = this.verify()
            if (spliced) {
                if (TuringTest) {
                    addClass(this.sliderContainer, 'sliderContainer_success')
                    this.success && this.success()
                } else {
                    addClass(this.sliderContainer, 'sliderContainer_fail')
                    this.text.innerHTML = 'å†è¯•ä¸€æ¬¡'
                    this.reset()
                }
            } else {
                addClass(this.sliderContainer, 'sliderContainer_fail')
                this.fail && this.fail()
                setTimeout(() => {
                    this.reset()
                }, 1000)
            }
        })
        }

        verify() {
            const arr = this.trail // æ‹–åŠ¨æ—¶yè½´çš„ç§»åŠ¨è·ç¦»
            const average = arr.reduce(sum) / arr.length // å¹³å‡å€¼
            const deviations = arr.map(x => x - average) // åå·®æ•°ç»„
            const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // æ ‡å‡†å·®
            const left = parseInt(this.block.style.left)
            return {
                spliced: Math.abs(left - this.x) < 10,
                TuringTest: average !== stddev, // åªæ˜¯ç®€å•çš„éªŒè¯æ‹–åŠ¨è½¨è¿¹ï¼Œç›¸ç­‰æ—¶ä¸€èˆ¬ä¸º0ï¼Œè¡¨ç¤ºå¯èƒ½éžäººä¸ºæ“ä½œ
            }
        }

        reset() {
            this.sliderContainer.className = 'sliderContainer'
            this.slider.style.left = 0
            this.block.style.left = 0
            this.sliderMask.style.width = 0
            this.clean()
            this.img.src = getRandomImg()
            this.draw()
        }

    }

    window.jigsaw = {
        init: function (element, success, fail) {
            new jigsaw(element, success, fail).init()
        }
    }
}(window))