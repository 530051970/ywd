        connectUrl = function (url) {
        var data;
            //请求xml数据
            data = "\
                  <?xml version='1.0' encoding='utf-8'?>\
                  <xmlhttpuest>\
                    <FirstName>Chen</FirstName>\
                    <LastName>Fox</LastName>\
                   </xmlhttpuest>\
                 ";

            if (window.XDomainRequest) { //为了解决IE的跨域问题
                crossDomainIE();
            }
            else {
                noCrossDomain();
            }
        }

        //IE浏览器，解决跨域访问
        function crossDomainIE() {
            // Use Microsoft XDR
            var xdr = new XDomainRequest();
            xdr.open("POST", url);
            xdr.onload = function () {
                // XDomainRequest doesn't provide responseXml, so if you need it:
                var dom = new ActiveXObject("Microsoft.XMLDOM");
                dom.async = false;

                displayData(xdr.responseText);
            };
            xdr.send(data);
        }

        //其它浏览器，默认无跨域问题
        function noCrossDomain() {
            var xmlhttp = createXMLHttp();
            xmlhttp.open("POST", url);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
            xmlhttp.send(data);

            // Create the callback:
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState != 4) {
                    return; // Not there yet
                }

                if (xmlhttp.status != 200) {
                    return;
                }
                displayData(xmlhttp.responseText);
            }
        }

        //创建ajax http对象
        function createXMLHttp() {
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            return xmlhttp;
        }

        //将xml文本转换为xml dom
        function convertXml2Dom(xmlData) {
            if (window.ActiveXObject) {
                //for IE
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xmlData);
                return xmlDoc;
            } else if (document.implementation && document.implementation.createDocument) {
                //for Others
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlData, "text/xml");
                return xmlDoc;
            }
        }

        //显示查询结果
        function displayData(resp) {
            var xmlObject = convertXml2Dom(resp);

            document.getElementById("lblAge").innerText = xmlObject.getElementsByTagName("Age")[0].childNodes[0].nodeValue;

            //相同值再次赋值给innerHTML是应为innerText在firefox中无效，暂不知道原因
            document.getElementById("lblAge").innerHTML = xmlObject.getElementsByTagName("Age")[0].childNodes[0].nodeValue;
        }
  