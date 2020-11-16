//fileMenu 记录已呼出的右键菜单；sortRule 排序方式标记；viewRule 视图标记；files主体中文件&文件夹对象；recycleBin 回收站数据；path 当前主体路径记录
var _globalVar={
	fileMenu:null,
	sortRule:'时间',
	viewRule:'list',
	files:[],
	recycleBin:[],
	path:[]
};

var _globalFn = {
	//控制头部状态 true为默认头部 false为文件操作头部
	headStatus:function (_switch){
		var gHead = document.querySelector('.g-h');
		var hDefualt = document.querySelector('.g-hdefu');
		var hMod = document.querySelector('.g-hmod');
		var showNum = document.querySelector('.m-selnum');
		var checkNum = _globalFn.checkedCount();
		var hModUl = document.querySelectorAll('.g-hmod .m-filefn');

		//头部选中后MOD模块切换 普通和回收站2款
		if(_globalVar.path[0].name !== '回收站'){
			hModUl[0].style.display = 'block';
			hModUl[1].style.display = 'none';
		}else{
			hModUl[0].style.display = 'none';
			hModUl[1].style.display = 'block';
		}
		//常规头部与选中头部切换
		if (_switch) {
			if(checkNum<=1){
				gHead.className = 'g-h s-wrap';
				hDefualt.style.display = 'block';
				hMod.style.display = 'none';
			}
			showNum.innerHTML = '选择了'+(checkNum-1)+'项';
		}else{
			gHead.className += ' f-ghmod';
			hDefualt.style.display = 'none';
			hMod.style.display = 'block';
			showNum.innerHTML = '选择了'+(checkNum+1)+'项';
		}
	},
	sortMiddleware:function(data){
		switch(_globalVar.sortRule){
			//时间近的在前面
			case '时间':
				data.sort(function(a,b){
					return b.time-a.time;
				})
			break;
			//字母在前 汉字在后
			case '首字母':
				data.sort(function(a,b){
					aValue = a.name.charCodeAt(0);
					bValue = b.name.charCodeAt(0);
					return aValue-bValue;
				})
			break;
		}
		return data;
	},
	//根据文件类型选文件 data为徐查找数据，type为类型，不输入返回所有文件。
	pickFileType:function(data,type){
		var result = [];
		if(!type) type='allfile';
		(function fn(prevData,type){
			for(var i=0;i<prevData.length;i++){
				if(prevData[i].child) {
					fn(prevData[i].child,type);
				}
				if(type !== 'allfile'&&type !== 'all'){
					if(prevData[i].icon === type){
						result.push(prevData[i]);
					}
				}else{
					if(prevData[i].icon === 'folder'&&type === 'all'){
						result.push(prevData[i]);
					}
					if(prevData[i].icon !== 'folder'){
						result.push(prevData[i]);
					}
				}
			}
			return result;
		})(data,type);
		return result;
	},
	//搜索文件
	searchFile:function(data,searchValue){
		var data = _globalFn.pickFileType(data,'all');
		var result = [];
		data.forEach(function(ele){
			var typeHans;
			switch(ele.icon){
				case 'folder':
					typeHans = '文件夹';
				break;
				case 'document':
					typeHans = '文件文档文本';
				break;
				case 'picture':
					typeHans = '文件图片';
				break;
				case 'video':
					typeHans = '文件视频';
				break;
				case 'music':
					typeHans = '文件音乐';
				break;
			}
			var keyword = typeHans+ele.name.toLowerCase();
			var reg = new RegExp(searchValue);
			if(reg.test(keyword)){
				result.push(ele);
			}
		});
		return result;
	},
	//统计当前选中文件数量
	checkedCount:function(){
		var num  = 0;
		_globalVar.files.forEach(function(ele){
			if(ele.checked) num++;
		});
		return num;
	},
	createFolder:function(){
		//判断创建文件夹目录 只可在微云目录下创建
		if(_globalVar.path[0].name !== '微云'){
			var allBtn = document.querySelector('.g-side .u-sall a');
			allBtn.click();
		}
		var data = {
		    name: "",
		    type: "folder",
		    _id: "_id" + Math.random(),
		    icon: "folder",
		    time: +new Date(),
		    child: []
		};
		if(_globalVar.viewRule === 'thumbnail'){
			var foldersCont = document.querySelector('.m-mfolders');
			var folder = foldersCont.querySelectorAll('.u-mfolder');
			var obj = new Folder(data);
			//将元素绑定到obj上
			var ele = obj.ele = obj.render(foldersCont);
		}else{
			var foldersCont = document.querySelector('.m-listfolders');
			var folder = foldersCont.querySelectorAll('.u-list');
			var obj = new Folder(data);
			//将元素绑定到obj上
			var ele = obj.ele = obj.render2(foldersCont);
		}
		
		foldersCont.insertBefore(ele,folder[0]);
		//激活改名
		obj.reName();
		var input = ele.getElementsByTagName('input')[0];
		//由于改名中用了相同事件，此注册防止冲突 未命名删除，命名保存，渲染当前层级
		input.addEventListener('blur',function(){
			if(!obj.data.name){
				foldersCont.removeChild(ele);
				_globalFn.notification('文件创建失败！',false);
			}else{
				var path = _globalVar.path[_globalVar.path.length-1].child;
				path.unshift(obj.data);
				mainMod(path);
				_globalFn.notification('文件夹创建成功！',true);
			}
		})
	},
	//删除所有选中文件
	deleteAllChecked:function(){
		for(var i=0; i<_globalVar.files.length; i++){
			if(_globalVar.files[i].checked){
				_globalVar.files[i].delete();
				i--;
			}		
		}
		//头部重设为默认 全选按钮清除
		_globalFn.headStatus(true);
		_globalFn.checkedAll(false);
		_globalFn.notification('文件删除成功！',true);
	},
	//回收站选中文件操作 modSel true为还原 false为永久删除
	recycleBinAllCheckedMod:function(modSel){
		for(var i=0; i<_globalVar.files.length; i++){
			if(_globalVar.files[i].checked){
				
				fn(_globalVar.files[i],modSel);
				i--;
			}		
		}
		//头部重设为默认 全选按钮清除
		_globalFn.headStatus(true);
		_globalFn.checkedAll(false);
		if(modSel){
			_globalFn.notification('文件恢复成功！',true);
		}else{
			_globalFn.notification('永久删除成功！',true);
		}
		
		function fn(currentData,modSel){
			var ele = currentData.ele;
			var data = currentData.data;
			var parent = ele.parentNode;

			parent.removeChild(ele);
			//数据恢复
			if(modSel){
				var parent = data.dataParent;
				delete data.dataParent;
				parent.push(data);
			}
			//删除回收站数据
			for(var i=0; i<_globalVar.recycleBin.length; i++){
				if(_globalVar.recycleBin[i] === data){
					_globalVar.recycleBin.splice(i,1);
				}
			}
			//同步文件全局变量
			_globalVar.files.forEach(function(ele,index){
				if(ele === currentData){
					_globalVar.files.splice(index,1);
				}
			});
		}
	},
	//全选按钮实现，_syncSwitch:true同步所有文件，false不同步。modify 修正所有文件选中状态，ture 为选中，false 为不选中。
	checkedAll:function(_syncSwitch,modify){
		var btn = document.querySelector('.m-mainbar .u-checkbox i');
		if (_syncSwitch) {
			//通过参数判断 所有文件同步需同步状态
			if(modify === true){
				btn.checked = true;
			}else if(modify === false){
				btn.checked = false;
			}else{
				btn.checked = !btn.checked;
			}
			//所有文件同步全选按钮状态
			_globalVar.files.forEach(function(ele){
				if(ele.checked !== btn.checked) ele.check();
			});
		}
		//根据全局选中数量，判断全选按钮状态
		var num = _globalFn.checkedCount();
		//num为0发生在全选后进入下一层，由于文件对象没生成，会误判全选激活。需用&&。
		if(num&&num === _globalVar.files.length){
			btn.className += ' f-active';
			btn.checked = true;
		}else{
			btn.className = 's-spritem';
			btn.checked = false;
		}
	},
	//下载所有选中文件
	downloadAllChecked:function(){
		//储存下载文件ID
		var checkedArr = [];
		if(_globalFn.checkedCount() === 1){
			for(var i=0; i<_globalVar.files.length; i++){
				if(_globalVar.files[i].checked){
					_globalVar.files[i].download();
				}		
			}
		}else{
			for(var i=0; i<_globalVar.files.length; i++){
				if(_globalVar.files[i].checked){
					checkedArr.push(_globalVar.files[i].id);
				}
			}

			_globalFn.notification('文件准备中！',true);
			//模拟数据
			setTimeout(function(){
				var href = window.location.href;
				//文件夹的情况下不存在data.fileExt，做压缩包下载
				var newRplace = 'resources/'+'package.zip';
				var url = href.replace('index.html',newRplace);
				window.open(url,'_blank');
			},1000)
		}

		_globalVar.files[0].closeMenu();
		_globalFn.checkedAll(true,false);
	},
	//点击移动选中文件至指定文件夹 currentObj
	moveAllChecked:function(ev){
		var gMain = document.getElementsByClassName('g-main')[0];
		var parentPos = gMain.getBoundingClientRect();
		var div = document.createElement('div');

		div.innerHTML = '<span>'+_globalFn.checkedCount()+'</span>';
		div.className = 'm-filemovedot';
		var divPosLeft = ev.clientX - parentPos.left,
			divPosTop = ev.clientY - parentPos.top;
		gMain.appendChild(div);
		div.style.top =divPosTop+10+'px';
		div.style.left = divPosLeft+10+'px';

		document.onmousemove = function(ev){
			divPosLeft = ev.clientX - parentPos.left;
			divPosTop = ev.clientY - parentPos.top;
			div.style.top =divPosTop+10+'px';
			div.style.left = divPosLeft+10+'px';

			return false;
		};

		document.onmouseup = function(ev){
			var collCount = null;
			var orginNum = _globalVar.files.length;
			var coll = {};
			coll.x = ev.clientX;
			coll.y = ev.clientY;
			//碰撞检测
			_globalVar.files.forEach(function(ele){
				if(ele.collDetect(false,coll)){
					//如果碰撞非文件夹元素 跳出。选中文件移动到选中文件夹上 跳出。
					if(!ele.data.child||ele.checked) return collCount++;
					//如果碰上，获取选中数据
					_globalVar.files.forEach(function(ele2){
						if(ele2.checked){
							ele2.moveTo(ele.data.child);
						}
					});
					_globalFn.notification('文件移动成功',true);
					mainMod(_globalVar.path[_globalVar.path.length-1].child);
				}else{
					collCount++;
				}
			});
			if(collCount === orginNum){
				_globalFn.notification('文件移动失败！',false);
			}
			gMain.removeChild(div);
			document.onmousemove = '';
			document.onmouseup = '';
		}

	},
	//文件路径生成 container为路径元素，data为数据
	syncPath:function(container){
		container.innerHTML = '';
		_globalVar.path.forEach(function(ele,index){
			var li = document.createElement('li');
			var name;

			if(index === (_globalVar.path.length-1)){
				li.className = 's-unclick';
			}else{
				li.className = 's-enclick';
			}
			//搜索结果提示
			if(ele.searchResult){
				name = ele.searchResult;
			}else{
				name = ele.name;
			}

			li.innerHTML = (index?'<i class="s-spritem"></i>':'')
							+'<a href="javascript:;">'
							+name+'</a>';
							
			li._id = index;
			container.appendChild(li);

			//解决与选框的事件冲突
			li.onmousedown = function(ev){
				ev.cancelBubble = true;
			}
		})
	},
	//框选功能
	selectRect:function(ev){
		var parent = document.getElementsByClassName('g-main')[0];
		var parentPos = parent.getBoundingClientRect();
		var div = document.createElement('div');
		var flag = true;
		var maxWidth = window.innerWidth-ev.clientX-3;
		var maxHeight = window.innerHeight-ev.clientY-3;
		//初始点击在parent中坐标
		var divPosLeft = ev.clientX - parentPos.left,
			divPosTop = ev.clientY - parentPos.top;

		div.className = 'm-selectRect';
		div.style.display = 'none';
		parent.appendChild(div);

		document.onmousemove = function(ev){
			var width = ev.clientX-divPosLeft-parentPos.left;
			var height = ev.clientY-divPosTop-parentPos.top;
			//当宽高大于10 才显示 避免点击事件冲突
			if ((Math.abs(width)>10||Math.abs(height)>10)&&flag){
				div.style.display = '';
				flag = false;
			}
			//修正定位 小于0说明定位坐标改变
			if(width<0){
				div.style.left = divPosLeft+width+'px';
			}else{
				div.style.left = divPosLeft+'px';
				if(width>maxWidth) width=maxWidth;
			}
			if(height<0){
				div.style.top =divPosTop+height+'px';
			}else{
				div.style.top =divPosTop+'px';
				if(height>maxHeight) height=maxHeight;
			}
			div.style.width = Math.abs(width) + 'px';
			div.style.height = Math.abs(height) + 'px';

			//碰撞检测
			_globalVar.files.forEach(function(ele){
				if(ele.collDetect(true,div)){
					if(ele.checked)return;
					ele.check();
				}else{
					if(!ele.checked)return;
					ele.check();
				}
			});
			//全选检测 同步按钮状态
			_globalFn.checkedAll(false);

			return false;
		}

		document.onmouseup = function(){
			parent.removeChild(div);
			document.onmousemove = '';
			document.onmouseup = '';
		}
	},
	//content为通知内容，status控制颜色 ture成功，false失败。
	notification:function(content,status){
		var color = status?'#22B71F':'#E41F1F';
		var div = document.createElement('div');
		div.innerHTML = content;
		div.className = 'm-notification';
		div.style.background = color;
		document.body.appendChild(div);
		setTimeout(function(){
			div.style.top = '0px';
		},100);
		setTimeout(function(){
			div.style.top = '-30px';
		},2100);
		setTimeout(function(){
			document.body.removeChild(div);
		},3100);
		
	},
	//构造函数继承
	protoExtend:function(child,parent){
		var F = function(){};
		F.prototype = parent.prototype;
		child.prototype = new F();
		child.prototype.constructor = child;
		//为子对象设一个uber属性，等于在子对象上打开一条通道，可以直接调用父对象的方法,纯属备用性质。
		child.uber = parent.prototype;
	}

}
//文件夹构造函数 ！为保证独立性，内部只写死对全局变量和全局函数的调用，其他对象和元素需传参！
function Folder(data){
	this.data = data;
	this.ele = null;
	this.name = data.name;
	this.type = data.type;
	this.id = data._id;
	this.checked = false;
}
//单个文件夹渲染(缩略图式) folders 文件夹父容器
Folder.prototype.render = function(folders){
	var newFile = document.createElement('div');
	var data = this.data;

	newFile.className = 'u-mfolder';
	newFile.innerHTML = `
		<div class="u-wrap">
			<i class="s-spritem"></i>
			<span>${data.name}</span>
		</div>
		<i class="u-checkbox s-spritem"></i>
	`;
	folders.appendChild(newFile);

	return newFile;
};
//单个文件夹渲染（列表式） folders 文件夹父容器
Folder.prototype.render2 = function(folders){
	var newFile = document.createElement('li');
	var data = this.data;
	var format = this.format(data.time);

	newFile.className = 'u-list';
	newFile.innerHTML = `
		<div class="u-wrap">
			<i class="u-checkbox s-spritem"></i>
			<i class="u-icon s-spritem s-folder"></i>
			<span>${data.name}</span>
		</div>
		<div class="u-wrap2">
			<span class="u-modbtn">
				<a href="javascript:;" class="s-spritem s-share"></a>
				<a href="javascript:;" class="s-spritem s-download"></a>
				<a href="javascript:;" class="s-spritem s-move"></a>
				<a href="javascript:;" class="s-spritem s-delete"></a>
				<a href="javascript:;" class="s-spritem s-rename"></a>
			</span>
			<span class="u-modbtn" style="display:none">
				<a href="javascript:;" class="s-spritem s-undo"></a>
				<a href="javascript:;" class="s-spritem s-delpre"></a>
			</span>
			<span class="u-size"></span>
			<span class="u-time">${format.date}</span>
		</div>
	`;
	folders.appendChild(newFile);

	return newFile;
};
//格式化时间 date传入时间进行格式化，size 传入文件大小进行格式化
Folder.prototype.format = function(date,size){
	var result = {};
	var date = new Date(date);
	var year = date.getFullYear();
	var month = padding(date.getMonth()+1);
	var day = padding(date.getDay());
	var hour = padding(date.getHours());
	var sec = padding(date.getMinutes());
	
	result['date'] = year+'-'+month+'-'+day+' '+hour+':'+sec;

	function padding(date){
		return date<10?'0'+date:''+date;
	}

	if(size>0&&size<1024){
		result.size = size+'B';
	}else if(size>=1024&&size<1048576){
		result.size = (size/1024).toFixed(1)+'K';
	}else if(size>=1048576&&size<1073741824){
		result.size = (size/1048576).toFixed(1)+'M';
	}else if(size>=1073741824&&size<1099511627776){
		result.size = (size/1073741824).toFixed(1)+'G';
	}else if(size>=1099511627776&&size<1125899906842624){
		result.size = (size/1099511627776).toFixed(1)+'T';
	}

	return result;
}
//寻找data父级，用于删除功能 prevData传入根目录，从根目录开始找
Folder.prototype.queryPrevData = function(prevData){
	var currentData = this.data;
	var result = null;

	(function fn(prevData,currentData){
		//遍历查找父级数据
		for(var i=0;i<prevData.length;i++){
			//找到结果停止查找
			if(result) return;
			if(prevData[i] === currentData){
				//向外传递结果
				return result = {dataParent:prevData,index:i};
			}else{
				//有下一级就进入下一级找 递归
				if(prevData[i].child) {
					fn(prevData[i].child,currentData);
				}
			}
		}
	})(prevData,currentData)

	return result;
};
//单个文件选择
Folder.prototype.check = function(){
	var ele = this.ele;

	if(this.checked){
		ele.className = ele.className.split(' ')[0];
		_globalFn.headStatus(true);
	}else{
		ele.className += ' f-active';
		_globalFn.headStatus(false);
	}
	this.checked = !this.checked;
};
Folder.prototype.moveTo = function(moveToObj){
	var obj = this;
	var ele = this.ele;
	var data = this.data;
	var parentData = this.queryPrevData(initData);
	var deleteData = parentData.dataParent.splice(parentData.index,1);
	moveToObj.push(deleteData[0]);

}
//单个文件删除
Folder.prototype.delete = function(){
	var obj = this;
	var ele = this.ele;
	var data = this.data;
	var parent = ele.parentNode;

	parent.removeChild(ele);
	//同步文件总数据 先找到父级
	var dataPar = this.queryPrevData(initData);
	var deleteData = dataPar.dataParent.splice(dataPar.index,1);
	//删除结果数组中记录父级数据，回收站使用
	deleteData[0].dataParent=dataPar.dataParent;
	//同步文件全局变量
	_globalVar.files.forEach(function(ele,index){
		if(ele === obj){
			_globalVar.files.splice(index,1);
		}
	});
	return _globalVar.recycleBin.push(deleteData[0]);
};
//单个文件弹出菜单 ev为当前元素事件对象，用于阻止li事件冒泡至文件元素上。ele为大盒子，计算菜单呼出方向
Folder.prototype.openMenu = function(ev,box){
	var obj = this;
	var ele = this.ele;

	//如果点击的是未激活 激活checked
	if(!this.checked){
		//清除其他选中
		_globalFn.checkedAll(true,false);
		this.check();
	}

	//生成菜单&事件绑定
	var div = document.createElement('div');
	div.className = 'm-mmenu';
	var position = ele.getBoundingClientRect();
	var position2 = box.getBoundingClientRect();
	div.style.top = ev.clientY-position.top +'px';
	div.style.left = ev.clientX-position.left +'px';
	//呼出菜单位置修正
	if(box.offsetHeight-(ev.clientY-position2.top)<220){
		div.style.top = ev.clientY-position.top-220 +'px';
	}
	if(box.offsetWidth-(ev.clientX-position2.left)<160){
		div.style.left = ev.clientX-position.left-160 +'px';
	}

	//判断菜单来源 生成对应菜单
	if(_globalVar.path[0].name !== '回收站'){
		div.innerHTML = '<ul><li>下载</li><li>分享</li><li>删除</li><li>移动到</li>'
		+(_globalFn.checkedCount()===1?('<li>重命名</li>'+(this.type==='folder'?'':'<li>分享二维码</li>')):'')
		+'</ul>';
	}else{
		div.innerHTML = '<ul><li>还原</li><li>永久删除</li></ul>';
	}	
	//菜单事件绑定 公共
	var lis = div.getElementsByTagName('li');
	//防止和文件点击冲突
	div.onclick = function(ev){
		ev.cancelBubble = true;
	};
	//防止和文件拖动冲突，阻止默认选中事件
	div.onmousedown = function(ev){
		ev.cancelBubble = true;
		return false;
	}

	//菜单事件绑定 独立
	if(_globalVar.path[0].name !== '回收站'){
		//下载按钮
		lis[0].onclick = function(ev){
			_globalFn.downloadAllChecked();
		}
		//分享按钮
		lis[1].onclick = function(ev){
			_globalFn.notification('功能开发中，敬请期待！',false);
		}
		//删除按钮
		lis[2].onclick = function(){
			_globalFn.deleteAllChecked();
		};
		//移动到按钮
		lis[3].onclick = function(ev){
			_globalFn.notification('功能开发中，敬请期待！',false);
		}
		//如果有重命名按钮，就绑定事件
		if(lis[4]){
			lis[4].onclick = function(){
				obj.reName(_globalFn.notification);
			};
		}
		//分享二维码按钮
		if(lis[5]){
			lis[5].onclick = function(){
				_globalFn.notification('功能开发中，敬请期待！',false);
			};
		}
	}else{
		//还原
		lis[0].onclick = function(){
			_globalFn.recycleBinAllCheckedMod(true);
		}
		//永久删除
		lis[1].onclick = function(){
			_globalFn.recycleBinAllCheckedMod(false);
		}
	}

	ele.appendChild(div);

	//菜单显示动画效果
	var divHeight = lis.length*34+16;
	div.style.height = divHeight/2 +'px';
	setTimeout(function(){div.style.height = lis.length*34+16+'px';},30)

	return _globalVar.fileMenu = div;
};
//关闭菜单 （需查找上一打开菜单的元素） ev为当前元素事件对象，用于判断当前点击的是否为checkbox
Folder.prototype.closeMenu = function(){
	if(!_globalVar.fileMenu) return;
	var parent = _globalVar.fileMenu.parentNode;
	//删除上一个菜单
	parent.removeChild(_globalVar.fileMenu);

	return _globalVar.fileMenu = null;
}
//碰撞检测  flag为标记符，true为检测元素碰撞 false为检测坐标碰撞
Folder.prototype.collDetect = function(flag,coll){
	var elePos = this.ele.getBoundingClientRect();

	if(flag){
		var collElePos = coll.getBoundingClientRect();

		if(elePos.top>collElePos.bottom ||elePos.bottom<collElePos.top||elePos.left>collElePos.right||elePos.right<collElePos.left){
			return false;
		}else{
			return true;
		}
	}else{
		if(elePos.top>coll.y ||elePos.bottom<coll.y ||elePos.left>coll.x ||elePos.right<coll.x){
			return false;
		}else{
			return true;
		}
	}
}
Folder.prototype.reName = function(callback){
	var obj = this;
	var ele = this.ele;
	var data = this.data;
	var span = ele.getElementsByTagName('span')[0];
	var input = document.createElement('input');
	var wrap = ele.getElementsByClassName('u-wrap')[0];
	
	span.style.display = 'none';
	input.value = data.name;
	wrap.appendChild(input);
	obj.closeMenu();
	input.focus();
	//聚焦指定文本
	input.select();
	
	//取消点击事件冒泡，防止触发文件夹点击进入下一级。
	input.onclick = function(ev){
		ev.cancelBubble = true;
	}
	//失去焦点判定是否储存结果 status记录重命名状态返回结果,onOff用来防止blur与keyup事件冲突
	var status = false;
	var notification = '';
	var onOff = true;

	input.onblur = function(callback){
		return function(){
			//开关为关，或者input不存在就跳出
			if (!onOff||!input)return;
			onOff = false;
			//显示名字
			if(input.value&&input.value !== span.innerHTML){
				span.innerHTML = input.value;
				//同步数据
				data.name = input.value;
				status = true;
				notification = '文件夹重命名成功！';
			}else{
				notification = '文件夹重命名失败！';
			}
			
			wrap.removeChild(input);
			span.style.display = '';

			onOff = true;
			callback&&callback(notification,status);
		};
	}(callback);

	input.onkeyup = function(ev){
		if(ev.keyCode === 13) input.onblur(callback);
	};
}
Folder.prototype.download = function(){
	var data = this.data;
	var href = window.location.href;
	//文件夹的情况下不存在data.fileExt，做压缩包下载
	var newRplace = 'resources/'+data._id+'.'+(data.fileExt?data.fileExt:'rar');
	var url = href.replace('index.html',newRplace);
	window.open(url,'_blank');
}

//文件构造函数
function File(data){
	this.data = data;
	this.ele = null;
	this.name = data.name;
	this.type = data.type;
	this.id = data._id;
	this.size = data.size;
	this.checked = false;
}
//复制Folder原型
_globalFn.protoExtend(File,Folder);
//单个文件渲染 files 文件父容器
File.prototype.render = function(files){
	var newFile = document.createElement('div');
	var data = this.data;

	newFile.className = 'u-mfile';
	//隐藏后缀
	var name = data.name.substring(0,data.name.lastIndexOf('.'));
	newFile.innerHTML = `
		<div class="u-wrap">
			<i class="s-spritem ${'s-'+data.icon}"></i>
		</div>
		<p class="u-tit">
			<i class="s-spritem ${'s-'+data.icon}"></i>
			<span>${name}</span>
		</p>
		<i class="u-checkbox s-spritem"></i>
	`;
	files.appendChild(newFile);

	return newFile;
};
//单个文件渲染（列表式） files 文件夹父容器
File.prototype.render2 = function(files){
	var newFile = document.createElement('li');
	var data = this.data;
	var format = this.format(data.time,data.size);
	var name = data.name.substring(0,data.name.lastIndexOf('.'));
	var icon = 's-'+data.icon;

	newFile.className = 'u-list';
	newFile.innerHTML = `
		<div class="u-wrap u-tit">
			<i class="u-checkbox s-spritem"></i>
			<i class="u-icon s-spritem ${icon}"></i>
			<span>${name}</span>
		</div>
		<div class="u-wrap2">
			<span class="u-modbtn">
				<a href="javascript:;" class="s-spritem s-share"></a>
				<a href="javascript:;" class="s-spritem s-download"></a>
				<a href="javascript:;" class="s-spritem s-move"></a>
				<a href="javascript:;" class="s-spritem s-delete"></a>
				<a href="javascript:;" class="s-spritem s-rename"></a>
				<a href="javascript:;" class="s-spritem s-qrcode"></a>
			</span>
			<span class="u-modbtn" style="display:none">
				<a href="javascript:;" class="s-spritem s-undo"></a>
				<a href="javascript:;" class="s-spritem s-delpre"></a>
			</span>
			<span class="u-size">${format.size}</span>
			<span class="u-time">${format.date}</span>
		</div>
	`;
	files.appendChild(newFile);

	return newFile;
};
//单个文件重命名
File.prototype.reName = function(callback){
	var obj = this;
	var ele = this.ele;
	var data = this.data;
	var span = ele.querySelector('.u-tit span');
	var input = document.createElement('input');
	var wrap = ele.getElementsByClassName('u-tit')[0];
	
	span.style.display = 'none';
	input.value = data.name;
	wrap.appendChild(input);
	obj.closeMenu();
	input.focus();
	//聚焦指定文本
	input.setSelectionRange(0,input.value.lastIndexOf('.'));

	//取消点击事件冒泡，防止触发文件夹点击进入下一级。
	input.onclick = function(ev){
		ev.cancelBubble = true;
	}
	//失去焦点判定是否储存结果 status记录重命名状态返回结果,onOff用来防止blur与keyup事件冲突
	var status = false;
	var notification = '';
	var onOff = true;

	input.onblur = function(callback){
		return function(){
			//开关为关，或者input不存在就跳出
			if (!onOff||!input)return;
			onOff = false;
			//显示名字
			var fileName = input.value.substring(0,input.value.lastIndexOf('.'));
			if(fileName&&fileName !== span.innerHTML){
				span.innerHTML = fileName;
				//同步数据
				data.name = input.value;
				status = true;
				notification = '文件重命名成功！';
			}else{
				notification = '文件重命名失败！';
			}
			wrap.removeChild(input);
			span.style.display = '';

			onOff = true;
			callback&&callback(notification,status);
		};
	}(callback);

	input.onkeyup = function(ev){
		if(ev.keyCode === 13) input.onblur(callback);
	};
}

//内容主体控制函数
function mainMod(data){
	var gMain = document.getElementsByClassName('g-main')[0];
	var mBar = document.getElementsByClassName('m-mainbar')[0];
	var mContent = document.querySelector('.m-mcontent');
	var allCheckBox = mBar.querySelector('.u-checkbox i');
	var pathEle = document.getElementsByClassName('u-navbar')[0];
	var pathas = pathEle.getElementsByTagName('a');

	//排序中间件
	var data = _globalFn.sortMiddleware(data);

	//清除默认数据
	_globalVar.files = [];
	_globalFn.headStatus(true);
	_globalFn.checkedAll(false);
	//全选按钮 功能
	allCheckBox.checked = false;
	allCheckBox.onclick = function(){
		_globalFn.checkedAll(true);
	}
	//解决与选框的事件冲突
	allCheckBox.onmousedown = function(ev){
		ev.cancelBubble = true;
	}

	//初始化路径
	_globalFn.syncPath(pathEle);
	//点击修改
	pathEle.onclick = function(ev){
		
		if(ev.target.nodeName !== 'A')return;
		var parent = ev.target.parentNode;
		if(/s-enclick/.test(parent.className)){
			var id = parent._id;
			_globalVar.path.splice(id+1);
			_globalFn.syncPath(pathEle);
			mainMod(_globalVar.path[id].child);
		}
	}

	//绑定框选功能
	gMain.onmousedown = _globalFn.selectRect;

	//点击任何位置清除菜单
	document.onclick = function(ev){
		if(!_globalVar.files[0])return;
		_globalVar.files[0].closeMenu();
	}
	gMain.addEventListener('mousedown',function(ev){
		if(!_globalVar.files[0])return;
		_globalVar.files[0].closeMenu();
		_globalFn.checkedAll(true,false);
	})

	//阻止默认右键
	document.oncontextmenu = function(ev){
		ev.preventDefault()
	}
	
	//写入文件与文件夹容器
	if(_globalVar.viewRule === 'thumbnail'){
		mContent.innerHTML = `
		<div class="m-mfolders clearfix">
		</div>
		<div class="m-mfiles clearfix">
		</div>
		`;
		var thumFolders = document.querySelector('.m-mfolders');
		var thumFiles = document.querySelector('.m-mfiles');
	}else{
		mContent.innerHTML = `
		<ul class="m-listcont m-listfolders">
		</ul>
		<ul class="m-listcont m-listfiles">
		</ul>
		`;
		var listFolders = document.querySelector('.m-listfolders');
		var listFiles = document.querySelector('.m-listfiles');
	}
	

	//遍历数据生成结构
	data.forEach(function(data){
		if(_globalVar.viewRule === 'thumbnail'){
			thumbnail(data);
		}else{
			list(data);
		}
	});

	//缩略图模式 生成及事件绑定
	function thumbnail(data){
		if(data.type === 'folder'){
			var obj = new Folder(data);
			//将元素绑定到obj上
			var ele = obj.ele = obj.render(thumFolders);
		}else{
			var obj = new File(data);
			var ele = obj.ele = obj.render(thumFiles);
		}
		var checkbox = ele.querySelector('.u-checkbox');
 
		//选择文件夹事件
		checkbox.onclick = function(){
			obj.check();
			_globalFn.checkedAll(false);
		};
		//阻止与文件移动事件冲突
		checkbox.onmousedown = function(ev){
			ev.cancelBubble = true;
		};
		//进入下一级目录事件
		ele.onclick = function(ev){
			obj.closeMenu();
			//阻止点击checkbox&非文件夹&回收站下 进入下一级
			if(/u-checkbox/.test(ev.target.className)||!data.child||_globalVar.path[0].name === '回收站')return;
			//记录路径和渲染
			_globalVar.path.push(data);
			mainMod(data.child);
			//阻止document点击冲突
			ev.cancelBubble = true;
		};
		//拖动移入文件夹
		ele.onmousedown = function(ev){
			//解决与选框的事件&菜单呼出清空checked冲突
			ev.cancelBubble = true;

			var originX = ev.clientX;
			var originY = ev.clientY;
			var originBtn = ev.button;
			var flag= true;

			document.onmousemove = function(ev){
				//监控移动距离 坐标大于10px才触发移动事件 解决勾选后点击的冲突
				if (!flag||ev.clientX-originX<10||ev.clientY-originY<10)return;
				flag = false;

				//未选中&非全部文件选项卡中&点击鼠标右键 不触发
				if(!(_globalVar.path[0].name === '微云')||originBtn === 2||originBtn === 3) return;
				if(!obj.checked) obj.check();
				_globalFn.moveAllChecked(ev,obj);
				//document.onmousemove 一旦激活会被moveAllChecked中的事件覆盖，不用清理
			}
			//如果移距离过小未激活moveAllChecked 需再此清理监控
			document.onmouseup = function(){
				document.onmousemove = null;
			}

			return false;
			
		};
		//激活菜单
		ele.oncontextmenu = function(ev){
			obj.closeMenu();
			obj.openMenu(ev,gMain);

			return false;
		}

		return _globalVar.files.push(obj);
	}

	//列表模式 生成及事件绑定
	function list(data){
		if(data.type === 'folder'){
			var obj = new Folder(data);
			//将元素绑定到obj上
			var ele = obj.ele = obj.render2(listFolders);
		}else{
			var obj = new File(data);
			var ele = obj.ele = obj.render2(listFiles);
		}
		var wrap = ele.querySelector('.u-wrap');
		var icon = wrap.querySelector('.u-icon');
		var span = wrap.querySelector('span');
		var checkbox = ele.querySelector('.u-checkbox');
		var modBtnBox = ele.querySelectorAll('.u-modbtn');
		var modBtns = ele.querySelectorAll('.u-wrap2 a');

		if(_globalVar.path[0].name === '回收站'){
			modBtnBox[0].style.display = 'none';
			modBtnBox[1].style.display = '';
		}
		//阻止与文件点击 文件移动 事件冲突
		for(var i=0; i<modBtnBox.length; i++){
			modBtnBox[i].onclick = function(ev){
				ev.cancelBubble = true;
			}
			modBtnBox[i].onmousedown = function(ev){
				ev.cancelBubble = true;
			}
		}
 
		//选择文件夹事件
		checkbox.onclick = function(){
			obj.check();
			_globalFn.checkedAll(false);
		};
		//阻止与文件移动事件冲突
		checkbox.onmousedown = function(ev){
			ev.cancelBubble = true;
		};
		//进入下一级目录事件
		ele.onclick = function(ev){
			obj.closeMenu();
			//阻止点击checkbox&非文件夹&回收站下 进入下一级
			if(/u-checkbox/.test(ev.target.className)||!data.child||_globalVar.path[0].name === '回收站')return;
			//记录路径和渲染
			_globalVar.path.push(data);
			mainMod(data.child);
			//阻止document点击冲突
			ev.cancelBubble = true;
		};
		//解决与选框的事件&菜单呼出清空checked冲突
		ele.onmousedown = function(ev){
			ev.cancelBubble = true;

			var originBtn = ev.button;
			//内部调用选框
			if(originBtn !== 2&&originBtn !== 3){
				_globalFn.selectRect(ev);
			}
			return false;
		}
		//拖动移入文件夹
		span.onmousedown = icon.onmousedown = function(ev){
			//解决与选框的事件冲突
			ev.cancelBubble = true;
			var originX = ev.clientX;
			var originY = ev.clientY;
			var originBtn = ev.button;
			var flag= true;

			document.onmousemove = function(ev){
				//监控移动距离 坐标大于10px才触发移动事件 解决勾选后点击的冲突
				if (!flag||ev.clientX-originX<10||ev.clientY-originY<10)return;
				flag = false;

				//未选中&非全部文件选项卡中&点击鼠标右键 不触发
				if(!(_globalVar.path[0].name === '微云')||originBtn === 2||originBtn === 3) return;
				if(!obj.checked) obj.check();
				_globalFn.moveAllChecked(ev,obj);
				//document.onmousemove 一旦激活会被moveAllChecked中的事件覆盖，不用清理
			}
			//如果移距离过小未激活moveAllChecked 需再此清理监控
			document.onmouseup = function(){
				document.onmousemove = null;
			}

			return false;
		};
		//激活菜单
		ele.oncontextmenu = function(ev){
			obj.closeMenu();
			obj.openMenu(ev,gMain);

			return false;
		}
		//功能绑定
		for(var i=0; i<modBtns.length; i++){
			var flag = modBtns[i].className.split(' ')[1];
			switch(flag){
				case 's-share':
					modBtns[i].onclick = function(ev){
						_globalFn.notification('功能开发中，敬请期待！',false);
					};
				break;
				case 's-download':
					modBtns[i].onclick = function(ev){
						obj.download();
					};
				break;
				case 's-move':
					modBtns[i].onclick = function(ev){
						_globalFn.notification('功能开发中，敬请期待！',false);
					};
				break;
				case 's-delete':
					modBtns[i].onclick = function(ev){
						_globalFn.headStatus(true);
						obj.delete();
						_globalFn.checkedAll(false);
						_globalFn.notification('文件删除成功！',true);
					};
				break;
				case 's-rename':
					modBtns[i].onclick = function(ev){
						obj.reName(_globalFn.notification);
					};
				break;
				case 's-qrcode':
					modBtns[i].onclick = function(ev){
						_globalFn.notification('功能开发中，敬请期待！',false);
					};
				break;
				case 's-undo':
					modBtns[i].onclick = function(ev){
						obj.check();
						_globalFn.recycleBinAllCheckedMod(true);
					};
				break;
				case 's-delpre':
					modBtns[i].onclick = function(ev){
						obj.check();
						_globalFn.recycleBinAllCheckedMod(false);
					};
				break;

			}
		}

		return _globalVar.files.push(obj);
	}
}

//文件操作顶部控制函数
function modHeadFn(){
	var ghead = document.querySelector('.g-hmod');
	var cancelSelBtn = ghead.querySelector('.m-select');
	var deleteBtn = ghead.querySelector('.m-filefn .u-delete');
	var renameBtn = ghead.querySelector('.m-filefn .u-rename');
	var downloadBtn = ghead.querySelector('.m-filefn .u-download');
	var restoreBtn = ghead.querySelector('.m-filefn .u-restore');
	var deletePremBtn = ghead.querySelector('.m-filefn .u-deletePrem');
	var shareBtn = ghead.querySelector('.m-filefn .u-share');
	var moveBtn = ghead.querySelector('.m-filefn .u-move');

	
	//取消选中功能
	cancelSelBtn.onclick = function(){
		_globalFn.checkedAll(true,false);
	};
	//下载功能
	downloadBtn.onclick = function(){
		_globalFn.downloadAllChecked();
	};
	//分享功能
	shareBtn.onclick = function(){
		_globalFn.notification('功能开发中，敬请期待！',false);
	};
	//移动到功能
	moveBtn.onclick = function(){
		_globalFn.notification('功能开发中，敬请期待！',false);
	};
	//重命名功能
	renameBtn.onclick = function(){
		if(_globalFn.checkedCount() !== 1) return _globalFn.notification('不可对多个文件重命名！',false);

		for(var i=0; i<_globalVar.files.length; i++){
			if(_globalVar.files[i].checked){
				_globalVar.files[i].reName(_globalFn.notification);
				return;
			}
		}
	};
	//删除功能
	deleteBtn.onclick = function(){
		_globalFn.deleteAllChecked();
	};
	//还原按钮
	restoreBtn.onclick = function(){
		_globalFn.recycleBinAllCheckedMod(true);
	};
	//永久删除按钮
	deletePremBtn.onclick = function(){
		_globalFn.recycleBinAllCheckedMod(false);
	};

}
modHeadFn();

//默认顶部控制函数
function defaultHeadFn(){
	var addBtn = document.querySelector('.m-add');
	var floatLayer = document.querySelector('.m-add .u-layer');
	var floatLayerLis = floatLayer.getElementsByTagName('li');
	var mActCol = document.getElementsByClassName('m-actcol')[0];
	var sortBtns = mActCol.querySelectorAll('.u-sort span');
	var viewBtns = mActCol.querySelectorAll('.u-view span');
	var searchBox = document.getElementsByClassName('m-search')[0];
	var searchInput = searchBox.getElementsByClassName('u-seinp')[0];
	var searchBtn = searchBox.getElementsByClassName('u-seclose')[0];
	var uploadBtn = document.getElementsByClassName('m-upload')[0];
	//上传按钮
	uploadBtn.onclick = function(){
		_globalFn.notification('功能开发中，敬请期待！',false);
	}
	//搜索框
	searchBox.onclick = function(){
		mActCol.style.display = 'none';
		searchBox.className += ' f-active';
		searchBox.style.width = '180px';
		searchInput.style.width = '140px';
		searchBtn.style.display = 'block';
		searchInput.focus();
	}
	function closeSearchBox(){
		searchInput.value = '';
		searchBox.className = 'm-search';
		searchBox.style.width = '';
		searchInput.style.width = '';
		searchBtn.style.display = '';
	}
	searchBtn.onclick = function(ev){
		var path = _globalVar.path[_globalVar.path.length-1];
		closeSearchBox();
		path.searchResult = null;
		mActCol.style.display = 'block';
		mainMod(path.child);

		ev.cancelBubble = true;
	}
	searchInput.onblur = function(){
		if(!searchInput.value) {
			closeSearchBox();
			mActCol.style.display = 'block';
		}
	}
	searchInput.onkeyup = function(){
		var data;
		var path = _globalVar.path[_globalVar.path.length-1];
		if(!searchInput.value) {
			data = path.child;
			path.searchResult = null;
		}else{
			data = _globalFn.searchFile(initData,searchInput.value.toLowerCase());
			path.searchResult = '搜索到 '+data.length+' 个结果';
		}
		
		mainMod(data);
	};

	//视图按钮
	viewBtns[0].onclick = function(){
		if(_globalVar.viewRule === 'list') return;
		_globalVar.viewRule = 'list';
		viewBtns[0].className += ' f-active';
		viewBtns[1].className = 'u-viewthum';
		mainMod(_globalVar.path[_globalVar.path.length-1].child);
	};
	viewBtns[1].onclick = function(){
		if(_globalVar.viewRule === 'thumbnail') return;
		_globalVar.viewRule = 'thumbnail';
		viewBtns[0].className = 'u-viewlist';
		viewBtns[1].className += ' f-active';
		mainMod(_globalVar.path[_globalVar.path.length-1].child);
	};
	
	//排序按钮
	sortBtns[0].onclick = function(){
		if(_globalVar.sortRule === '时间') return;
		_globalVar.sortRule = '时间';
		sortBtns[0].className += ' f-active';
		sortBtns[1].className = 'u-sortalph';
		mainMod(_globalVar.path[_globalVar.path.length-1].child);
	};
	sortBtns[1].onclick = function(){
		if(_globalVar.sortRule === '首字母') return;
		_globalVar.sortRule = '首字母';
		sortBtns[0].className = 'u-sorttime';
		sortBtns[1].className += ' f-active';
		mainMod(_globalVar.path[_globalVar.path.length-1].child);
	};

	//控制浮层动画
	addBtn.onmouseenter = function(){
		floatLayer.style.display = 'block';
		setTimeout(function(){floatLayer.style.top = '60px';floatLayer.style.opacity = '1';},30);
	};
	addBtn.onmouseleave = function(){
		floatLayer.style.top = '50px';
		floatLayer.style.opacity = '';
		setTimeout(function(){floatLayer.style.display = '';},200);
	};
	//浮层其他按钮功能
	for(var i=0; i<floatLayerLis.length; i++){
		floatLayerLis[i].onclick = function(){
			_globalFn.notification('功能开发中，敬请期待！',false);
		}
	}
	//创建文件夹绑定
	floatLayerLis[3].onclick = _globalFn.createFolder;

}
defaultHeadFn();

//侧边栏控制函数
function sideFn(){
	var gSide = document.getElementsByClassName('g-side')[0];
	var lis = gSide.getElementsByTagName('li');
	var lastBtn = null;
	var allBtn = gSide.querySelector('.u-sall a');

	for(var i=0;i<lis.length;i++){
		var span = lis[i].querySelector('span');
		var a = lis[i].querySelector('a');

		switch(span.innerHTML){
			case '最近':
				a.onclick = function(){
					var data = _globalFn.pickFileType(initData);
					data.sort(function(a,b){
						return b.time - a.time;
					})
					_globalVar.path=[{name:'最近上传',child:data}];
					publicOp(this,data);
				}
			break;
			case '全部':
				a.onclick = function(){
					_globalVar.path=[{name:'微云',child:initData}];
					publicOp(this,initData);
				}
			break;
			case '文档':
				a.onclick = function(){
					var data = _globalFn.pickFileType(initData,'document');
					_globalVar.path=[{name:'我的文档',child:data}];
					publicOp(this,data);
				}
			break;
			case '图片':
				a.onclick = function(){
					var data = _globalFn.pickFileType(initData,'picture');
					_globalVar.path=[{name:'我的图片',child:data}];
					publicOp(this,data);
				}
			break;
			case '视频':
				a.onclick = function(){
					var data = _globalFn.pickFileType(initData,'video');
					_globalVar.path=[{name:'我的视频',child:data}];
					publicOp(this,data);
				}
			break;
			case '笔记':
				a.onclick = function(){
					var data = [];
					_globalVar.path=[{name:'我的笔记',child:data}];
					publicOp(this,data);
				}
			break;
			case '音乐':
				a.onclick = function(){
					var data = _globalFn.pickFileType(initData,'music');
					_globalVar.path=[{name:'我的音乐',child:data}];
					publicOp(this,data);
				}
			break;
			case '回收站':
				a.onclick = function(){
					_globalVar.path=[{name:'回收站',child:_globalVar.recycleBin}];
					publicOp(this,_globalVar.recycleBin);
				}
			break;
			//未激活按钮提示
			default:
				a.onclick = function(){
					_globalFn.notification('功能开发中，敬请期待！',false);
				}
			break;
		}
	}

	function publicOp(ele,data){
		if(lastBtn === ele) return;
		if(lastBtn) lastBtn.className = '';

		ele.className = 'f-active';
		mainMod(data);
		lastBtn = ele;
	}

	//初始化数据
	allBtn.click();

}
sideFn();