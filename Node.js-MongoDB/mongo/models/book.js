var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    author: String,
    published_date: {type: Date, default: Date.now}
});

// book은 해당 document가 사용할 collection의 단수적 표현
// 여기서는 books collection을 사용하게 된다.
// 자동으로 단수적 표현을 복수적(plural) 형태로 변호나하여 그걸 collection 이름으로 사용
// collection 이름을 plural 형태로 사용하건 mongodb의 네이밍컨벤션 중 하나

// 만약 collection 이름을 임의로 정하고 싶다면 schema를 만들 때 따로 설정
// Ex. var dataSchema = new Schema({ ... }, { collection: 'COLLECTION_NAME'})
module.exports = mongoose.model('book', bookSchema);