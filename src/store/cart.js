import {observable, computed, action, runInAction} from 'mobx';

export default class{
    @observable products = []
    @observable processId = {}

    constructor(rootStore){
        this.rootStore = rootStore;
        this.api = this.rootStore.api.cart;
        this.storage = this.rootStore.storage;
        this.token = this.storage.getItem('cartToken');
    }

    @computed get productsDetailed(){
        return this.products.map((pr) => {
            let product = this.rootStore.products.getById(pr.id);
            return {...product, cnt: pr.cnt};
        });
    }

    @computed get inCart(){
        return (id) => this.products.some((product) => product.id === id);
    }
    /*
    @computed get inProcess(){
        return (id) => {
            //console.log(Object.keys(this.processId));
            return this.processId.hasOwnProperty(id.toString());
        }
    }*/

    @computed get cartCnt(){
        return this.products.length;
    }

    @computed get total(){
        return this.productsDetailed.reduce((t, pr) => {
            return t + pr.price * pr.cnt;
        }, 0);
    }

    @action load(){
        this.api.load(this.token).then((data) => {
            runInAction(() => {
                this.products = data.cart;
            
                if(data.needUpdate){
                    this.token = data.token;
                    this.storage.setItem('cartToken', this.token);
                }
            });
        }).catch(() => {
            // 
        });
    }

    @action add(id){
        if(!(this.inCart(id) || id in this.processId)){
            this.processId[id] = true;

            this.api.add(this.token, id).then((res) => {
                if(res){
                    this.products.push({id, cnt: 1});
                }
            }).catch(() => {
                this.rootStore.notifications.add('Can`t add item in cart! Try again!');
            }).finally(() => {
                delete this.processId[id];
            });
        }
    }

    @action change(id, cnt){
        if(!(id in this.processId)){
            let index = this.products.findIndex((pr) => pr.id === id);

            if(index !== -1){
                this.processId[id] = true;

                this.api.changeCnt(this.token, id, cnt).then((res) => {
                    this.products[index].cnt = cnt;
                    delete this.processId[id];
                });
            }
        }
    }

    @action remove(id){
        if(this.inCart(id) && !(id in this.processId)){
            let index = this.products.findIndex((pr) => pr.id === id);

            if(index !== -1){
                this.processId[id] = true;

                this.api.remove(this.token, id).then((res) => {
                    this.products.splice(index, 1);
                    delete this.processId[id];
                });
            }
        }
    }

    @action clean(){
        return new Promise((resolve, reject) => {
            this.api.clean(this.token).then((res) => {
                if(res){
                    this.products = [];
                    resolve();
                }
                else{
                    reject();
                }
            });
        });
    }
}











// server api
function getProducts(){
    return [
        {
            id: 100,
            title: 'Ipnone 200',
            price: 12000,
            rest: 10,
            current: 1
        },
        {
            id: 101,
            title: 'Samsung AAZ8',
            price: 22000,
            rest: 5,
            current: 1
        },
        {
            id: 103,
            title: 'Nokia 3310',
            price: 5000,
            rest: 2,
            current: 1
        },
        {
            id: 105,
            title: 'Huawei ZZ',
            price: 15000,
            rest: 8,
            current: 1
        }
    ];
}