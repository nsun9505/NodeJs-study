const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {
        if(process.env.NODE_ENV !== 'production'){
            mongoose.set('debug', true);
        }
        mongoose.connect('mongodb://root:root@localhost:27017/admin', {
            dbName: 'nodejs',
        }, (err) => {
            if(err)
                console.log('몽고디비 연결 에러', err);
            else
                console.log('몽고디비 연결 성공');
        });
    }

    connect();
    mongoose.connection.on('error', (error) => {
        console.error('몽고디비 연결 에러', error);
    })
    mongoose.connection.on('disconnected', () => {
        console.log('몽고디비 연결이 끊어졌습니다. 연결을 재시도합니다.');
        connect();
    })

    // 정의할 스키마 연결하는 부분
    require('./user');
    require('./comments');
}