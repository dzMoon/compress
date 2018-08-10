
var tools = {
	/*
	 @param base64 图片为base64
	 @param rate 图片压缩比例
	 @param callBack 回调函数，对压缩后的图片进行处理 
	*/
	compress: function (base64,rate,callBack) {
	    var img = new Image();
	    img.src = base64;
	    img.onload = function() {
	        var canvas = document.createElement("canvas");
	        canvas.width = img.width * rate;
	        canvas.height = img.height * rate;
	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(img, 0, 0, img.width * rate, img.height * rate);
	        var dataURL =canvas.toDataURL("image/jpeg", rate);
	        callBack(dataURL)
	    }
	},
	// 上传身份证照片
	uploadIDCard: function () {
	    wx.chooseImage({
	        count: 1, // 默认9
	        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	        success: function (res) {
	            var localIds = res.localIds;
	            wx.getLocalImgData({
	                localId: localIds[0], // 图片的localID
	                success: function (res) {
	                    var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
	                    if (window.__wxjs_is_wkwebview) { // 如果是IOS，需要去掉前缀
	                        localData = localData.replace('jgp', 'jpeg');
	                        tools.reqFun10010(localData);
	                    } else { // 如果是安卓，图片本身上传比较大，需要进行压缩
	                        localData = 'data:image/jpeg;base64,' + localData;
	                        if(localData.length > 100 * 1024) { //图片大于100k，不允许上传
		                        alert("图片过大，请重新选择图片");
		                        return;
		                    }
	                        tools.compress(localData,0.75,function(dataRUL){
	                            tools.reqFun10010(dataRUL);
	                        })
	                    }
	                   
	                }
	            })
	        },
	        fail: function (err) {
	            $.alert(JSON.stringify(err));
	        }
	    })
	}
}
