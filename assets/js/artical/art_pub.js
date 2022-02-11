$(function () {
    // 获取layui的弹出层
    var layer = layui.layer
    // 获取layui的表单
    var form = layui.form
    // 初始化富文本编辑器
    initEditor()
    // 加载文章分类
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                layer.msg('获取文章分类列表成功')
                // 渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 切记调用form.render()重新渲染表单区
                form.render()
            }

        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 选择封面按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 4 监听coverFile的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //4-1. 拿到用户选择的文件
        var files = e.target.files[0]
        if (files.length === 0) {
            return layer.msg('请选择文件')
        }
        // 4-2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files)
        // 4-3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)
    })
    // 5 文章的发布状态
    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })
    //6 监听表单的提交事件并获取表单的值
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);//FormData一个表单的对象 FormData内存着的时提交时的建与值
        // 6-1 将文章发布状态存到fd中
        fd.append('state', art_state)
        /*     fd.forEach(function (v, k) {
                console.log(k, v);
    
            }) */
        // 6-2 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象 blob即为文件对象
                // 得到文件对象后，进行后续的操作
                // 6-3将文件对象存到fd中
                fd.append('cover_img', blob)
                // 7 发起请求 发布文章
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            /* 注意：如果向服务器提交的时formData格式的数据 必须添加以下两个配置项 */
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.herf = '/artical/art_list.html'
            }
        })
    }
})