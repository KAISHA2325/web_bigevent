$(function () {
    var layer = layui.layer
    var form = layui.form
    initCartList()
    // 初始化文章分类列表
    function initCartList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                console.log(res);

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

            }
        })
    }
    // 添加类别
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类'
            , content: $('#dialog-add').html(),
            area: ['500px', '300px']
        })
    })
    // 因为弹出框内的按钮是动态添加的 所以不能直接绑定事件 要通过代理的形式来绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initCartList()
                layer.msg('新增分类成功')
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })

    })
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类'
            , content: $('#dialog-edit').html(),
            area: ['500px', '300px']
        })
        // 通过data-id属性获取相应的id值
        var id = $(this).attr('data-id');
        console.log(id);
        // 获取分类数据的请求
        $.ajax({
            url: `/my/article/cates/${id}`,
            method: 'GET',
            success: function (res) {
                form.val('form-edit', res.data)
                console.log(res.data);
            }
        })

    })
    // 为编辑分类的弹出框的按钮绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                console.log(res);

                layer.msg('更新分类数据成功')
                layer.close(indexEdit);
                initCartList()


            }
        })
    })
    // 用代理为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: `/my/article/deletecate/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败')
                    }
                    layer.msg('删除数据成功')
                    layer.close(index);
                    initCartList()
                }
            })

        });

    })
})