/*
 * H5 canvas 注入式游戏框架
 * www.dingdingwenan.com
 * 新浪微博 @丁丁文案
 * */
var G = {
    res: [],
    timer: 0,
    gameTime: 0,
    fps: 64,
    spirits: [],
    spiritsDesc: false,//config
    speed: 10,
    timerFPS: 0,
    debug: true,//config
    loadingRes: [],//config
    timing: 0,
    touch_x: 0,
    touch_y: 0,
    touchFn: {
        start: function () {
        },
        move: function () {
        },
        end: function () {
        }
    },//config
    loadingResFn: function () {
    },//config
    loadingResEnd: function () {
        //config
    },
    loopingBefpre: function () {//config

    },
    loopingAfter: function () {
    },
    gameStatus: "loadingRes",//loadingRes,resLoaded,ready,looping,stop,over.
    config: function (conf) {
        conf.loadingRes != undefined ? G.loadingRes = conf.loadingRes : false;
        conf.loopingBefpre != undefined ? G.loopingBefpre = conf.loopingBefpre : false;
        conf.loopingAfter != undefined ? G.loopingAfter = conf.loopingAfter : false;
        conf.loadingResFn != undefined ? G.loadingResFn = conf.loadingResFn : false;
        conf.loadingResEnd != undefined ? G.loadingResEnd = conf.loadingResEnd : false;
        conf.touchFn != undefined ? G.touchFn = conf.touchFn : false;
        conf.debug != undefined ? G.debug = conf.debug : false;
        conf.debug != undefined ? G.debug = conf.debug : false;
        conf.spiritsDesc != undefined ? G.spiritsDesc = conf.spiritsDesc : false;

    },
    start: function () {
        if (G.gameStatus === "ready") {
            G.gameStatus = "looping";
        }
    },
    restart: function () {
        G.gameTime = 0;
        G.timing = 0;
        G.spirits.length = 0;
        G.loadingResEnd();
        G.gameStatus = "looping";
    },
    zt: function () {
        switch (G.gameStatus) {
            case "looping":
                G.gameStatus = "stop";
                break;
            case "stop":
                G.gameStatus = "looping";
                break;
        }
    },
    over: function () {
        G.gameStatus = "over";
    },
    out: function (s) {
        if (G.debug) {
            console.dir(s);
        }
    },
    resetTimer: function () {
        clearInterval(G.timerFPS);
        G.timerFPS = setInterval(function () {
            switch (G.gameStatus) {
                case "loadingRes":
                    G.out("判断载入资源是否完毕中");
                    var resLoadedCount = 0;
                    var res = G.loadingRes;
                    res.map(function (i, index) {
                        switch (true) {
                            case(i.loaded):
                                resLoadedCount++;
                                break;
                            case (!i.loaded):
                                var img = new Image();
                                img.index = index;
                                img.src = i.src;
                                img.name = i.name;
                                G.out("正在载入:" + img.name);
                                img.onload = function () {
                                    G.out("已经载入:" + this.name);
                                    G.res[this.name] = this;
                                    G.loadingRes[this.index].loaded = true;
                                }
                                break;
                        }
                    });
                    switch (resLoadedCount){
                        case (G.loadingRes.length):
                            G.out("资源全部载入完毕");
                            G.gameStatus = "ready";
                            G.speed = 1000 / G.fps;
                            G.resetTimer();
                            G.loadingResEnd();//全部资源载入后执行
                            break;
                    }
                    G.out(resLoadedCount);
                    break;
                case "resLoaded":
                    break;
                case "ready":
                    break;
                case "looping":
                    //秒表
                    G.timer += 1000 / G.fps;
                    if (G.timer > 1000) {
                        G.gameTime += 1;
                        G.timer = 0;
                    }
                    c.clearRect(0, 0, canvas.width, canvas.height);
                    G.loopingBefpre();//用于渲染背景
                    G.spirits.map(function (spirit, index, arr) {



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

                        c.drawImage(spirit.img, spirit.x - spirit.w / 2 * spirit.scale, spirit.y - spirit.h / 2 * spirit.scale, spirit.w * spirit.scale, spirit.h * spirit.scale);
                    });


                    G.loopingAfter();//渲染分数等
                    break;
                case "stop":
                    break;
                case "over":
                    break;
            }
        }, G.speed);
    },
    delSpirit: function (spirit) {
        G.spirits.map(function (obj, index, arr) {

            switch (true) {
                case (spirit === obj):
                    G.spirits.splice(index, 1);

                    break;
            }
            console.log(i);
        });
    },
    init: function () {
        G.out("初始化画布");
        var width = window.innerWidth;
        var height = window.innerHeight;
        canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";

        canvas.addEventListener("touchstart", function () {
            event.preventDefault();
            var touch = event.touches[0]; //获取第一个触点
            var touch_x = Number(touch.pageX); //页面触点X坐标
            var touch_y = Number(touch.pageY); //页面触点Y坐标

            G.selectSpirit = null;
            G.spirits.map(function (spirit, index, arr) {
                switch (true) {
                    case (spirit.canDrag):
                        var x = Math.abs(touch_x - spirit.x);
                        var y = Math.abs(touch_y - spirit.y);
                        if (x < spirit.w / 2 * spirit.scale && y < spirit.h / 2 * spirit.scale) {
                            G.selectSpirit = spirit;
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

            if (G.selectSpirit != null) {
                G.selectSpirit.x = touch_x - cha_x;
                G.selectSpirit.y = touch_y - cha_y;
            }


        });
        canvas.addEventListener("touchend", function () {
            event.preventDefault();

        });

        c = canvas.getContext('2d');
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "#ff0000";
        //c.fillRect(0, 0, canvas.width, canvas.height);
        G.out("初始化画布完毕");
        var gameTime = 0;
        G.resetTimer();
    }
}

var Scene=function(){
    this.Spirits=[];
}
Scene.prototype={
    clearAllSpirit:function(){
        this.Spirits.length=0;
    },
    addSpirit:function(spirit){
        this.Spirits.push(spirit);
    },
    delSpirit: function (spirit) {
        G.spirits.map(function (obj, index, arr) {
            switch (true) {
                case (spirit === obj):
                    this.Spirits.splice(index, 1);
                    break;
            }
            console.log(i);
        });
    },
    delSpiritWithOut:function(role){
        G.spirits.map(function (obj, index, arr) {
            switch (true) {
                case (spirit === obj && spirit.role!=role):
                    this.Spirits.splice(index, 1);
                    break;
            }
            console.log(i);
        });
    },
    delSpiritWithPlayer:function(){
        this.delSpiritWithOut('player');
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