/**
 * Created by Administrator on 2017/3/6.
 */

//流星雨
function MeteorShower(ctx,width,height) {
    //单个流星
    function Meteor(ctx, width, height) {
        this.ctx = ctx;
        this.cvsWidth = width;
        this.cvsHeight = height;
        this.x = Math.random() * (width * 2);
        this.y = 0;
        this.len = Math.random() * 100 + 200;
        this.speed = Math.random() * 3 + 3;

        //描画流星
        this.draw = function () {
            var ctx = this.ctx;
            var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.len);
            grd.addColorStop(0, "rgba(212, 212, 212, 1)");
            grd.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.save();
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 0.5, Math.PI / 4, 5 * (Math.PI / 4));
            ctx.lineTo(this.x + this.len, this.y - this.len);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        //移动流星
        this.move = function () {
            if (this.x < -this.len || this.y > this.cvsHeight + this.len) {
                return false;
            }

            this.x -= this.speed;
            this.y += this.speed;
            return true;
        };
    }

    this.ctx = ctx;
    this.cvsWidth = width;
    this.cvsHeight = height;
    this.meteors = [];
    this.clear = function(){
        ctx.save();
        ctx.clearRect(0, 0, this.cvsWidth, this.cvsHeight);
        ctx.restore();
    };

    var that = this;
    var _createMetero = function () {
        that.itvl = setInterval(function () {
            that.meteors.push(new Meteor(ctx, width, height));
        }, 500 + Math.random() * 1500);
    };

    var _frame = function(){
        that.clear();
         that.meteors.map(function(mtr,index){
             if(mtr.move()){
                mtr.draw();
             }else{
                 that.meteors.splice(index, 1);
             }
         });

        requestAnimationFrame(_frame);
    };

    // 添加监听器
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, function() {
        clearInterval(that.itvl);
        if(!document[hidden]){
            _createMetero();
        }
    }, false);

    _createMetero();
    _frame();
}

//同心圆
function Circles(ctx,width,height,x,y){

    //单个圆
    function Circle(ctx,width,height,x,y){
        this.x = x;
        this.y = y;
        this.r = 0;
        this.ctx = ctx;
        this.ctxWidth = width;
        this.ctxHeight = height;
        this.speed = 0.4;

        this.draw = function(){
            var ctx = this.ctx;
            var grd = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, (this.r - 20 > 0 ? this.r - 20 : 0));
            grd.addColorStop(0, "rgba(255,255,255,0)");
            grd.addColorStop(0.05, "rgba(255,255,255,0.15)");
            grd.addColorStop(0.1, "rgba(255,255,255,0.10)");
            grd.addColorStop(0.3, "rgba(255,255,255,0.05)");
            grd.addColorStop(0.5, "rgba(255,255,255,0.02)");
            grd.addColorStop(1, "rgba(255,255,255,0)");
            ctx.save();
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
            ctx.restore()
        };

        this.move = function(){
            var  diagonal = [
                Math.sqrt(this.x * this.x + this.y * this.y),
                Math.sqrt((this.ctxWidth - this.x) * (this.ctxWidth - this.x) + this.y * this.y),
                Math.sqrt(this.x * this.x + (this.ctxHeight - this.y) * (this.ctxHeight - this.y)),
                Math.sqrt((this.ctxWidth - this.x) * (this.ctxWidth - this.x) + (this.ctxHeight - this.y) * (this.ctxHeight - this.y))
            ];
            if(this.r > diagonal[0] && this.r > diagonal[1] && this.r > diagonal[2] && this.r > diagonal[3]){
                return false;
            }else{
                this.r += this.speed;
                return true;
            }
        }
    }

    this.circles = [];
    this.cvsWidth = width;
    this.cvsHeight = height;
    this.clear = function(){
        ctx.save();
        ctx.clearRect(0, 0, this.cvsWidth, this.cvsHeight);
        ctx.restore();
    };

    var that = this;
    var _frame = function(){
        that.clear();
        that.circles.map(function(cir,index){
            if(cir.move()){
                cir.draw();
            }else{
                that.circles.splice(index, 1);
            }
        });

        requestAnimationFrame(_frame);
    };

    var _createCircle = function(){
        that.itvl = setInterval(function () {
            that.circles.push(new Circle(ctx, width, height, x, y));
        },4500);
    };

    // 添加监听器
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, function() {
        clearInterval(that.itvl);
        if(!document[hidden]){
            _createCircle();
        }
    }, false);

    _createCircle();
    _frame();
};

