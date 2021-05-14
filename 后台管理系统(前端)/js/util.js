let util = {};
/**
 * 表单验证
 * @param {*} formId 表单所在容器id
 * @returns 是否通过验证
 */
util.formVerify = function(formId) {
  var stop = null //验证不通过状态
    , verify = layui.form.config.verify //验证规则
    , DANGER = 'layui-form-danger' //警示样式
    , formElem = $('#' + formId) //当前所在表单域
    , verifyElem = formElem.find('*[lay-verify]') //获取需要校验的元素
    , device = layui.device()

  //开始校验
  layui.each(verifyElem, function (_, item) {
    var othis = $(this)
      , vers = othis.attr('lay-verify').split('|')
      , verType = othis.attr('lay-verType') //提示方式
      , value = othis.val()

    othis.removeClass(DANGER) //移除警示样式

    //遍历元素绑定的验证规则
    layui.each(vers, function (_, thisVer) {
      var isTrue //是否命中校验
        , errorText = '' //错误提示文本
        , isFn = typeof verify[thisVer] === 'function'

      //匹配验证规则
      if (verify[thisVer]) {
        var isTrue = isFn ? errorText = verify[thisVer](value, item) : !verify[thisVer][0].test(value)
        errorText = errorText || verify[thisVer][1]

        if (thisVer === 'required') {
          errorText = othis.attr('lay-reqText') || errorText
        }

        //如果是必填项或者非空命中校验，则阻止提交，弹出提示
        if (isTrue) {
          //提示层风格
          if (verType === 'tips') {
            layer.tips(errorText, function () {
              if (typeof othis.attr('lay-ignore') !== 'string') {
                if (item.tagName.toLowerCase() === 'select' || /^checkbox|radio$/.test(item.type)) {
                  return othis.next()
                }
              }
              return othis
            }(), { tips: 1 })
          } else if (verType === 'alert') {
            layer.alert(errorText, { title: '提示', shadeClose: true })
          } else {
            layer.msg(errorText, { icon: 5, shift: 6 })
          }

          //非移动设备自动定位焦点
          if (!device.android && !device.ios) {
            setTimeout(function () {
              item.focus()
            }, 7)
          }

          othis.addClass(DANGER)
          return stop = true
        }
      }
    })
    if (stop) return stop
  })

  if (stop) return false

  return true
}




