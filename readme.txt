
#npm���粻�ȶ�������ʹ���Ա�����
npm config set proxy null
npm install cnpm -g --registry=https://registry.npm.taobao.org
ng set --global packageManager=cnpm

cnpm install -g @angular/cli
ng new XXXX  --routing
cd XXXX
cnpm install jquery --save
cnpm install --save bootstrap@3.3.6
#typescript��ʶ��jquery��bootstrap�Ȳ������Ҫ��װ���������������ʶ����
cnpm intall @types/jquery --save-dev
cnpm intall @types/bootstrap --save-dev
#���ʻ����
cnpm install @ngx-translate/core --save
cnpm install @ngx-translate/http-loader --save

#�½����
ng g component navbar    #������
ng g component footer    #�ײ����
ng g component search    #���������
ng g component carousel  #�ֲ�ͼ���
ng g component product   #��Ʒ��Ϣ���
ng g component stars     #�Ǽ��������
#�½�����
ng g service XXXXX

ng serve --open
npm start