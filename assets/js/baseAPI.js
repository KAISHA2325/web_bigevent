// 每次调用$.ajax/$.get/$.post都会线调用这个函数 在这个函数中可以拿到我们给ajax的配置对象


$.ajaxPrefilter(function (options) {
    // 在发起正真的 ajax请求之前 统一拼接请求的根路径
    options.url = `http://www.liulongbin.top:3007${options.url}`
    console.log(options.url);
    
})