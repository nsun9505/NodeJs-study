# PM2 설치 방법
``` 
$ npm install pm2 -g
```

# 사용방법
- 변경이 발생하면 적용시켜줌.
  따로 node app/main.js와 같이 다시 실행시키지 않아도 됨.
```
 $ pm2 start main.js --watch
```
- 실행시킨 것들에 대한 로그를 볼 수 있음.
```
 $ pm2 log
```
- 모니터링
```
 $ pm monit
```


