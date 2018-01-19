/**
 * Created by Administrator on 2017/2/21.
 */

/**-----------------------------------------------------------------
 * 公共API接口
 * ------------------------------------------------------------------
 */

// 判断是否空字符串
function isEmptyString(str) {
    if (str == "" | str == null | str == undefined) {
        return true;
    } else {
        return false;
    }
}

// 判断是否是空对象
function isEmptyObject(obj) {
    for ( var n in obj) {
        return false
    }
    return true;
}

//判断是否是数字
function isNumber(num) {
    return /^[1-9]+[0-9]*]*$/.test(num);
}

/** -----------------------------------------------------------------
 * toast弹出层
 * loading 弹出层
 * ------------------------------------------------------------------
 */
(function($){
    //toast提示框
    var toast = new ToastMsg();
    $.showToast = function(msg,delay){
        toast.clear();
        toast.show(msg,delay);
    };

    function ToastMsg()
    {
        var that = this;
        var defaults = {
            msg: "",
            delay: 2000,
            closeFlag : 0
        };
        this.options = {};
        this.init = function(msg,delay){
            $.extend(this.options, defaults, { msg:msg, delay:delay });
            $("body").append("<div class='toast-msg'>"+ this.options.msg + "</div>");
        };

        this.show = function(msg,delay){
            this.init(msg,delay);

            //显示toast
            setTimeout(function(){
                $("body .toast-msg").css("left", ($("body").width() -  $("body .toast-msg").width()) / 2 + "px");
                $("body .toast-msg").addClass("show");
            });

            //隐藏toast
            that.options.closeSet = setTimeout(function(){
                $("body .toast-msg").addClass("hide");
                setTimeout(function(){
                    if(0 != that.options.closeSet){
                        $("body .toast-msg").remove();
                    }
                }, 400)
            }, that.options.delay);
        };

        this.clear = function(){
            $("body .toast-msg").remove();
            if(undefined != this.options.closeSet){
                clearTimeout(this.options.closeSet);
                this.options.closeSet = 0;
            }
        };
    }


    //加载中弹出层
    var loading = new Loading();
    $.loading = function(msg){
        loading.clear();
        loading.show(msg);
    };

    function Loading(){

    }
})($);


/** -----------------------------------------------------------------
 * 初始化处理
 * ------------------------------------------------------------------
 */
$(function(){
    initAnimate();
    initSwipe();

    createMeteroShow();
    createCircles();
});

function createMeteroShow()
{
    meteorshow = [];
    $(".page.bg1:not(.hidden)").each(function(index){
        var cvs = ($("<canvas class='canvas'/>").appendTo(this))[0];
        var width = window.innerWidth;
        var height = window.innerHeight;
        var context = cvs.getContext('2d');
        cvs.width = width;
        cvs.height = height;
        meteorshow[index] = new MeteorShower(context, width, height);
    });
}

function createCircles()
{
    circleArray = [];
    $(".page.bg2:not(.hidden)").each(function(index){
        var cvs = ($("<canvas class='canvas'/>").appendTo(this))[0];
        var width = window.innerWidth;
        var height = window.innerHeight;
        var context = cvs.getContext('2d');
        cvs.width = width;
        cvs.height = height;

        if($(this).hasClass("bg2_2")){
            circleArray[index] = new Circles(context, width, height, width * 0.48, height * 0.5);
        }else{
            circleArray[index] = new Circles(context, width, height, width * 0.5, height * 0.1);
        }
    });
}


//初始化预设动画
function initAnimate()
{
    //---------------------------------------------------------------------------------------
    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    function mu() {
        var j = -1;
        $(".page:not(.hidden)").find(".animate-element:not(.animated)").each(function () {
            if( !($.inviewport(this, {threshold : -10}))){ return; }

            var $this = $(this);
            if (!$this.hasClass("animated") && !$this.hasClass("animation-triggered")) {
                $this.addClass("animation-triggered");
                j++;
                if($this.hasClass("slip")){
                    setTimeout(function () {
                        $this.addClass( $this.attr("animate-name") + " " +"animated");
                    }, 100 * j);

                }else{
                    setTimeout(function () {
                        $this.addClass( $this.attr("animate-name") + " " +"animated");
                    }, 200 * j);
                }
            };
        });

    };

    if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE6.0")
    {
        var ie6=1;
        alert("您的浏览器版本过低。请更换浏览器以便于更好体验")
    }
    else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0")
    {
        var ie7=1;
    }
    else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0")
    {
        var ie8=1;
    }
    else {
        mu();

        $(document).on("swipeUp", function () {
            setTimeout(function(){
                mu();
            },800)
        });
    }
}

//初始化滑动处理
function initSwipe()
{
    var $pageWraper = $(".page-group");

    //往下翻页事件
    $pageWraper.delegate(".page:not(.hidden)","swipeUp",function(e){
        if($pageWraper.hasClass("swiping")){ return; }  //判断是否滚动中

        var _index = $pageWraper.attr("swipe-index") == undefined ? 1 : parseInt($pageWraper.attr("swipe-index"));
        var _total = $pageWraper.find(".page:not(.hidden)").size();
        if(_total > _index) {
            //$pageWraper.css("top", "-" + (_index * (document.body.clientHeight + 16)) + "px");
            $pageWraper.css("transform", "translate(0px,-" + (_index * (document.body.clientHeight + 16)) + "px)");
            $pageWraper.attr("swipe-index", (_index + 1));

            if (_total == ( _index + 1)) {
                $(".swipe-down").addClass("hidden");
            } else {
                $(".swipe-down").removeClass("hidden");
            }

            //滚动中，设置滚动状态
            $pageWraper.addClass("swiping");
            setTimeout(function(){ $pageWraper.removeClass("swiping")}, 1500);
        }
    });

    //往上翻页事件
    $pageWraper.delegate(".page","swipeDown",function(){
        if($pageWraper.hasClass("swiping")){ return; }  //判断是否滚动中

        var _index = $pageWraper.attr("swipe-index") == undefined ? 1 : parseInt($pageWraper.attr("swipe-index"));
        if(_index >= 2){
            //$pageWraper.css("top", "-" + (_index - 2)  * (document.body.clientHeight + 16) + "px");
            $pageWraper.css("transform", "translate(0px,-" + (_index - 2)  * (document.body.clientHeight + 16) + "px)");
            $pageWraper.attr("swipe-index", (_index - 1));

            $(".swipe-down").removeClass("hidden");

            //滚动中，设置滚动状态
            $pageWraper.addClass("swiping");
            setTimeout(function(){ $pageWraper.removeClass("swiping")}, 1500);
        }
    });

    //微信浏览器禁止页面下拉查看网址
    $("body").on("touchmove", function (event) {event.preventDefault();});
    document.addEventListener('touchmove', function(e){e.preventDefault()}, false);
}

