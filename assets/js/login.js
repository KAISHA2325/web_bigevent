$(function () {
    // 点击注册
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击登录
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 从layui中获取form对象并通过form.verify自定义校验
    var form = layui.form;
    form.verify({
        'pwd': [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 判断两次密码是否一致 value返回的是input中的值
        'repwd': function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功');
            // 注册成功后切换到登录界面
            $('#link_login').click()
        })
    })
    // 监听登录的表单事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),//serialize()获取表单对象的数据
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功');
                console.log(res.token);
                //    location.href='/index.html'
            }

        })
    })
})