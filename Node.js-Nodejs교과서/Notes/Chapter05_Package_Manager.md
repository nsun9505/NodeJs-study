# Chpater 05. 패키지 매니저

## npm?
### npm은 Node Package Manager의 약어로, 노드 패키지 매니저이다.
- 대부분의 자바스크립트 프로그램은 패키지라는 이름으로 npm에 등록되어 있으므로 특정 기능을 하는 패키지가 필요하다면 npm에서 찾아 설치하면 된다.
- npm에 업로드된 모듈을 패키지라고 부른다.

## package.json으로 패키지 관리
### 설치한 패키지의 버전을 관리하는 파일 : package.json
- npm은 package.json을 만드는 명려어를 제공
  ```
    $ npm init
  ```

- npm 설치 시, --save 옵션
  - dependencies에 패키지 이름을 추가하는 옵션이지만 npm@5부터는 기본값으로 설정되어 있어서 별도로 붙이지 않아도 된다.

### global install
- 패키지를 현재 폴더에 node_modules에 설치하는 것이 아니라 npm이 설치되어 있는 디렉터리에 설치
  - 디렉토리의 경로는 보통 시스템 환경 변수에 등록되어 있으므로 전역 설치한 패키지는 콘솔의 커맨드로 사용할 수 있음.
- node_modules는 언제든지 npm install로 설치할 수 있으므로 node_modules는 보관할 필요가 없음.
  - git을 사용할 때 .gitignore에 node_modules 포함시키기

## 패키지 버전
- 노드 패키지들의 버전은 항상 세 자리로 이루어져 있음.
  - SemVer(Sementic Versioning) 방식의 넘버링을 따르기 때문
- 버전의 첫 번째 자리는 major 버전
  - 0은 초기 개발 중. 1부터는 정식 버전
- 두 번째 자리는 minor 버전
  - 하위 호환이 되는 기능 업데이트 시에 올린다.
  - Ex. 1.6.0은 1.5.0에 대한 호환성 문제가 없어야 함.
- 세 번째 자리는 patch 버전
  - 기존 기능에 문제가 있어 수정한 것을 배포했을 때 patch 버전을 올린다.
- 수정 사항이 생기면 major, minor, patch 중 하나를 의미에 맞게 올려서 새로운 버전을 배포.