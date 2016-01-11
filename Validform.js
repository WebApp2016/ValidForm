var Validform = {
    //公共验证规则
    datatype: {
        "qq": /[1-9][0-9]{4,}/,                                 //qq号
        "idCode": /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/,        //身份证
        "*": /[\w\W]+/,                                         //不能为空！
        "*6-16": /^[\w\W]{6,16}$/,                              //请填写6到16位任意字符！
        "n": /^\d+$/,                                           //数字
        "n6-16": /^\d{6,16}$/,                                  //请填写6到16位数字
        "s": /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/,           //不能输入特殊字符！
        "s6-18": /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/,  //请填写6到18位字符！
        "p": /^[0-9]{6}$/,                                      //邮政编码
        "m": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/, //手机号
        "e": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,   //邮箱
        "Pasport": /^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/, //护照
        "Dl": /(\d{15})$/,                                        //驾驶证
        "Officer": /(\d{8})/,                                           //军官证
        "ph": /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,  //电话
        "n6": /\d{6}/,   //验证码
        "xm": /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/ , //姓名                               //军官证
        "nc":/^[\u4E00-\u9FA5a-zA-Z0-9_]{0,}$/                    //昵称
    },
    formCheck: function (options) {
        var defaults = {
            valiContent: "",
            submitBtn: "",
            isAjax: true,
            ischeckBtn: "",
            valiType: "",
            passwordStrength:"#passwordStrength",
            myCallback: function () { }
        };
        options = $.extend({}, defaults, options);
        //conclass是form的选择器，submitBtn是提交按钮选择器，ischeckBtn是选择可选验证开关选择器                                                          // fn是回调函数
        var ipt = $(options.valiContent).find("input[datatype], select[datatype]");
        //改变验证类型
        $(options.valiContent).on("change", "select[valiType]", function () {
            $(this).next("input[datatype]").attr("datatype", $(this).find("option:selected").attr("datatype"));
            $(this).next("input[datatype]").attr("errormsg", $(this).find("option:selected").text() + "格式错误");
            $(this).next("input[datatype]").trigger("blur");
        });
        //提交循环验证
        $(options.valiContent).on("click", options.submitBtn, function (event) {
            var len = ipt.length;
            ipt.each(function () {
                $(this).trigger("blur");
            });
            if ($(options.valiContent).find(".valiform-error").length == 0 && options.isAjax) {        //是ajax提交，代码待定
                options.myCallback();                                                              // 执行fn回调函数
                event.preventDefault();
            } else if ($(options.valiContent).find(".valiform-error").length == 0 && !options.isAjax) { // form提交
                $(options.valiContent).trigger("submit");
                event.preventDefault();
            } else {
                event.preventDefault();
                return false;                                                 //submit提交，或是ajax提交，只要有错就不提交！
            };
        });
        //验证非空
        $(options.valiContent).on("blur", "input[datatype]", function () {
            if (!$(options.ischeckBtn).prop("checked") && $(this).attr("ischeck") != undefined) {
                return false;
            };
            if ($(this).val() == "" && $(this).attr("ignore") == undefined) {
                if ($(this).attr("nullmsg") != undefined) {
                    $(this).addClass("valiform-error");
                    $(this).next("span.text-error").removeClass("text-suc").text($(this).attr("nullmsg"));
                } else {
                    $(this).addClass("valiform-error");
                    $(this).next("span.text-error").text("请输入内容");
                };
            };
        });
        //验证格式
        $(options.valiContent).on("blur", "input[datatype]", function () {
            if (!$(options.ischeckBtn).prop("checked") && $(this).attr("ischeck") != undefined) {
                return false;
            };
            var re = eval(Validform.datatype[$(this).attr("datatype")]);
            if ($(this).val() == "") {
                return;
            };
            if (re.test($(this).val()) && $(this).val().search(re) == 0) {
                $(this).removeClass("valiform-error");
                $(this).next("span.text-error").addClass("text-suc").text("验证成功");
            } else {
                if ($(this).attr("errormsg") != undefined) {
                    $(this).addClass("valiform-error");
                    $(this).next("span.text-error").removeClass("text-suc").text($(this).attr("errormsg"));
                } else {
                    $(this).addClass("valiform-error");
                    $(this).next("span.text-error").removeClass("text-suc").text("格式错误");
                };
            };
        });
        //验证非必填
        $(options.valiContent).on("blur", "input[datatype]", function () {
            if (!$(options.ischeckBtn).prop("checked") && $(this).attr("ischeck") != undefined) {
                return false;
            };
            if ($(this).val() == "" && $(this).attr("ignore") != undefined) {
                $(this).removeClass("valiform-error");
                $(this).next("span").text("");
            };
        });
        //选择验证
        $(options.valiContent + " " + options.ischeckBtn).click(function () {
            if (!$(this).prop("checked")) {
                $(options.valiContent).find("input[ischeck]").val("");
                $(options.valiContent).find("input[ischeck]").removeClass("valiform-error").next("span").text("");
            }else {
                $(options.valiContent).find("input[ischeck]").each(function () {
                    if ($(this).val() != "") {
                        $(this).trigger("blur");
                    };
                });
            };
        });
        //验证密码强度
        $(options.valiContent).on("keyup", " input:password[datatype]", function () {
            if ($(this).attr("passwordStrength") == "passwordStrength" && $(this).attr("type") == "password" && $(this).attr("recheck") == undefined && $(this).val().length > 5) {
                var passClass = 0;
                if ($(this).val().search(/[A-z]/) > -1) {
                    passClass += 1;
                };
                if ($(this).val().search(/[0-9]/) > -1) {
                    passClass += 1;
                };
                if ($(this).val().search(/\W/) > -1) {
                    passClass += 1;
                };
                $(options.passwordStrength + " span:lt(" + passClass + ")").addClass("bgStrength");
            } else if ($(this).attr("recheck") == undefined) {
                $(options.passwordStrength + " span").removeClass("bgStrength");
            };
        });
        //验证密码是否一致
        $(options.valiContent).on("blur", "input[recheck]", function () {
            if ($(this).val() != $(options.valiContent + " input[name=" + $(this).attr("recheck") + "]").val() && $(this).val() != "") {
                if ($(this).attr("nullmsg") != undefined) {
                    $(this).addClass("valiform-error");
                    $(this).next("span").removeClass("text-suc").text($(this).attr("errormsg"));
                } else {
                    $(this).addClass("valiform-error");
                    $(this).next("span").text("密码不一致");
                };
            } else if ($(this).val() == $(options.valiContent + " input[name=" + $(this).attr("recheck") + "]").val() && $(this).val() != "") {
                $(this).removeClass("valiform-error");
                $(this).next("span").text("验证成功");
            }
            else {
                $(this).next("span").text($(this).attr("nullmsg"));
            };
        });
        //验证下拉框
        $(options.valiContent).on("blur", "select[datatype]", function () {
            if ($(this).find("option:selected").text().indexOf("请选择") > -1) {
                $(this).addClass("valiform-error");
                $(this).next("span").removeClass("text-suc");
                if ($(this).attr("errormsg") == undefined) {
                    $(this).next("span").text("格式错误");
                } else {
                    $(this).next("span").text($(this).attr("errormsg"));
                }
            } else {
                $(this).removeClass("valiform-error");
                $(this).next("span").addClass("text-suc").text("验证成功");
            }
        });
    },
    reset: function (content) {
        var ipt = $(content).find("input[datatype]");
        ipt.val("").removeClass("valiform-error");
        ipt.next("span").text("");
    }
};
