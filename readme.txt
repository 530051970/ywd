
#npm网络不稳定，这里使用淘宝镜像
npm config set proxy null
npm install cnpm -g --registry=https://registry.npm.taobao.org
ng set --global packageManager=cnpm

cnpm install -g @angular/cli
ng new XXXX  --routing
cd XXXX
cnpm install --save jquery@2.2.3  (bootstrap兼容)
cnpm install --save bootstrap@3.3.6
#typescript不识别jquery，bootstrap等插件，需要安装下面两个插件用来识别用
cnpm intall @types/jquery --save-dev
cnpm intall @types/bootstrap --save-dev
angular-cli中，更新第三方库引用：
 "styles": [
        "styles.css",
        "../node_modules/_bootstrap@3.3.6@bootstrap/dist/css/bootstrap.css"
      ],
      "scripts": [
        "../node_modules/_jquery@2.2.3@jquery/dist/jquery.js",
        "../node_modules/_bootstrap@3.3.6@bootstrap/dist/js/bootstrap.js"
      ],

#国际化插件
cnpm install @ngx-translate/core --save
cnpm install @ngx-translate/http-loader --save

#新建组件
ng g component navbar    #导航条
ng g component footer    #底部组件
ng g component search    #表单搜索组件
ng g component carousel  #轮播图组件
ng g component product   #产品信息组件
ng g component stars     #星级评价组件
#新建服务
ng g service XXXXX

npm i -g json-server (Mock Rest API)

ng serve --open
npm start


生成d.ts文件用
安装dtsmake命令  npm install -g dtsmake（根目录下安装）
安装tern命令  npm install -g tern
进入该文件目录下，dtsmake -s xxxxxx.js