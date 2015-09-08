var Game = function (canvasId) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    var $this = this;
    canvas.addEventListener("touchstart", function () {
        event.preventDefault();
        var touch = event.touches[0]; //获取第一个触点
        var touch_x = Number(touch.pageX); //页面触点X坐标
        var touch_y = Number(touch.pageY); //页面触点Y坐标
        $this.selectSpirit = null;

        $this.Scene.Spirits.map(function (spirit, index, arr) {
            switch (true) {
                case (spirit.canDrag):
                    var x = Math.abs(touch_x - spirit.x);
                    var y = Math.abs(touch_y - spirit.y);
                    if (x < spirit.w / 2 * spirit.scale && y < spirit.h / 2 * spirit.scale) {
                        $this.selectSpirit = spirit;
                        cha_x = touch_x - spirit.x;
                        cha_y = touch_y - spirit.y;
                        spirit.click();
                    }
                    break;
            }
        });
    });
    canvas.addEventListener("touchmove", function () {

        event.preventDefault();
        var touch = event.touches[0]; //获取第一个触点
        var touch_x = Number(touch.pageX); //页面触点X坐标
        var touch_y = Number(touch.pageY); //页面触点Y坐标
        if ($this.selectSpirit != null) {

            $this.selectSpirit.x = touch_x - cha_x;
            $this.selectSpirit.y = touch_y - cha_y;
        }
    });
    canvas.addEventListener("touchend", function () {
        event.preventDefault();

    });
    c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#ff0000";
    this.status = 'ready_res';//ready_res,ready_play,playing,zt,end
}
Game.prototype = {
    setScene: function (Scene) {
        this.Scene = Scene;
    },
    play: function (before, after) {
        this.status = 'Playing';
        $this = this;
        this.timer = setInterval(function () {
            switch ($this.status) {
                case ('Playing'):
                    //
                    c.clearRect(0, 0, canvas.width, canvas.height);
                    before();//用于渲染背景
                    $this.Scene.Spirits.map(function (spirit, index, arr) {
                        switch (true) {
                            case (spirit.canCollision):
                                //碰撞检测
                                arr.map(function (obj) {
                                    switch (true) {
                                        case (spirit != obj):
                                            //不是自己
                                            switch (true) {
                                                case (obj.canCollision):
                                                    //对方也开启了碰撞检测
                                                    var ju_x = Math.abs(spirit.x - obj.x);
                                                    var ju_y = Math.abs(spirit.y - obj.y);
                                                    if (ju_x < (spirit.w / 2 * spirit.scale + obj.w / 2 * obj.scale) * 0.82 && ju_y < (spirit.h / 2 * spirit.scale + obj.h / 2 * obj.scale * 0.82)) {
                                                        spirit.collision(obj);
                                                    }
                                                    break;
                                            }
                                            break;
                                    }
                                });
                                break;
                        }
                        spirit.run();
                        if (spirit.img == null) {
                            console.log(spirit.role);
                        }
                        c.drawImage(spirit.img, spirit.x - spirit.w / 2 * spirit.scale, spirit.y - spirit.h / 2 * spirit.scale, spirit.w * spirit.scale, spirit.h * spirit.scale);
                    });
                    after();//渲染分数等
                    //
                    break;
            }
        }, 1000 / 64);
    },
    replay: function () {

    },
    Pause: function () {
        switch (this.status) {
            case ('Playing'):
                this.status = 'Pause';
                break;
            case ('Pause'):
                this.status = 'Playing';
                break;
        }
    },
    end: function () {
        clearInterval(this.timer);
    }
}


var Scene = function () {
    this.Spirits = [];
}
Scene.prototype = {
    clearAllSpirit: function () {
        this.Spirits.length = 0;
    },
    addSpirit: function (spirit) {
        this.Spirits.push(spirit);
    },
    delSpirit: function (spirit) {
        this.Spirits.map(function (obj, index, arr) {
            switch (true) {
                case (spirit === obj):
                    arr.splice(index, 1);
                    break;
            }
        });
    },
    delSpiritWithOut: function (role) {
        this.Spirits.map(function (obj, index, arr) {
            switch (true) {
                case (spirit === obj && spirit.role != role):
                    arr.splice(index, 1);
                    break;
            }
        });
    },
    delSpiritWithPlayer: function () {
        this.delSpiritWithOut('player');
    }
}

var Res = function () {
    this.resCount = 0;
    this.unloadRes = [];
    this.res = [];
    this.loadedRes = [];
}
Res.prototype = {
    addRes: function (resName, resSrc) {
        this.unloadRes.push({name: resName, src: resSrc});
    },
    onloaded: function () {
        if (this.loaded != undefined) {
            this.loaded();
        }
    },
    getImage: function (name) {
        var returnimg = null;
        this.loadedRes.map(function (img) {
            if (img.name === name) {
                returnimg = img;
            }
        });
        return returnimg;
    },
    load: function (fn) {
        this.loaded = fn;
        this.resCount = this.unloadRes.length;
        var $this = this;

        this.unloadRes.map(function (imgObj, index, arr) {
            var img = new Image();
            img.name = imgObj.name;
            img.src = imgObj.src;
            img.status = 'loading';
            img.onload = function () {
                this.status = 'loaded';
                $this.checkLoadingStatus();
            }
            $this.res.push(img);
        });
        this.timer = setInterval(function () {
            $this.checkLoadingStatus();
        }, 50);
    },
    addLoadedRes: function (img) {
        var check = 0;
        this.loadedRes.map(function (loadedImage) {
            check++;
        })
        if (check === 0) {
            this.loadedRes.push(this);
            this.res.slice(this.index, 1);
        }
    },
    checkLoadingStatus: function () {
        $this = this;
        this.res.map(function (img, index, arr) {
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.fillStyle = "#000000";
            c.fillRect(0, 0, canvas.width, canvas.height);
            c.textAlign = 'left';
            c.textBaseline = 'top';
            c.fillStyle = "#ff0000";
            c.font = "20px Courier New";
            switch (img.status) {
                case 'loading':
                    c.fillText("正在载入：" + img.name, 20, 60);
                    var newsrc = img.src + '?' + Math.random();
                    var newimg = new Image();
                    newimg.name = img.name;
                    newimg.src = newsrc;
                    newimg.status = 'loading';
                    newimg.onload = function () {
                        this.status = 'loaded';
                    }
                    break;
                case 'loaded':
                    c.fillText("已经载入：" + img.name, 20, 60);
                    $this.loadedRes.push(img);
                    arr.splice(index, 1);
                    break;
            }
            c.font = "40px Courier New";
            //c.fillText($this.loadedRes.length + "/" + $this.resCount, 20, 20);
            c.fillText(Math.floor($this.loadedRes.length / $this.resCount * 100) + '%', 20, 20);
            switch ($this.loadedRes.length) {
                case ($this.resCount):
                    clearInterval($this.timer);
                    $this.onloaded();
                    break;
            }
        });
    }
}

var Spirit = function (role, x, y, w, h) {
    this.role = role;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.scale = 1.0;
    this.canDrag = false;
    this.canCollision = false;
}
Spirit.prototype = {
    setImage: function (img) {
        this.img = img;
    },
    autoWH: function () {
        this.w = this.img.width;
        this.h = this.img.height;
    },
    setScaleXY: function (v) {
        this.scale = v;
    },
    doRun: function () {

    },
    doDrag: function () {

    },
    run: function () {
        this.doRun();
    },
    onRun: function (fn) {
        this.doRun = fn;
    },
    drag: function () {
        this.doDrag();
    },
    onDrag: function (fn) {
        this.canDrag = true;
        this.doDrag = fn;
    },
    doCollision: function () {

    },
    collision: function (spirit) {
        //碰撞的对象
        this.doCollision(spirit);
    },
    onCollision: function (fn) {
        this.canCollision = true;
        this.doCollision = fn;
    },
    doclick: function () {

    },
    click: function () {
        this.doclick(this);
    },
    onclick: function (fn) {
        this.doclick = fn;
    }
}