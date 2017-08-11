
#npm网络不稳定，这里使用淘宝镜像
npm config set proxy null
npm install cnpm -g --registry=https://registry.npm.taobao.org
ng set --global packageManager=cnpm

cnpm install -g @angular/cli
ng new XXXX  --routing
cd XXXX
cnpm install jquery --save
cnpm install --save bootstrap@3.3.6
#typescript不识别jquery，bootstrap等插件，需要安装下面两个插件用来识别用
cnpm intall @types/jquery --save-dev
cnpm intall @types/bootstrap --save-dev
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

ng serve --open
npm start