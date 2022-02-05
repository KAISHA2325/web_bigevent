$(function () {
    getUserInfo();
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 退出后要跳到登录页并且清空localStorae里的数据
            localStorage.removeItem('token')
            location.href = '/login.html'
            // 关闭弹出层
            layer.close(index);
        });

    })
})
// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // 请求头配置对象
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            console.log(res.data);

            renderAvatar(res.data)
        },
        complete: function (res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //    强制清空token并强制跳转到登录页
                localStorage.removeItem('token')
                location.href = '/login.html'
            }

        }
    })
}
// 渲染用户的头像信息
function renderAvatar(user) {
    // 用户名
    var name = user.nickname || user.username
    console.log(user.username);
    $('#welcome').html(`欢迎&nbsp;${name}`)
    // 渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase()//用于获取字符串的第一个字符
        $('.text-avatar').html(first).show()
    }
}