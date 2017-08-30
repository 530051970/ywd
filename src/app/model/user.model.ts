export class User {
    constructor() {}
    public id: string;            // 用户ID
    public email: string;         // 邮箱
    public password: string;      // 密码
    public type: string;          // 用户类型：01：猎头公司 02：客户公司
    public role: string;           // 用户权限: 0101:管理  0102:市场  0103:营业  （←猎头公司）（客户公司→） 0201：总部   0202：分部
} 