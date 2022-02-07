$(function () {
  var layer = layui.layer
  // 从layui中获取form对象并通过form.verify自定义校验
  var form = layui.form
  form.verify({
    nickname: function (val) {
      if (val.length > 6) {
        return '昵称长度必须在1~6个字符之间'
      }
    }
  })
  // 初始化用户基本信息
  initUserInfo();
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg()
        }
        console.log(res);
        // 调用form.valKauai快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  };
  // 重置表单数据
  $('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    initUserInfo();
  })
  // 监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败')
        }
        layer.msg('修改用户信息成功')
        // 调用父页面中的方法 重新渲染用户的头像与信息
        // window.parent为ifram的父元素 即index.html页面 
        window.parent.getUserInfo()
      }
    })
  })
})

