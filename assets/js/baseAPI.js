// 每次调用$.ajax/$.get/$.post都会线调用这个函数 在这个函数中可以拿到我们给ajax的配置对象


$.ajaxPrefilter(function (options) {
    // 在发起正真的 ajax请求之前 统一拼接请求的根路径
    options.url = `http://www.liulongbin.top:3007${options.url}`
    console.log(options.url);
    // 统一为有权限的接口headers请求头 要判断是否以my开头的路径 只有my开头的路径才需要请求头
    if (options.url.indexOf('/my/') !== -1) {//索引为-1说明没有/my/
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }

})