$(function () {
    // 获取layui的弹出层
    var layer = layui.layer
    // 获取layui的分页
    var laypage = layui.laypage;
    // 获取layui的表单
    var form = layui.form
    // 定义补零函数对时间进行美化
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义template内的时间过滤器来对时间进行美化
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 定义查询参数对象 需将参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值 默认为 1
        pagesize: 2,	//每页显示多少条数据 默认为 2
        cate_id: '',	//文章分类的 Id
        state: ''	//文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()
    // 初始化文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败')
                }
                console.log(res.data);

                // 请求成功 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 数据上传完后才会有数据条数
                // 渲染分页res.total为上传的数据条数
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // $('[name=cate_id]').html(htmlStr)
                /*   由于模板引擎的渲染并没有被lauyi的js脚本监听到 所以通过模板引擎动态渲染的数据并不会显示 要调用layui form中的render方法 表示重新渲染表单区*/
                // form.render()
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    // 筛选表单的事件 
    /*   1 获取表单值
      2 将表单值上传到数据库
      3 重新渲染表单 */
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id;
        q.state = state;
        initTable()

    })
    // 渲染分页res.total为上传的数据条数
    function renderPage(total) {
        console.log(total);
        // 调用laypage.render渲染分页
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total,//数据总数，从服务端得到
            limit: q.pagesize,//每页显示多少条数据 默认为 2
            curr: q.pagenum,//页码值 默认为 1
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],//当切换条目时也会触发jump回调
            // 1 分页切换触发jump回调  first===undefind  2 只要调用laypage.render就会促发jump回调 first===true
            // 先切换q的页码值 然后上传给数据库 再重新初始化文章列表数据
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，first（是否首次，一般用于初始加载的判断）比如：
                console.log('当前页' + obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log('每页显示的条数' + obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 把最新的条目数赋值到q.pagesice中
                // initTable() 死循环
                //首次不执行
                if (!first) {
                    initTable()
                }
            }

        });
    }
    // 删除按钮事件

    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length//获取删除按钮个数
        console.log(len);

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        /* 当数据删除完成后 要判断当前这一页是否还有剩余的数据 如果没有剩余的数据 则让页码值-1再重新调用initTable() 判断一页删除按钮的个数 如果===1 说明再次删除时这个页面就没有数据了 此时要退回前一个页面 页码值最小为1*/
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                        initTable()
                    }
                }

            })
            layer.close(index);
        });

    })
})
