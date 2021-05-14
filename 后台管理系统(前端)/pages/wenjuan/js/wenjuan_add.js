

/*三种题型是否正在增加*/
let danxaunIsAdd = false;
let duoxaunIsAdd = false;
let tiankongIsAdd = false;
// 单多选的增添题目时的初始选项数
let danxuanCandidateNum = 2;
let duoxuanCandidateNum = 2;

//

// 问卷列表
let questionList = [];

$(function () {
  /*questionList = [
    {title:"您从合适开始近视?",
      type:0,
      isNecessary:1,
      candidates:["小学之前","小学","初中"]}
    ,{title:"您从合适开始近视?",
      type:1,
      isNecessary:1,
      candidates:["小学之前","小学","初中"]}
    ,{title:"您从合适开始近视?",
      type:2,
      isNecessary:1,
      candidates:[]}
  ];*/


  /*初始化questionList并存入localStorage*/
  if (!window.localStorage.getItem("questionList")) {
    window.localStorage.setItem("questionList", JSON.stringify(questionList));
  }

  questionList = JSON.parse(window.localStorage.getItem("questionList"));

  /*根据数据渲染页面*/
  renderQuestionList(questionList);
  addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
  addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);

  /*绑定点击的回调*/
  $("#addDanxuanClick").on("click", function ()  {
    danxaunIsAdd = true;
    addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
    addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
  });
  $("#addDuoxuanClick").on("click", () => {
    duoxaunIsAdd = true;
    addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
    addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
  });
  $("#addTiankongClick").on("click", () => {
    tiankongIsAdd = true;
    addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
    addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
  });
  /*重置的回调*/
  $("#addReset").on("click", () => {
    if (window.confirm("是否确认重置？")){
      questionList = [];
      window.localStorage.setItem("questionList",JSON.stringify(questionList));
      updateInputQuestionList(questionList);
      danxaunIsAdd = false;
      duoxaunIsAdd = false;
      tiankongIsAdd = false;
      addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      refreshWenjuanAdd(0);
      refreshWenjuanAdd(1);
      refreshWenjuanAdd(2);
      renderQuestionList(questionList);
    }
  });

  layui.use(['upload','form'], function() {
    var form = layui.form;
    var upload = layui.upload;
    var layer = layui.layer;

    //监听提交
    form.on('submit(submitBut)', function(data) {
      if (questionList.length > 0) {
        console.log(data);
        $.ajax({
          url: 'http://'+ip+':8080/wenjuan/manager/addWenjuan',
          contentType:'application/json'
          , data: JSON.stringify({
            title:data.field.title,
            author: "771282518",
            coverImg:data.field.img,
            time:data.field.time,
            questionList:window.localStorage.getItem("questionList")
          })
          ,type: 'POST'
          , success: function (data) {
            console.log(data.code);
            if (data.code === "200") {
              layer.msg("添加成功");
              $("#add_wenjuan_title")[0].reset();
              // 图片清空
              layui.$('#uploadDemoView').addClass('layui-hide').find('img').attr('src', '');
              layui.$(".hint").show();
              layui.$("#input_img").val('')
              // 将列表清空
              questionList = [];
              window.localStorage.setItem("questionList",JSON.stringify(questionList));
              updateInputQuestionList(questionList);
              danxaunIsAdd = false;
              duoxaunIsAdd = false;
              tiankongIsAdd = false;
              addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
              addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
              refreshWenjuanAdd(0);
              refreshWenjuanAdd(1);
              refreshWenjuanAdd(2);
              renderQuestionList(questionList);

            } else {
              layer.msg("添加失败失败");
            }
          }
          ,headers:{
            token: window.localStorage.getItem("token")
          }
        })
      }
      else {
        lay.msg("至少要一个问题")
      }

      return false;
    });


    //拖拽上传
    upload.render({
      elem: '#wenjuanImg'
      ,url: 'http://'+ip+':8080/wenjuan/manager/uploadImage'
      ,method:'post'
      ,headers:{
        token: window.localStorage.getItem("token")
      }
      ,contentType:'multipart/form-data'
      ,response: {
        statusCode: 200 //规定成功的状态码，默认：0
      }
      ,done: function(res){
        console.log(res)
        layer.msg('上传成功');
        layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', 'http://'+ip+':8080/wenjuan/'+res.data.coverImg);
        layui.$(".hint").hide();
        layui.$("#input_img").val(res.data.coverImg)
      }
    });


  });

  WenjuanAddClick(3);

})

// 根据questionList渲染已经添加的问题
function renderQuestionList(questionList){
  let node = `<div id="question_list"></div>`;
  $("#question_list").replaceWith(node);
  for (let i = 0; i < questionList.length; i++) {
    let question = questionList[i];
    let node = ``;
    let candidates = '';
    let isNecessary = '';
    if (question.isNecessary===1) {
      isNecessary = '*';
    }

    addQuestionInQuestionList(question.type, question.title, question.isNecessary, question.candidates,i+1);

    // 将节点添加到页面中
    $('#question_list').append(node);

  }
}

/*根据三种题型是否正在增加而设置添加题目模板是否显示*/
function addOptionShow(danxaunIsAdd,duoxaunIsAdd,tiankongIsAdd) {
  if (danxaunIsAdd || duoxaunIsAdd || tiankongIsAdd) {// 有题目在增加
    $('#addOptions').hide();
  } else {
    $('#addOptions').show();
  }
}

/**
 * 根据数据显示添加哪种题型的细则被显示
 * @param danxaunIsAdd
 * @param duoxaunIsAdd
 * @param tiankongIsAdd
 */
function addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd) {
  if (danxaunIsAdd) {
    $("#danxuan_add").show()
  }
  else {
    $("#danxuan_add").hide()
  }
  if (duoxaunIsAdd) {
    $("#duoxuan_add").show();
  }else {
    $("#duoxuan_add").hide();
  }
  if (tiankongIsAdd) {
    $("#tiankong_add").show();
  } else {
    $("#tiankong_add").hide();
  }
}

/**
 * 添加问题到页面中
 * @param type
 * @param title
 * @param isNecessary
 * @param candidates
 */
function addQuestionInQuestionList(type, title, isNecessary, candidates,order) {
  let isNecessaryStar = '';
  let node = '';
  let questionOrder = order;
  if (isNecessary===1) {
    isNecessaryStar = '*';
  }
  if(type===0) {// 单选
    let candidatesNode = '';
    for (let j = 0; j < candidates.length; j++) {
      candidatesNode+= `<div class="candidate">
                        <div class="circle"></div>
                        <span class="candidate_content">${candidates[j]}</span>
                      </div>`
    }

    // 添加的节点

    node = `
        <div class="question">
\t\t\t\t\t<div class="question_danxuan">
\t\t\t\t\t\t<div class="question_title">
\t\t\t\t\t\t\t<span class="isNecessary">${isNecessaryStar}</span><span>${questionOrder}</span>、<span>${title}</span>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="question_candidate">
              ${candidatesNode}
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`


  }else if(type===1){// 多选
    let candidatesNode = '';
    for (let j = 0; j < candidates.length; j++) {
      candidatesNode+= `<div class="candidate">
                        <div class="circle"></div>
                        <span class="candidate_content">${candidates[j]}</span>
                      </div>`
    }
    // 添加的节点
    node = `
        <div class="question">
\t\t\t\t\t<div class="question_duoxuan">
\t\t\t\t\t\t<div class="question_title">
\t\t\t\t\t\t\t<span class="isNecessary">${isNecessaryStar}</span><span>${questionOrder}</span>、<span>${title}</span><span class="duoxuan_tishi">[多选题]</span>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="question_candidate">
              ${candidatesNode}
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`

  }else { // 填空
    node = `<div class="question">
\t\t\t\t\t<div class="question_tiankong">
\t\t\t\t\t\t<div class="question_title">
\t\t\t\t\t\t\t<span class="isNecessary">${isNecessaryStar}</span><span>${questionOrder}</span>、<span>${title}</span>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="tiankongArea">
\t\t\t\t\t\t\t<input type="text">
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`;

  }
  // 将节点添加到页面中
  $('#question_list').append(node);
}

/**
 * 添加完题目或着取消添加题目刷新添加题目模块
 * @param type 添加题目的类型
 */
function refreshWenjuanAdd(type) {
  let node = '';
  if (type === 0) { // 单选
    node = `<form id="addForm_danxuan" class="layui-form" action="">
\t\t\t\t\t\t<div class="layui-form-item layui-form-text">
\t\t\t\t\t\t\t<label class="layui-form-label">问题：</label>
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<textarea type="text" id="danxuan_add_title" name="title" placeholder="请题目内容" class="layui-textarea" required lay-verify="required"></textarea>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div id="danxaunCandidateContainer">
\t\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t\t<label class="layui-form-label">1</label>
\t\t\t\t\t\t\t\t<div class="layui-input-inline shortInput">
\t\t\t\t\t\t\t\t\t<input class="danxuanCandidate" type="text" name="categoryName" lay-verify="required" autocomplete="off" class="layui-input">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t\t<label class="layui-form-label">2</label>
\t\t\t\t\t\t\t\t<div class="layui-input-inline shortInput">
\t\t\t\t\t\t\t\t\t<input class="danxuanCandidate" type="text" name="categoryName" lay-verify="required" autocomplete="off" class="layui-input">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<button class="layui-btn" id="addDanxuanCandidate">增加选项</button>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t<input type="radio" name="isNecessary" value="0" title="必须" checked>
\t\t\t\t\t\t\t\t\t<input type="radio" name="isNecessary" value="1" title="非必须">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<button id="addDanxuanCandidateFinish" class="layui-btn" lay-submit lay-filter="submitBut">确定</button>
\t\t\t\t\t\t\t\t<button id="addDanxuanCandidateCancel" class="layui-btn">取消</button>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>`
    $("#addForm_danxuan").replaceWith(node);
    WenjuanAddClick(0);
  }
  else if (type === 1) { // 多选
    node = `<form id="addForm_duoxuan" class="layui-form" action="">
\t\t\t\t\t\t<div class="layui-form-item layui-form-text">
\t\t\t\t\t\t\t<label class="layui-form-label">问题：</label>
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<textarea id="duoxuan_add_title" name="description" lay-verify="required" placeholder="请题目内容" class="layui-textarea"></textarea>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div id="duoxuanCandidateContainer">
\t\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t\t<label class="layui-form-label">1</label>
\t\t\t\t\t\t\t\t<div class="layui-input-inline shortInput">
\t\t\t\t\t\t\t\t\t<input class="duoxuanCandidate" type="text" name="categoryName" lay-verify="required" autocomplete="off" class="layui-input">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t\t<label class="layui-form-label">2</label>
\t\t\t\t\t\t\t\t<div class="layui-input-inline shortInput">
\t\t\t\t\t\t\t\t\t<input class="duoxuanCandidate" type="text" name="categoryName" lay-verify="required" autocomplete="off" class="layui-input">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<button class="layui-btn" id="addDuoxuanCandidate">增加选项</button>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t<input type="radio" name="isNecessary" value="0" title="必须" checked>
\t\t\t\t\t\t\t\t\t<input type="radio" name="isNecessary" value="1" title="非必须">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<button id="addDuoxuanCandidateFinish" class="layui-btn" lay-submit lay-filter="submitBut">确定</button>
\t\t\t\t\t\t\t\t<button id="addDuoxuanCandidateCancel" class="layui-btn">取消</button>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>`;
    $("#addForm_duoxuan").replaceWith(node);
    WenjuanAddClick(1);
  }
  else { // 填空题
    node = `<form id="addForm_tiankong" class="layui-form" action="">
\t\t\t\t\t\t<div class="layui-form-item layui-form-text">
\t\t\t\t\t\t\t<label class="layui-form-label">问题：</label>
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<textarea id="tiankong_add_title" name="description" lay-verify="required" placeholder="请题目内容" class="layui-textarea"></textarea>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t<input type="radio" name="isNecessary" value="0" title="必须" checked>
\t\t\t\t\t\t\t\t\t<input type="radio" name="isNecessary" value="1" title="非必须">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="layui-form-item">
\t\t\t\t\t\t\t<div class="layui-input-block">
\t\t\t\t\t\t\t\t<input type="button" id="addTiankongCandidateFinish" class="layui-btn" lay-submit lay-filter="submitBut" value="确定"/>
\t\t\t\t\t\t\t\t<input type="button" id="addTiankongCandidateCancel" class="layui-btn" value="取消"/>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>`;
    $("#addForm_tiankong").replaceWith(node);
    WenjuanAddClick(2);
  }
  layui.use('form', function () {
    var form = layui.form;
    form.render();
  });
}

/**
 * 给添加题目的编辑区wenjuan_add增加点击监听
 * @type 刷新问卷类型
 * @constructor
 */
function WenjuanAddClick(type) {
  if(type===0) { // 单选

    $("#addDanxuanCandidate").on("click", () => {// 增加单选的选项的点击监听
      console.log(111);
      danxuanCandidateNum += 1;
      let node = `<div class="layui-form-item">
\t\t\t\t\t\t\t\t<label class="layui-form-label">${danxuanCandidateNum}</label>
\t\t\t\t\t\t\t\t<div class="layui-input-inline shortInput">
\t\t\t\t\t\t\t\t\t<input class="danxuanCandidate" type="text" name="categoryName" lay-verify="required" autocomplete="off" class="layui-input">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>`;
      $("#danxaunCandidateContainer").append(node);
      return false
    });
    // 添加单选的取消回调
    $("#addDanxuanCandidateCancel").on("click", () => {
      danxaunIsAdd = false;
      addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      refreshWenjuanAdd(0);
      return false;
    });
    // 添加单选题目的确定点击回调
    $("#addDanxuanCandidateFinish").on("click", () => {
      console.log(formVerify("addForm_danxuan"));
      if (formVerify("addForm_danxuan")) {
        let title = '';// 题目
        let type = 0; // 题型
        let candidates = []; // 候选项
        let isNecessary = 0; // 是否必选

        title = $("#danxuan_add_title").val();
        for (let i = 0; i < $(".danxuanCandidate").length; i++) {
          // console.log($($(".danxuanCandidate")[i]).val());
          candidates.push($($(".danxuanCandidate")[i]).val())
        }

        if ($("input[name=isNecessary]")[0].checked) {
          isNecessary = 1
        }


        questionList.push({
          title,
          type,
          candidates,
          isNecessary
        });

        console.log(questionList);

        // 更新localStorage
        window.localStorage.setItem("questionList", JSON.stringify(questionList));

        updateInputQuestionList(questionList);


        // 重新渲染列表
        addQuestionInQuestionList(type, title, isNecessary, candidates,questionList.length);

        danxaunIsAdd = false;
        addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        refreshWenjuanAdd(0);
        return false; // 关闭默认刷新行为
      }

    });
  }
  else if (type === 1) { // 多选// 增加多选选项的点击监听

    $("#addDuoxuanCandidate").on("click", () => {
      duoxuanCandidateNum += 1;
      let node = `<div class="layui-form-item">
\t\t\t\t\t\t\t\t<label class="layui-form-label">${duoxuanCandidateNum}</label>
\t\t\t\t\t\t\t\t<div class="layui-input-inline shortInput">
\t\t\t\t\t\t\t\t\t<input class="duoxuanCandidate" type="text" name="categoryName" lay-verify="required" autocomplete="off" class="layui-input">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>`;
      $("#duoxuanCandidateContainer").append(node);
      return false;
    });
    // 添加多选题的取消点击回调
    $("#addDuoxuanCandidateCancel").on("click", () => {
      duoxaunIsAdd = false;
      addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      refreshWenjuanAdd(1);
    });
    // 添加多选题目的确定点击回调
    $("#addDuoxuanCandidateFinish").on("click", () => {
      if (formVerify("addForm_duoxuan")) {
        let title = '';// 题目
        let type = 1; // 题型
        let candidates = []; // 候选项
        let isNecessary = 0; // 是否必选

        title = $("#duoxuan_add_title").val();
        console.log("title",title);
        for (let i = 0; i < $(".duoxuanCandidate").length; i++) {
          // console.log($($(".duoxuanCandidate")[i]).val());
          candidates.push($($(".duoxuanCandidate")[i]).val())
        }

        // console.log($("input[name=isNecessary]"));
        if ($("input[name=isNecessary]")[2].checked) {
          isNecessary = 1
        }
        console.log("isNecessary:",isNecessary);
        questionList.push({
          title,
          type,
          candidates,
          isNecessary
        })

        // 更新localStorage
        window.localStorage.setItem("questionList", JSON.stringify(questionList));
        updateInputQuestionList(questionList);
        // 重新渲染列表
        addQuestionInQuestionList(type, title, isNecessary, candidates,questionList.length);
        duoxaunIsAdd = false;
        addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        refreshWenjuanAdd(1);
        return false; // 关闭默认刷新行为
      }
    });
  }
  else if (type === 2) { // 填空// 添加填空题的取消点击回调

    $("#addTiankongCandidateCancel").on("click", () => {
      tiankongIsAdd = false;
      addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      refreshWenjuanAdd(2);
    });
    // 添加填空题目的确定点击回调
    $("#addTiankongCandidateFinish").on("click", () => {
      if (formVerify("addForm_tiankong")) {
        let title = '';// 题目
        let type = 2; // 题型
        let isNecessary = 0; // 是否必选
        let candidates = [];

        title = $("#tiankong_add_title").val();

        if ($("input[name=isNecessary]")[4].checked) {
          isNecessary = 1
        }
        questionList.push({
          title,
          type,
          candidates,
          isNecessary
        });

        // 更新localStorage
        window.localStorage.setItem("questionList", JSON.stringify(questionList));
        updateInputQuestionList(questionList);

        // 重新渲染列表
        addQuestionInQuestionList(type, title, isNecessary, candidates,questionList.length);

        let tiankongIsAdd = false;
        addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        refreshWenjuanAdd(2);


        console.log("点击了确定");
        return false;
      }

    });
  }
  else { // 全部

    // 增加单选的选项的点击监听
    $("#addDanxuanCandidate").on("click", () => {
      console.log(111);
      danxuanCandidateNum += 1;
      let node = `<div class="layui-form-item">
\t\t\t\t\t\t\t\t<label class="layui-form-label">${danxuanCandidateNum}</label>
\t\t\t\t\t\t\t\t<div class="layui-input-inline shortInput">
\t\t\t\t\t\t\t\t\t<input class="danxuanCandidate" type="text" name="categoryName" lay-verify="required" autocomplete="off" class="layui-input">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>`;
      $("#danxaunCandidateContainer").append(node);
      return false
    });
    // 增加多选选项的点击监听
    $("#addDuoxuanCandidate").on("click", () => {
      duoxuanCandidateNum += 1;
      let node = `<div class="layui-form-item">
\t\t\t\t\t\t\t\t<label class="layui-form-label">${duoxuanCandidateNum}</label>
\t\t\t\t\t\t\t\t<div class="layui-input-inline shortInput">
\t\t\t\t\t\t\t\t\t<input class="duoxuanCandidate" type="text" name="categoryName" lay-verify="required" autocomplete="off" class="layui-input">
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>`;
      $("#duoxuanCandidateContainer").append(node);
      return false;
    });

    // 添加单选的取消回调
    $("#addDanxuanCandidateCancel").on("click", () => {
      danxaunIsAdd = false;
      addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      refreshWenjuanAdd(0);
      return false;
    });

    // 添加多选题的取消点击回调
    $("#addDuoxuanCandidateCancel").on("click", () => {
      duoxaunIsAdd = false;
      addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      refreshWenjuanAdd(1);
    });

    // 添加填空题的取消点击回调
    $("#addTiankongCandidateCancel").on("click", () => {
      tiankongIsAdd = false;
      addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
      refreshWenjuanAdd(2);
    });

    // 添加单选题目的确定点击回调
    $("#addDanxuanCandidateFinish").on("click", () => {
      if (formVerify("addForm_danxuan")) {
        let title = '';// 题目
        let type = 0; // 题型
        let candidates = []; // 候选项
        let isNecessary = 0; // 是否必选

        title = $("#danxuan_add_title").val();
        for (let i = 0; i < $(".danxuanCandidate").length; i++) {
          // console.log($($(".danxuanCandidate")[i]).val());
          candidates.push($($(".danxuanCandidate")[i]).val())
        }

        if ($("input[name=isNecessary]")[0].checked) {
          isNecessary = 1
        }


        questionList.push({
          title,
          type,
          candidates,
          isNecessary
        });

        console.log(questionList);

        // 更新localStorage
        window.localStorage.setItem("questionList", JSON.stringify(questionList));
        updateInputQuestionList(questionList);


        // 重新渲染列表
        addQuestionInQuestionList(type, title, isNecessary, candidates,questionList.length);

        danxaunIsAdd = false;
        addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        refreshWenjuanAdd(0);
        return false; // 关闭默认刷新行为
      }

    });

    // 添加多选题目的确定点击回调
    $("#addDuoxuanCandidateFinish").on("click", () => {
      if (formVerify("addForm_duoxuan")) {
        let title = '';// 题目
        let type = 1; // 题型
        let candidates = []; // 候选项
        let isNecessary = 0; // 是否必选

        title = $("#duoxuan_add_title").val();
        console.log("title",title);
        for (let i = 0; i < $(".duoxuanCandidate").length; i++) {
          // console.log($($(".duoxuanCandidate")[i]).val());
          candidates.push($($(".duoxuanCandidate")[i]).val())
        }

        // console.log($("input[name=isNecessary]"));
        if ($("input[name=isNecessary]")[2].checked) {
          isNecessary = 1
        }
        console.log("isNecessary:",isNecessary);
        questionList.push({
          title,
          type,
          candidates,
          isNecessary
        })

        // 更新localStorage
        window.localStorage.setItem("questionList", JSON.stringify(questionList));
        updateInputQuestionList(questionList);
        // 重新渲染列表
        addQuestionInQuestionList(type, title, isNecessary, candidates,questionList.length);
        duoxaunIsAdd = false;
        addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        refreshWenjuanAdd(1);
        return false; // 关闭默认刷新行为
      }
    });

    // 添加填空题目的确定点击回调
    $("#addTiankongCandidateFinish").on("click", () => {
      if (formVerify("addForm_tiankong")) {
        let title = '';// 题目
        let type = 2; // 题型
        let isNecessary = 0; // 是否必选
        let candidates = [];

        title = $("#tiankong_add_title").val();

        if ($("input[name=isNecessary]")[4].checked) {
          isNecessary = 1
        }
        questionList.push({
          title,
          type,
          candidates,
          isNecessary
        });

        // 更新localStorage
        window.localStorage.setItem("questionList", JSON.stringify(questionList));
        updateInputQuestionList(questionList);

        // 重新渲染列表
        addQuestionInQuestionList(type, title, isNecessary, candidates,questionList.length);

        let tiankongIsAdd = false;
        addOptionShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        addDetailShow(danxaunIsAdd, duoxaunIsAdd, tiankongIsAdd);
        refreshWenjuanAdd(2);


        console.log("点击了确定");
        return false;
      }

    });
  }
}


/**
 * 表单验证
 * @param {*} formId 表单所在容器id
 * @returns 是否通过验证
 */
function formVerify(formId) {
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

/**
 * 更新隐藏的inputQuestionList
 * @param questionList
 */
function updateInputQuestionList(questionList) {
  layui.$("#inputQuestionList").val(questionList)
}










