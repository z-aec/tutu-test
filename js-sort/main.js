jQuery(function($){
	var main = {
		count: 50,
		serverUrl: "http://www.filltext.com/",
		smallParams: {
			"rows": 32,
			"id" : "{number|1000}",
			"firstName" : "{firstName}",
			"lastName" : "{lastName}",
			"email" : "{email}",
			"phone" : "{phone|(xxx)xxx-xx-xx}",
			"adress" : "{addressObject}",
			"description" : "{lorem|32}",
		},
		bigParams: {
			"rows": 1000,
			"id" : "{number|1000}",
			"firstName" : "{firstName}",
			"delay" : 3,
			"lastName" : "{lastName}",
			"email" : "{email}",
			"phone" : "{phone|(xxx)xxx-xx-xx}",
			"adress" : "{addressObject}",
			"description" : "{lorem|32}",
		},
		data: null,
		names: [],
		orderBy: null,
		orderRev: 0,
		selector: null,
		init: function(selector){
			var self = this;
			this.selector = selector;
			selector.find('th').each(function(){
				self.names.push($(this).attr('data-name'));	
			});
			selector.find('th').click(function(){
				self.showLoader();
				var name = $(this).attr('data-name');
				var search = selector.find('.search-field').val();
				var data = search ? self.search(self.data, search) : self.data;
				if($(this).find('.asc').attr("class")){
					$(this).find('.sort').removeClass('asc').addClass('desc');
					self.out(self.order(data, name, 1), 1);
				}else{
					selector.find('th').find('.sort').removeClass('asc').removeClass('desc');
					$(this).find('.sort').addClass('asc');
					self.out(self.order(data, name), 1);
				}
			});
			selector.find('.load').click(function(){
				self.showLoader();
				var params = $(this).attr('data-load') + "Params";
				$.ajax({
					url: self.serverUrl,
					type: 'GET',
					data: self[params],
					dataType: "jsonp",
					success: function(r){
						r = r.map(function(elem, key){
							elem._id = key;
							return elem;
						});
						self.data = r;
						self.out(self.order(r, 'id'), 1);
					},
					error: function(){
						alert("Не удалось загрузить данные. Попробуйте повторить загрузку ещё раз");
						self.hideLoader();
					},
				});
			});
			selector.find('.search').submit(function(){
				var search = $(this).find('.search-field').val();
				var order = self.getOrder();
				self.out(self.order(self.search(self.data, search), order[0], order[1]), 1);
				return false;
			});
		},
		showLoader: function(){
			$('#loader').fadeIn();
		},
		hideLoader: function(){
			$('#loader').fadeOut();
		},
		out: function(data, page){
			var self = this;
			self.selector.find('.pages').html(self.outPages(self.pages(data), page));
			self.selector.find('.pages').find('.page').click(function(){
				self.showLoader();
				var p = $(this).attr('data-ref');
				self.out(data, p);
			});
			dataPage = self.page(data, page);
			self.selector.find('.data').html(self.outInfo(dataPage));
			self.selector.find('.data').find('tr').click(function(){
				var id = $(this).attr("data-id");
				var info = self.get(dataPage, id);
				self.outUserInfo(info);
			});
			self.hideLoader();
		},
		get: function(data, id){
			return data.filter(function(elem){return elem._id == id;})[0];
		},
		outInfo: function(data){
			return data.map(function(elem){
				return "<tr data-id=" + elem._id + ">" 
					+ main.names.map(function(e){
						return "<td>" + elem[e] + "</td>";
					}) 
					+ "</tr>"
					;
			}).reduce(function(html, elem){
				return html + elem;
			}, "");
		},
		outUserInfo: function(data){
			this.selector.find('.ui-field').each(function(){
				var name = $(this).attr('data-name');
				var subname = $(this).attr('data-subname');
				var ref = $(this).attr('data-ref');
				if(ref == "value"){
					$(this).val(subname ? data[name][subname] : data[name]);
				}else{
					$(this).html(subname ? data[name][subname] : data[name]);
				}
			});
			this.selector.find('.uinfo').slideDown();
		},
		outPages: function(count, page){
			var html = "";
			for(i = 1; i <= count; i++){
				if(i != page)
					html += "<li class='page' data-ref='" + i + "'>" + i + "</li>";
				else
					html += "<li class='page page-active' data-ref='" + i + "'>" + i + "</li>";
			}
			return html;
		},
		page: function(data, page){
			var offset = (page - 1) * this.count;
			return data.slice(offset, offset + this.count);
		},
		pages: function(data){
			return Math.ceil(data.length / this.count);
		},
		getOrder: function(){
			var orderAsc = this.selector.find('.asc').parent().attr('data-name');
			var orderDesc = this.selector.find('.desc').parent().attr('data-name');
			var field = orderAsc ? orderAsc : orderDesc;
			var rev = orderAsc ? 0 : 1;
			return [field, rev];
		},
		order: function(data, by, rev){
			var d = data.sort(function(a, b){
				if(a[by] < b[by]) 
					return rev ? 1 : -1;
				if(a[by] > b[by]) 
					return rev ? -1 : 1;
				return 0;
			});
			return d;
		},
		search: function(data, query){
			var self = this;
			query = query.toLowerCase();
			return data.filter(function(elem){
				return self.names.reduce(function(acc, e){
					return acc || elem[e].toString().toLowerCase().indexOf(query) != -1
				}, 0);
			});
		},
	}
	main.init($('#task'));
});