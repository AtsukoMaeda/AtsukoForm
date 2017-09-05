/*
表单验证
作者：邢鸿标
日期：2017-9-1
*/
(function(){
	var AtsukoForm=function(it,rule){
		return new AtsukoForm.fn.init(it,rule);
	};
	AtsukoForm.fn={
		arr:undefined,
		rule:undefined,
		back:[],
		flag:false,

		init:function(it,rule){
			var len=it.length,
			flag=it.slice(0,1),
			other=it.slice(1,len);
			if(flag==='#'){
				var a=document.getElementById(other);
				this.arr=this.getall(a);
			}else if(flag=='.'){
				var a=document.getElementsByClassName(other);
				this.arr=this.getall(a[0]);
			}else{
				var a=document.getElementsByTagName(it);
				this.arr=this.getall(a[0]);
			}
			var samefield=false;
			var add=[];
			rule=rule||[];
			for(k in rule){
				if(samefield&&(copyfield==rule[k]['field'])){
					var copy=JSON.parse(JSON.stringify(rule[k]));
					copy['field']=samefield;
					add.push(copy);
				}
				if(rule[k]['type']=='confirm'){
					var copyfield=rule[k]['field'];
					samefield=rule[k]['confirm'];
					var copy=JSON.parse(JSON.stringify(rule[k]));
					copy['field']=samefield;
					copy['confirm']=copyfield;
					add.push(copy);
				}
			}
			if(add.length!=0){
				for(k in add){
					rule.push(add[k]);
				}
			}		
			this.rule=rule;			
		},

		require:function(value){
			if(value==''){
				return false;
			}else{
				return true;
			}
		},

		preg:function(value,preg){
			var preg=eval(preg);
			return preg.test(value);
		},

		length:function(value,length){
			var len=value.length,
				lengtharr=length.split(",");
			if(lengtharr.length==1){
				if(len<=lengtharr[0]){
					return true;
				}else{
					return false;
				}
			}else if(lengtharr.length==2){
				if(len>=lengtharr[0]&&len<=lengtharr[1]){
					return true;
				}else{
					return false;
				}
			}			
		},

		email:function(value){
			var preg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			return preg.test(value);
		},

		phone:function(value){
			var preg=/^(13|14|15|17|18)\d{9}$/;
			return preg.test(value);
		},

		url:function(value){			
			var preg=/^((http(s?):\/\/)?)(?:[A-za-z0-9-]+\.)+[A-za-z]{2,4}(?:[\/\?#][\/=\?%\-&~`@[\]\':+!\.#\w]*)?$/;
			return preg.test(value);
		},

		confirm:function(value,confirm){
			for(confirmK in this.arr){
				for(confirmK1 in this.arr[confirmK]){
					if(this.arr[confirmK]['name']==confirm){
						var value2=this.arr[confirmK]['value'];
						break;
					}
				}
			}
			if(value==value2){
				return true;
			}else{
				return false;
			}
		},

		getall:function(a){
			var form=[],
			radio={},
			checkboxflag=true,
			check=false;
			for(var i=0;i<a.elements.length;i++){
				var field=a.elements[i],
					data={},
					checkbox={};
				if(field.type=="button"||field.type=="submit"||field.type=="reset"||field.type=="image"){
					continue;
				}
				if(field.type=="radio"||field.type=="checkbox"){
					if(field.type=="radio"){
						if(!field.checked&&!radio["name"]){
							radio["name"]=field.name;
							radio["value"]="";
						}else if(field.checked){
							radio["name"]=field.name;
							radio["value"]=field.value;
						}
					}else{
						check=true;
						if(!field.checked&&checkboxflag){
							checkbox["name"]=field.name;
							checkbox["value"]="";
							var hehe=checkbox;
						}else if(field.checked){
							checkbox["name"]=field.name;
							checkbox["value"]=field.value;
							checkboxflag=false;
							form.push(checkbox);
						}
					}
				}else{
					data['name']=field.name;
					data['value']=field.value;
					form.push(data);				
				}
			}
			if(checkboxflag&&check){
				form.push(hehe);
			}
			if(radio["name"]){
				form.push(radio);
			}
			return form;
		},

		int:function(value,flag,range){
			var f='/^\\d+(\\.\\d{1,'+flag+'})?$/';
			var preg=!flag?/^\d+$/:eval(f);
			if(preg.test(value)){
				if(range){
					if(/>/.test(range)){
						return value>=range.split('>')[1];
					}else if(/</.test(range)){
						return value<=range.split('<')[1];
					}else if(/,/.test(range)){
						return value>=range.split(',')[0]&&value<=range.split(',')[1];
					}
				}else{
					return true;
				}
			}else{
				return false;
			}
		},

		checkboxNu:function(name,nu1){
			var h=nu1.split(','),
				nu=0;
			for(checkboxNu in this.arr){
				if(this.arr[checkboxNu]['name']===name&&this.arr[checkboxNu]['value']!==""){
					nu++;
				}
			}
			if(h.length==1){
				if(nu>=h[0]){
					return true;
				}else{
					return false;
				}
			}else if(h.length==2){
				if(nu>=h[0]&&nu<=h[1]){
					return true;
				}else{
					return false;
				}
			}
		},

		autorule:function(arr,notice){
			if(arr){
				for(autoK in arr){
					var addrule={'field':'field','notice':'notice','type':'require'};
					addrule['field']=autoK;
					addrule['notice']=arr[autoK];
					this.rule.push(addrule);
				}
			}else{
				notice=notice||'此项必须填写';
				for(autoK in this.arr){
					var addrule={'field':'field','notice':notice,'type':'require'};
					if(!/\[\]/.test(this.arr[autoK]['name'])){
						addrule['field']=this.arr[autoK]['name'];
						this.rule.push(addrule);
					}
				}
			}
			return this;
		},

		check:function(){
			this.back=[];
			for(k in this.arr){
				for(k1 in this.rule){
					if(this.rule[k1]['field']==this.arr[k]['name']){
						var value=this.arr[k]['value'],
							name=this.rule[k1]['field'],
							type=this.rule[k1]['type'];
						switch(type){
							case 'require':
								var back=this.require(value);
							break;
							case 'preg':
								var preg=this.rule[k1]['preg'],
									back=this.preg(value,preg);
							break;
							case 'length':
								var length=this.rule[k1]['length'],
									back=this.length(value,length);
							break;
							case 'phone':
								var back=this.phone(value);
							break;
							case 'email':
								var back=this.email(value);
							break;
							case 'url':
								var back=this.url(value);
							break;
							case 'confirm':
								var  confirm=this.rule[k1]['confirm'],
									back=this.confirm(value,confirm);
							break;
							case 'checkboxNu':
								var  checkboxNu=this.rule[k1]['checkboxNu'];
									back=this.checkboxNu(name,checkboxNu);
							break;
							case 'int':
								var flag=this.rule[k1]['f']?this.rule[k1]['f']:false,
									range=this.rule[k1]['range']?this.rule[k1]['range']:false,
							   	   	back=this.int(value,flag,range);
							break;
						}
						if(!back){
							var notice=this.rule[k1]['notice'];
							this.flag=true;
							if(this.rule[k1]['oname']){
								this.back[this.rule[k1]['oname']]=notice;
							}else{
								this.back[name]=notice;
							}
							back=true;
						}
					}
				}
			}
			if(!this.flag){
				return true;
			}else{
				return this.back;
			}
		}
	},
	AtsukoForm.fn.init.prototype=AtsukoForm.fn;
	window.AtsukoForm=AtsukoForm;
})();